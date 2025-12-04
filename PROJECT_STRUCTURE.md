# 📁 Proje Yapısı

## Genel Bakış

```
project/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.jsx   # Navigasyon ve menü
│   │   │   └── Footer.jsx   # Alt bilgi
│   │   ├── pages/            # Sayfa komponentleri
│   │   │   ├── HomePage.jsx      # Ana sayfa (koç listesi)
│   │   │   ├── CoachProfile.jsx  # Koç detay sayfası
│   │   │   ├── Register.jsx      # Koç kayıt formu
│   │   │   ├── Login.jsx         # Koç giriş sayfası
│   │   │   ├── Dashboard.jsx     # Koç profil yönetimi
│   │   │   └── Messages.jsx      # Mesaj yönetimi
│   │   ├── services/         # API servisleri
│   │   │   └── api.js        # Axios configuration ve API calls
│   │   ├── App.jsx           # Ana uygulama komponenti
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global stiller ve Tailwind
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config (renk paleti)
│   └── postcss.config.js     # PostCSS configuration
│
├── server/                    # Node.js Backend
│   ├── database/
│   │   ├── schema.sql        # PostgreSQL veritabanı şeması
│   │   └── db.js             # Veritabanı bağlantısı
│   ├── routes/
│   │   ├── coaches.js        # Koç CRUD işlemleri
│   │   └── messages.js       # Mesaj işlemleri
│   └── index.js              # Express server entry point
│
├── .gitignore                 # Git ignore rules
├── .editorconfig             # Editor configuration
├── .npmrc                    # NPM configuration
├── package.json              # Backend dependencies ve scripts
├── README.md                 # Ana proje dökümanı
├── SETUP_GUIDE.md            # Adım adım kurulum rehberi
├── HCI_FEATURES.md           # HCI ve erişilebilirlik detayları
└── PROJECT_STRUCTURE.md      # Bu dosya
```

## 📄 Dosya Açıklamaları

### Frontend (Client)

#### Components
| Dosya | Açıklama | Önemli Özellikler |
|-------|----------|-------------------|
| `Header.jsx` | Site başlığı ve navigasyon | - Responsive menü<br>- Kullanıcı durumu<br>- Mobile hamburger menü<br>- ARIA labels |
| `Footer.jsx` | Site alt bilgisi | - Site bilgileri<br>- Hızlı linkler<br>- Erişilebilirlik notu |

#### Pages
| Dosya | Route | Açıklama | Auth Gerekli |
|-------|-------|----------|--------------|
| `HomePage.jsx` | `/` | Koç listesi ve filtreleme | ❌ |
| `CoachProfile.jsx` | `/coach/:id` | Koç detay ve mesaj gönderme | ❌ |
| `Register.jsx` | `/register` | Koç kayıt formu | ❌ |
| `Login.jsx` | `/login` | Koç giriş | ❌ |
| `Dashboard.jsx` | `/dashboard` | Koç profil yönetimi | ✅ |
| `Messages.jsx` | `/messages` | Mesaj kutusu | ✅ |

#### Services
- **api.js**: Tüm API çağrıları
  - Axios instance
  - Token interceptor
  - Coaches API (getAll, getById, register, login, updateProfile)
  - Messages API (send, getMyMessages, markAsRead, getUnreadCount)

### Backend (Server)

#### Database
- **schema.sql**: PostgreSQL tabloları
  - `coaches` tablosu (koç bilgileri)
  - `messages` tablosu (mesajlar)
  - İndeksler ve ilişkiler
  - Örnek veriler

- **db.js**: PostgreSQL connection pool

#### Routes

**coaches.js** - Koç İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/coaches` | Tüm koçları getir (filtreleme) | ❌ |
| GET | `/api/coaches/:id` | Koç detayı | ❌ |
| POST | `/api/coaches/register` | Yeni koç kaydı | ❌ |
| POST | `/api/coaches/login` | Koç girişi | ❌ |
| PUT | `/api/coaches/profile` | Profil güncelle | ✅ |
| GET | `/api/coaches/meta/specialties` | Uzmanlık alanları | ❌ |

**messages.js** - Mesaj İşlemleri
| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/messages` | Mesaj gönder | ❌ |
| GET | `/api/messages/my-messages` | Koçun mesajları | ✅ |
| PATCH | `/api/messages/:id/read` | Okundu işaretle | ✅ |
| GET | `/api/messages/unread-count` | Okunmamış sayısı | ✅ |

## 🎨 Styling System

### Tailwind Utility Classes

**Buttons:**
- `.btn` - Base button
- `.btn-primary` - Ana aksiyon butonları (mavi)
- `.btn-secondary` - İkincil butonlar (gri)
- `.btn-outline` - Çerçeveli butonlar

**Cards:**
- `.card` - Standart kart komponenti (white bg, shadow, rounded)

**Inputs:**
- `.input` - Standart input alanı
- `.label` - Input label'ı

**Badges:**
- `.badge` - Base badge
- `.badge-primary` - Mavi badge
- `.badge-success` - Yeşil badge

**Layout:**
- `.container-custom` - Merkezi container (max-width + padding)

### Renk Sistemi

IBM Design Language renk paleti:

```javascript
colors: {
  primary: { 500: '#0f62fe' },    // Mavi
  success: { 500: '#198038' },    // Yeşil
  warning: { 500: '#f1c21b' },    // Sarı
  danger: { 500: '#da1e28' },     // Kırmızı
  neutral: { 50-900 }             // Gri tonları
}
```

## 🔐 Authentication Flow

```
1. Koç Register/Login
   ↓
2. JWT Token oluşturulur
   ↓
3. Token localStorage'a kaydedilir
   ↓
4. Token her API isteğinde Header'da gönderilir
   ↓
5. Backend JWT'yi verify eder
   ↓
6. Korunmuş endpoint'lere erişim
```

## 📡 Data Flow

```
Component → API Service → Backend Route → Database
    ↑                                           ↓
    └───────────── Response ←──────────────────┘
```

Örnek (Koç Listesi):
```
HomePage.jsx 
  → coachesAPI.getAll() 
  → GET /api/coaches 
  → coaches.js route 
  → PostgreSQL query 
  → Response 
  → HomePage setState
```

## 🎯 State Management

**Local Component State (useState):**
- Form inputs
- UI states (loading, errors)
- Modal visibility

**Local Storage:**
- JWT token
- User data (persist login)

**Props:**
- User data (App → Pages)
- Callbacks (onLogin, onLogout)

## 🔄 Component Lifecycle

**HomePage Example:**
```
Mount → useEffect → fetchCoaches → setLoading(true)
  ↓
API Call → Success → setCoaches(data) → setLoading(false)
  ↓
Render → Map coaches → Display cards
  ↓
User interaction → Filter change → Re-fetch
```

## 📦 Dependencies

### Frontend
- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `vite` - Build tool

### Backend
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT auth
- `cors` - CORS middleware
- `dotenv` - Environment variables

## 🚀 Build & Deploy

### Development
```bash
npm run dev          # Both frontend & backend
npm run server       # Backend only
npm run client       # Frontend only
```

### Production
```bash
cd client
npm run build        # Creates dist/ folder
```

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coach_platform
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
PORT=3001
```

## 📊 Database Schema

### Coaches Table
```sql
id (SERIAL, PK)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
full_name (VARCHAR)
bio (TEXT)
hourly_rate (DECIMAL)
specialties (TEXT[])
profile_image (VARCHAR)
years_experience (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Messages Table
```sql
id (SERIAL, PK)
coach_id (INTEGER, FK → coaches.id)
sender_name (VARCHAR)
sender_email (VARCHAR)
message (TEXT)
is_read (BOOLEAN)
created_at (TIMESTAMP)
```

## 🔍 Key Features Implementation

### Filtering (HomePage)
- State: filters object
- API: Query parameters
- Backend: Dynamic SQL WHERE clauses
- Result: Filtered coach list

### Messaging (CoachProfile)
- Form: Contact form
- API: POST /api/messages
- Backend: Insert into messages table
- Feedback: Success message

### Authentication (Login/Register)
- Form: Email/Password
- API: POST /api/coaches/login
- Backend: bcrypt verify + JWT sign
- Storage: Token in localStorage
- Protection: Token in axios interceptor

### Profile Management (Dashboard)
- Auth check: Redirect if no user
- Form: Pre-filled with user data
- API: PUT /api/coaches/profile
- Update: Refresh localStorage

## 🎓 Learning Resources

Bu projede kullanılan teknolojiler hakkında daha fazla bilgi:

- **React**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Express**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **WCAG**: https://www.w3.org/WAI/WCAG21/quickref/
- **HCI**: Nielsen's 10 Usability Heuristics

---

**Not**: Bu yapı, ölçeklenebilirlik ve maintainability göz önünde bulundurularak tasarlanmıştır.

