# 🚀 Koç Platformu - Hızlı Kurulum Rehberi

Bu rehber, projeyi adım adım nasıl kuracağınızı ve çalıştıracağınızı gösterir.

## ✅ Ön Gereksinimler Kontrolü

Aşağıdaki yazılımların kurulu olduğundan emin olun:

### 1. Node.js Kontrolü
```bash
node --version
# v18.0.0 veya üzeri olmalı
```

Kurulu değilse: https://nodejs.org/ adresinden indirin.

### 2. PostgreSQL Kontrolü
```bash
psql --version
# PostgreSQL 12 veya üzeri olmalı
```

Kurulu değilse: https://www.postgresql.org/download/ adresinden indirin.

## 📦 Kurulum Adımları

### Adım 1: Bağımlılıkları Yükleyin

Terminal'de proje klasörüne gidin ve çalıştırın:

```bash
# Backend bağımlılıkları
npm install

# Frontend bağımlılıkları
cd client
npm install
cd ..
```

### Adım 2: PostgreSQL Veritabanı Kurulumu

#### Windows için:

1. PostgreSQL'i başlatın (genellikle otomatik başlar)
2. Komut satırını açın ve şunu çalıştırın:

```bash
# PostgreSQL'e bağlanın (şifreniz istenecek)
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE coach_platform;

# Çıkış yapın
\q
```

3. Şemayı oluşturun:

```bash
psql -U postgres -d coach_platform -f server/database/schema.sql
```

#### Mac/Linux için:

```bash
# PostgreSQL başlatın
sudo service postgresql start  # veya: brew services start postgresql

# Veritabanı oluşturun
createdb coach_platform

# Şemayı yükleyin
psql -d coach_platform -f server/database/schema.sql
```

### Adım 3: Ortam Değişkenlerini Ayarlayın

`.env` dosyası zaten oluşturulmuş. Sadece PostgreSQL şifrenizi güncelleyin:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coach_platform
DB_USER=postgres
DB_PASSWORD=BURAYA_SIZIN_POSTGRESQL_SIFRENIZI_YAZIN
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3001
```

## ▶️ Uygulamayı Çalıştırma

### Seçenek 1: Her İkisini Birden (Önerilen)

```bash
npm run dev
```

Bu komut hem backend hem frontend'i başlatır:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

Tarayıcınızda http://localhost:3000 adresine gidin!

### Seçenek 2: Ayrı Ayrı Çalıştırma

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## 🎯 İlk Kullanım

### Test Kullanıcıları

Örnek koçlar otomatik olarak oluşturulmuştur. Giriş yapmak için:

**Email:** ahmet.yilmaz@example.com  
**Şifre:** test123

**Email:** zeynep.kaya@example.com  
**Şifre:** test123

**Email:** mehmet.demir@example.com  
**Şifre:** test123

### Yeni Koç Kaydı

1. Ana sayfada "Koç Olarak Kayıt Ol" butonuna tıklayın
2. Formu doldurun
3. Kayıt olduktan sonra otomatik olarak Dashboard'a yönlendirileceksiniz

## 🔧 Sorun Giderme

### "Cannot connect to database" Hatası

**Sebep:** PostgreSQL çalışmıyor veya şifre yanlış.

**Çözüm:**
1. PostgreSQL'in çalıştığından emin olun:
   ```bash
   # Windows (Services'da kontrol edin)
   # Mac/Linux:
   sudo service postgresql status
   ```

2. `.env` dosyasındaki şifrenin doğru olduğunu kontrol edin

### "Port 3000 is already in use" Hatası

**Sebep:** 3000 portu başka bir uygulama tarafından kullanılıyor.

**Çözüm:**
1. Diğer uygulamayı kapatın
2. Veya `client/vite.config.js` dosyasında port'u değiştirin:
   ```js
   server: {
     port: 3002, // Farklı bir port
   }
   ```

### "Module not found" Hatası

**Sebep:** Bağımlılıklar yüklenmemiş.

**Çözüm:**
```bash
# Root dizinde
npm install

# Client dizinde
cd client
npm install
```

### Veritabanı Şeması Hataları

**Çözüm:** Veritabanını sıfırlayın ve yeniden oluşturun:

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Mevcut veritabanını silin
DROP DATABASE coach_platform;

# Yeni veritabanı oluşturun
CREATE DATABASE coach_platform;

# Çıkış yapın
\q

# Şemayı yeniden yükleyin
psql -U postgres -d coach_platform -f server/database/schema.sql
```

## 📊 Veritabanı Yönetimi

### Tüm Koçları Görüntüleme

```bash
psql -U postgres -d coach_platform

SELECT full_name, email, hourly_rate FROM coaches;
```

### Tüm Mesajları Görüntüleme

```sql
SELECT m.*, c.full_name as coach_name 
FROM messages m 
JOIN coaches c ON m.coach_id = c.id;
```

### Veritabanını Temizleme

```sql
-- Tüm mesajları sil
DELETE FROM messages;

-- Tüm koçları sil (örnek koçlar hariç)
DELETE FROM coaches WHERE id > 3;
```

## 🎨 Özelleştirme

### Renkleri Değiştirme

`client/tailwind.config.js` dosyasını düzenleyin:

```js
colors: {
  primary: {
    500: '#0f62fe', // Ana mavi renk
  }
}
```

### Logo Değiştirme

`client/src/components/Header.jsx` dosyasındaki SVG'yi değiştirin.

## 📱 Production Build

Frontend'i production için build edin:

```bash
cd client
npm run build
```

Build dosyaları `client/dist` klasöründe oluşacak.

## 🔐 Güvenlik Notları

⚠️ **Production'a almadan önce:**

1. `.env` dosyasındaki `JWT_SECRET`'ı değiştirin
2. PostgreSQL şifresini güçlü yapın
3. CORS ayarlarını production domain'ine göre ayarlayın
4. HTTPS kullanın
5. `.env` dosyasını asla GitHub'a commit etmeyin

## 📞 Yardım

Sorun yaşıyorsanız:

1. `README.md` dosyasını okuyun
2. Terminal'deki hata mesajlarını kontrol edin
3. PostgreSQL ve Node.js'in doğru versiyonlarda olduğundan emin olun

## ✅ Kurulum Başarılı mı?

Eğer:
- ✅ http://localhost:3000 açılıyorsa
- ✅ Ana sayfada koçları görüyorsanız
- ✅ Kayıt/Giriş yapabiliyorsanız
- ✅ Mesaj gönderebiliyorsanız
- ✅ **Ayarlar'dan dark mode çalışıyorsa**
- ✅ **Font size ayarları değişiyorsa**

**Tebrikler! Kurulum başarılı! 🎉**

---

## 🎯 Sonraki Adımlar

1. **Ayarlar'ı test edin** (giriş yapmadan):
   - 🌙 Dark mode'a geçin
   - 📏 Font size'ı "Çok Büyük" yapın
   - Sayfa yenileyin → Ayarlar kalıcı olmalı

2. **Kendi koç hesabınızı oluşturun:**
   - Kayıt formunu doldurun
   - Şifre tekrarı ile hata önleme test edin

3. **Profil özelliklerini test edin:**
   - 📸 Profil fotoğrafı yükleyin (maks 2MB)
   - 🔒 Şifre değiştirin
   - 📝 Profil bilgilerini güncelleyin

4. **Mesajlaşma sistemini test edin:**
   - Farklı koçlara mesaj gönderin
   - Mesajları okuyun ve silin
   - Onay dialogunu test edin

5. **HCI özelliklerini test edin:**
   - ⌨️ Sadece klavye ile kullanmayı deneyin (Tab, Enter, Escape)
   - 🎨 Dark mode'da tüm sayfaları gezin (yazılar net beyaz olmalı)
   - 📏 Font size'ı değiştirip tüm sayfaları kontrol edin

**İyi Kullanımlar!** 🚀

