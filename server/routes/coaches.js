import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

const router = express.Router();

// Get all coaches with message count (public route - no auth required)
router.get('/', async (req, res) => {
  try {
    const { specialty, minRate, maxRate, search, minExperience, maxExperience } = req.query;
    
    let query = `
      SELECT 
        c.id, c.email, c.full_name, c.bio, c.hourly_rate, c.specialties, 
        c.profile_image, c.years_experience, c.created_at,
        COALESCE(COUNT(m.id), 0)::integer as message_count
      FROM coaches c
      LEFT JOIN messages m ON c.id = m.coach_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by specialty
    if (specialty) {
      query += ` AND $${paramIndex} = ANY(c.specialties)`;
      params.push(specialty);
      paramIndex++;
    }

    // Filter by minimum rate
    if (minRate) {
      query += ` AND c.hourly_rate >= $${paramIndex}`;
      params.push(parseFloat(minRate));
      paramIndex++;
    }

    // Filter by maximum rate
    if (maxRate) {
      query += ` AND c.hourly_rate <= $${paramIndex}`;
      params.push(parseFloat(maxRate));
      paramIndex++;
    }

    // Filter by minimum experience
    if (minExperience) {
      query += ` AND c.years_experience >= $${paramIndex}`;
      params.push(parseInt(minExperience));
      paramIndex++;
    }

    // Filter by maximum experience
    if (maxExperience) {
      query += ` AND c.years_experience <= $${paramIndex}`;
      params.push(parseInt(maxExperience));
      paramIndex++;
    }

    // Search by name or bio
    if (search) {
      query += ` AND (c.full_name ILIKE $${paramIndex} OR c.bio ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Koçları getirirken hata:', error);
    res.status(500).json({ error: 'Koçlar getirilirken bir hata oluştu' });
  }
});

// Get coach by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, full_name, bio, hourly_rate, specialties, profile_image, years_experience, created_at FROM coaches WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Koç getirilirken hata:', error);
    res.status(500).json({ error: 'Koç getirilirken bir hata oluştu' });
  }
});

// Register new coach
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, bio, hourly_rate, specialties, years_experience } = req.body;

    // Validation
    if (!email || !password || !full_name || !hourly_rate || !specialties || specialties.length === 0) {
      return res.status(400).json({ error: 'Lütfen tüm gerekli alanları doldurun' });
    }

    // Check if email already exists
    const existingCoach = await pool.query('SELECT id FROM coaches WHERE email = $1', [email]);
    if (existingCoach.rows.length > 0) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert coach
    const result = await pool.query(
      'INSERT INTO coaches (email, password_hash, full_name, bio, hourly_rate, specialties, years_experience) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, full_name, bio, hourly_rate, specialties, years_experience',
      [email, password_hash, full_name, bio || '', hourly_rate, specialties, years_experience || 0]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Kayıt başarılı',
      coach: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu' });
  }
});

// Login coach
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email ve şifre gereklidir' });
    }

    // Get coach
    const result = await pool.query('SELECT * FROM coaches WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    const coach = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, coach.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: coach.id, email: coach.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password_hash from response
    delete coach.password_hash;

    res.json({
      message: 'Giriş başarılı',
      coach,
      token
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Giriş sırasında bir hata oluştu' });
  }
});

// Update coach profile (requires auth)
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { full_name, bio, hourly_rate, specialties, years_experience } = req.body;

    const result = await pool.query(
      'UPDATE coaches SET full_name = $1, bio = $2, hourly_rate = $3, specialties = $4, years_experience = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, email, full_name, bio, hourly_rate, specialties, years_experience',
      [full_name, bio, hourly_rate, specialties, years_experience, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    res.json({
      message: 'Profil güncellendi',
      coach: result.rows[0]
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu' });
  }
});

// Get all unique specialties
router.get('/meta/specialties', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT unnest(specialties) as specialty FROM coaches ORDER BY specialty');
    res.json(result.rows.map(row => row.specialty));
  } catch (error) {
    console.error('Uzmanlık alanları getirilirken hata:', error);
    res.status(500).json({ error: 'Uzmanlık alanları getirilirken bir hata oluştu' });
  }
});

// Change password (requires auth)
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Mevcut ve yeni şifre gereklidir' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalıdır' });
    }

    // Get current password hash
    const result = await pool.query('SELECT password_hash FROM coaches WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(current_password, result.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Mevcut şifre yanlış' });
    }

    // Hash new password
    const new_password_hash = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE coaches SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [new_password_hash, decoded.id]
    );

    res.json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ error: 'Şifre değiştirilirken bir hata oluştu' });
  }
});

// Forgot password - Send reset token (simplified version)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email gereklidir' });
    }

    const result = await pool.query('SELECT id, email FROM coaches WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      // Don't reveal if email exists or not (security)
      return res.json({ message: 'Eğer bu email kayıtlıysa, şifre sıfırlama talimatları gönderildi' });
    }

    // In a real app, you would:
    // 1. Generate a reset token
    // 2. Save it to database with expiry
    // 3. Send email with reset link
    
    // For this demo, we'll just return success
    res.json({ 
      message: 'Şifre sıfırlama talimatları email adresinize gönderildi',
      // For demo purposes only - remove in production!
      demo_note: 'Bu demo versiyonudur. Gerçek uygulamada email gönderilir.'
    });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({ error: 'Şifre sıfırlama isteği işlenirken bir hata oluştu' });
  }
});

// Upload profile image (simplified - in real app use multer for file upload)
router.put('/profile-image', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { profile_image } = req.body;

    if (!profile_image) {
      return res.status(400).json({ error: 'Profil resmi URL gereklidir' });
    }

    const result = await pool.query(
      'UPDATE coaches SET profile_image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING profile_image',
      [profile_image, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    res.json({
      message: 'Profil resmi güncellendi',
      profile_image: result.rows[0].profile_image
    });
  } catch (error) {
    console.error('Profil resmi güncelleme hatası:', error);
    res.status(500).json({ error: 'Profil resmi güncellenirken bir hata oluştu' });
  }
});

// Delete coach account (requires auth)
router.delete('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Delete coach (messages cascade due to FK)
    const result = await pool.query('DELETE FROM coaches WHERE id = $1 RETURNING id, email', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    res.json({ message: 'Hesabınız silindi', coach: result.rows[0] });
  } catch (error) {
    console.error('Hesap silme hatası:', error);
    res.status(500).json({ error: 'Hesap silinirken bir hata oluştu' });
  }
});

export default router;

