# 🎯 Koç Platformu - Modern Coaching Platform

Modern ve erişilebilir bir koçluk platformu. Human-Computer Interaction (HCI) prensipleri ve WCAG 2.1 AA erişilebilirlik standartlarına uygun olarak geliştirilmiştir.

## ✨ Özellikler

### Kullanıcı Özellikleri
- 🔍 **Koç Arama ve Filtreleme**: Uzmanlık alanı, fiyat aralığı ve arama terimine göre koçları filtreleyin
- 👤 **Koç Profilleri**: Detaylı koç profilleri ve iletişim bilgileri
- 💬 **Mesajlaşma Sistemi**: Koçlara doğrudan mesaj gönderin
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- ⚙️ **Ayarlar (Herkes İçin)**: Dark mode ve yazı boyutu ayarları (giriş gerektirmez)
- ⌨️ **Klavye Kısayolları**: H (Ana Sayfa), S (Ayarlar), D (Dark Mode), M (Mesajlar), P (Profil)

### Koç Özellikleri
- 📝 **Profil Yönetimi**: Uzmanlık alanları, saatlik ücret ve biyografi düzenleme
- 📸 **Profil Fotoğrafı**: Cihazdan fotoğraf yükleme (maks. 2MB) + önizleme
- 📨 **Mesaj Yönetimi**: Gelen mesajları görüntüleyin, okuyun ve **silin** (onay dialogu ile)
- 🔐 **Güvenli Giriş**: JWT tabanlı kimlik doğrulama
- 🔒 **Şifre Değiştirme**: Güvenlik için şifre değiştirme ve şifre sıfırlama
- 💾 **Unsaved Changes**: Kaydedilmemiş değişiklikler uyarısı
- 🔔 **Toast Notifications**: Her işlem sonrası net geri bildirim

### HCI ve Erişilebilirlik
- ♿ **WCAG 2.1 AA Uyumlu**: Tüm erişilebilirlik standartlarına uygun
- 🎨 **Renk Körü Dostu**: IBM Design Language renk paleti kullanılarak tasarlanmıştır
- ⌨️ **Klavye Navigasyonu**: Tüm özellikler klavye ile kullanılabilir
- 🔊 **Screen Reader Desteği**: ARIA etiketleri ile tam destek
- 🎯 **Yüksek Kontrast**: Okunabilirlik için optimize edilmiş renkler (21:1 dark mode'da)
- ⚡ **Reduced Motion**: Animasyon hassasiyeti olan kullanıcılar için destek
- 🌙 **Dark Mode**: Göz yorgunluğunu azaltan koyu tema (21:1 kontrast)
- 📏 **Font Size Ayarı**: 4 yazı boyutu seçeneği (14px - 20px) - Görme zorluğu olanlar için
- 🔄 **Kullanıcı Tercihleri**: Tema, font boyutu ve filtreler localStorage'da saklanır
- ⌨️ **Klavye Desteği**: Tüm özelliklere klavye ile erişim
- 🔔 **Toast Notifications**: Progress bar ile kapanış hissi
- ❓ **Yardım Modalı**: ? tuşu ile klavye kısayolları rehberi

## 🛠 Teknolojiler

### Frontend
- ⚛️ **React 18** - Modern UI framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🚀 **Vite** - Hızlı build tool
- 🧭 **React Router** - Client-side routing
- 📡 **Axios** - HTTP client

### Backend
- 🟢 **Node.js** - Runtime environment
- 🚂 **Express** - Web framework
- 🐘 **PostgreSQL** - Veritabanı
- 🔐 **JWT** - Kimlik doğrulama
- 🔒 **bcrypt** - Şifre hashleme

## 📋 Gereksinimler

- Node.js 18 veya üzeri
- PostgreSQL 12 veya üzeri
- npm veya yarn

## 🚀 Kurulum

### 1. Depoyu Klonlayın

```bash
git clone <repository-url>
cd project
```

### 2. Bağımlılıkları Yükleyin

Backend bağımlılıkları:
```bash
npm install
```

Frontend bağımlılıkları:
```bash
cd client
npm install
cd ..
```

### 3. PostgreSQL Veritabanını Kurun

PostgreSQL'i çalıştırın ve yeni bir veritabanı oluşturun:

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE coach_platform;

# Veritabanından çıkın
\q
```

### 4. Veritabanı Şemasını Oluşturun

```bash
psql -U postgres -d coach_platform -f server/database/schema.sql
```

### 5. Ortam Değişkenlerini Ayarlayın

`.env` dosyası zaten oluşturulmuştur. PostgreSQL şifrenizi güncelleyin:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coach_platform
DB_USER=postgres
DB_PASSWORD=SIZIN_SIFRENIZ  # Buraya kendi şifrenizi yazın
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
```

## 🎮 Uygulamayı Çalıştırma

### Development Mode (Her İkisi Birden)

```bash
npm run dev
```

Bu komut hem backend hem de frontend'i aynı anda başlatır:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### Ayrı Ayrı Çalıştırma

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run client
```

## 📊 Veritabanı Şeması

### Coaches Tablosu
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `full_name` - Coach's full name
- `bio` - Biography
- `hourly_rate` - Hourly coaching rate
- `specialties` - Array of specialties
- `years_experience` - Years of experience
- `profile_image` - Profile image URL (optional)
- `created_at` - Registration date
- `updated_at` - Last update date

### Messages Tablosu
- `id` - Primary key
- `coach_id` - Foreign key to coaches table
- `sender_name` - Message sender's name
- `sender_email` - Message sender's email
- `message` - Message content
- `is_read` - Read status
- `created_at` - Message sent date

## 🎨 HCI Prensipleri

### 1. **Visibility (Görünürlük)**
- Açık ve anlaşılır navigasyon
- Durum göstergeleri (loading, success, error)
- Görsel geri bildirimler

### 2. **Feedback (Geri Bildirim)**
- Her kullanıcı etkileşimi için anında geri bildirim
- Form validasyonu mesajları
- Başarı ve hata bildirimleri
- Loading states

### 3. **Constraints (Kısıtlamalar)**
- Form validasyonları
- Input tipleri ve formatları
- Disabled states

### 4. **Consistency (Tutarlılık)**
- Tüm sayfalarda tutarlı tasarım
- Standart button ve input stilleri
- Tutarlı renk paleti

### 5. **Error Prevention & Recovery**
- Validasyon ile hata önleme
- Açık hata mesajları
- Kolay hata düzeltme

### 6. **Recognition vs. Recall**
- Açık etiketler ve placeholder'lar
- İkonlar ve görsel ipuçları
- Breadcrumbs ve navigasyon yardımcıları

## ♿ Erişilebilirlik Özellikleri

### Renk Körü Dostluğu
- IBM Design renk paleti (Deuteranopia/Protanopia/Tritanopia dostu)
- Sadece renge bağımlı olmayan tasarım
- İkonlar ve şekillerle desteklenmiş bilgi

### Klavye Navigasyonu
- Tab ile tüm interaktif elementlere erişim
- Skip to main content linki
- Focus indicators
- Escape ile modal kapatma

### Screen Reader Desteği
- Semantic HTML
- ARIA labels ve roles
- ARIA live regions
- Alt texts

### Diğer
- Yüksek kontrast oranları (WCAG AA)
- Büyük touch targets (44x44px minimum)
- Reduced motion desteği
- Font boyutu ve line-height optimizasyonu

## 📱 Sayfa Yapısı

- `/` - Ana sayfa (Koç listesi ve filtreleme)
- `/coach/:id` - Koç profil detayı ve mesaj gönderme
- `/register` - Koç kayıt
- `/login` - Koç girişi (Şifremi unuttum özelliği ile)
- `/dashboard` - Koç profil yönetimi (3 sekme: Profil Bilgileri, Profil Resmi, Şifre Değiştir)
- `/messages` - Mesaj yönetimi (okuma, okundu işaretleme, silme)
- `/settings` - **Ayarlar (Herkes için)**: Dark/Light mode ve Font size ayarları

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Bcrypt ile şifre hashleme
- SQL injection koruması (parameterized queries)
- XSS koruması
- CORS ayarları

## 🎯 API Endpoints

### Coaches
- `GET /api/coaches` - Tüm koçları getir (filtreleme desteği)
- `GET /api/coaches/:id` - Koç detayı
- `POST /api/coaches/register` - Yeni koç kaydı
- `POST /api/coaches/login` - Koç girişi
- `PUT /api/coaches/profile` - Profil güncelleme (auth required)
- `GET /api/coaches/meta/specialties` - Tüm uzmanlık alanları

### Messages
- `POST /api/messages` - Mesaj gönder
- `GET /api/messages/my-messages` - Koçun mesajları (auth required)
- `PATCH /api/messages/:id/read` - Okundu işaretle (auth required)
- `GET /api/messages/unread-count` - Okunmamış mesaj sayısı (auth required)

## 🧪 Test Kullanıcıları

Schema.sql dosyası örnek koçlar içerir (şifre: test123):
- ahmet.yilmaz@example.com - Kariyer Koçu
- zeynep.kaya@example.com - Yaşam Koçu
- mehmet.demir@example.com - Fitness Koçu

**Test Senaryoları:**
1. ⚙️ **Ayarlar** (giriş yapmadan): Dark mode ve font size dene
2. 📝 **Kayıt Ol**: Yeni koç hesabı oluştur
3. 📸 **Profil Resmi**: Cihazdan fotoğraf yükle (maks 2MB)
4. 🔒 **Şifre Değiştir**: Eski şifre + yeni şifre + tekrar
5. 💬 **Mesaj Gönder**: Bir koça mesaj gönder
6. 📨 **Mesaj Sil**: Gelen mesajı sil (onay dialogu)
7. ❓ **Şifremi Unuttum**: Giriş sayfasından şifre sıfırlama

## 🚀 Production Build

Frontend build:
```bash
cd client
npm run build
```

Build dosyaları `client/dist` klasöründe oluşturulacaktır.

## 📝 Notlar

- Local development için `.env` dosyası gereklidir
- PostgreSQL şifrenizi `.env` dosyasında güncellemeyi unutmayın
- Production'da JWT_SECRET'ı mutlaka değiştirin
- CORS ayarlarını production için güncelleyin

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License

## 👨‍💻 Geliştirici

Human Computer Interaction dersi projesi olarak geliştirilmiştir.

---

**Not**: Bu proje eğitim amaçlıdır ve HCI prensipleri ile erişilebilirlik standartlarını göstermek için tasarlanmıştır.

