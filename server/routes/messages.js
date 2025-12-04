import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

const router = express.Router();

// Send message to a coach (public route)
router.post('/', async (req, res) => {
  try {
    const { coach_id, sender_name, sender_email, message } = req.body;

    // Validation
    if (!coach_id || !sender_name || !sender_email || !message) {
      return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
    }

    // Check if coach exists
    const coachExists = await pool.query('SELECT id FROM coaches WHERE id = $1', [coach_id]);
    if (coachExists.rows.length === 0) {
      return res.status(404).json({ error: 'Koç bulunamadı' });
    }

    // Insert message
    const result = await pool.query(
      'INSERT INTO messages (coach_id, sender_name, sender_email, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [coach_id, sender_name, sender_email, message]
    );

    res.status(201).json({
      message: 'Mesajınız gönderildi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ error: 'Mesaj gönderilirken bir hata oluştu' });
  }
});

// Get messages for logged-in coach (requires auth)
router.get('/my-messages', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const result = await pool.query(
      'SELECT * FROM messages WHERE coach_id = $1 ORDER BY created_at DESC',
      [decoded.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Mesajları getirirken hata:', error);
    res.status(500).json({ error: 'Mesajlar getirilirken bir hata oluştu' });
  }
});

// Mark message as read (requires auth)
router.patch('/:id/read', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { id } = req.params;

    // Verify message belongs to this coach
    const result = await pool.query(
      'UPDATE messages SET is_read = true WHERE id = $1 AND coach_id = $2 RETURNING *',
      [id, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı veya yetkiniz yok' });
    }

    res.json({
      message: 'Mesaj okundu olarak işaretlendi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj güncelleme hatası:', error);
    res.status(500).json({ error: 'Mesaj güncellenirken bir hata oluştu' });
  }
});

// Mark message as unread (requires auth)
router.patch('/:id/unread', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE messages SET is_read = false WHERE id = $1 AND coach_id = $2 RETURNING *',
      [id, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı veya yetkiniz yok' });
    }

    res.json({
      message: 'Mesaj okunmadı olarak işaretlendi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj güncelleme hatası:', error);
    res.status(500).json({ error: 'Mesaj güncellenirken bir hata oluştu' });
  }
});

// Get unread message count (requires auth)
router.get('/unread-count', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const result = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE coach_id = $1 AND is_read = false',
      [decoded.id]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Okunmamış mesaj sayısı getirilirken hata:', error);
    res.status(500).json({ error: 'Okunmamış mesaj sayısı getirilirken bir hata oluştu' });
  }
});

// Delete message (requires auth)
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { id } = req.params;

    // Verify message belongs to this coach
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 AND coach_id = $2 RETURNING *',
      [id, decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı veya yetkiniz yok' });
    }

    res.json({
      message: 'Mesaj silindi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    res.status(500).json({ error: 'Mesaj silinirken bir hata oluştu' });
  }
});

// Delete all messages (requires auth)
router.delete('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const result = await pool.query(
      'DELETE FROM messages WHERE coach_id = $1 RETURNING *',
      [decoded.id]
    );

    res.json({
      message: `${result.rowCount} mesaj silindi`,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Tüm mesajları silme hatası:', error);
    res.status(500).json({ error: 'Mesajlar silinirken bir hata oluştu' });
  }
});

export default router;

