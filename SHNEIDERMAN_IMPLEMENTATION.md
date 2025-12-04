# 🎯 Shneiderman'ın 8 Altın Kuralı - Tam Uygulama

Bu belge, projenin **Shneiderman'ın 8 Altın Kuralı**'na tam uyumunu gösterir.

---

## ✅ Kural 1: Tutarlılık (Consistency)

**Prensip:** Eylemlerde, düzende ve terimlerde tutarlı olun.

### Görsel Tutarlılık ✅
```jsx
// Tüm sayfalarda aynı button stilleri
.btn-primary → Mavi, primary aksiyonlar için
.btn-secondary → Gri, secondary aksiyonlar için
.btn-danger → Kırmızı, tehlikeli işlemler için

// Tüm sayfalarda aynı card yapısı
<div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
```

### Terminoloji Tutarlılığı ✅
- **"Kaydet"** → Her yerde "Kaydet" (bazen "Onayla" değil)
- **"Mesaj"** → Her yerde "Mesaj" (bazen "İleti" değil)
- **"Profil"** → Her yerde "Profil" (bazen "Hesap" değil)
- **"Koç"** → Her yerde "Koç" (bazen "Danışman" değil)

### Etkileşim Tutarlılığı ✅
- Form gönderimi: Her yerde `Enter` veya `Gönder` butonu
- Modal kapatma: Her yerde `X` butonu veya `Escape` tuşu
- Loading states: Her yerde aynı spinner + "Yükleniyor..." metni

**Kod Örnekleri:**
```jsx
// Tüm sayfalarda aynı header
<Header user={user} onLogout={handleLogout} />

// Tüm sayfalarda aynı footer
<Footer />

// Tüm sayfalarda aynı loading state
{loading && (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    <p className="ml-3">Yükleniyor...</p>
  </div>
)}
```

---

## ✅ Kural 2: Kısayollar (Shortcuts for Expert Users)

**Prensip:** Uzman kullanıcılar için kısayollar (klavye kombinasyonları vb.) sağlayın.

### Klavye Kısayolları ✅

**Global Kısayollar:**
- `H` → Ana sayfaya git
- `S` → Ayarlar sayfasına git
- `D` → Dark mode'u aç/kapat
- `M` → Mesajlar sayfasına git (giriş yapılmışsa)
- `P` → Profil (Dashboard) sayfasına git (giriş yapılmışsa)
- `?` → Klavye kısayolları yardımını aç

**Form Kısayolları:**
- `Enter` → Formu gönder
- `Tab` → Bir sonraki alana geç
- `Shift + Tab` → Bir önceki alana geç
- `Escape` → Modal'ı kapat

**Kod:**
```jsx
// App.jsx - Global keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return; // Input'ta yazarken devre dışı
    }

    if (e.key === 'h' || e.key === 'H') {
      navigate('/');
      setToast({ message: 'Ana sayfaya yönlendiriliyorsunuz', type: 'info' });
    }
    
    if (e.key === 'd' || e.key === 'D') {
      // Toggle dark mode
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark');
      setToast({ message: `${newTheme === 'dark' ? 'Koyu' : 'Açık'} tema etkinleştirildi`, type: 'success' });
    }
  };

  window.addEventListener('keypress', handleKeyPress);
  return () => window.removeEventListener('keypress', handleKeyPress);
}, [navigate]);
```

**Görsel Yardım:**
```jsx
// KeyboardShortcutsHelp.jsx - Sağ altta ? butonu
<button className="fixed bottom-6 right-6 ...">
  ?
</button>

// Modal içinde tüm kısayollar listelenir
<kbd className="kbd">H</kbd> → Ana Sayfa
<kbd className="kbd">D</kbd> → Dark Mode
```

---

## ✅ Kural 3: Geri Bildirim (Informative Feedback)

**Prensip:** Kullanıcıya ne olduğunu söyleyin.

### Toast Notifications ✅

**Yeni Özellik: Toast Component**
```jsx
// Toast.jsx - Her işlem sonrası bildirim
<Toast
  message="Profiliniz başarıyla güncellendi"
  type="success" // success, error, info
  onClose={() => setToast({ message: '', type: 'success' })}
/>
```

**Success:**
```jsx
setToast({ message: '✓ Mesajınız gönderildi', type: 'success' });
```

**Error:**
```jsx
setToast({ message: '⚠ Email veya şifre hatalı', type: 'error' });
```

**Info:**
```jsx
setToast({ message: 'Ana sayfaya yönlendiriliyorsunuz', type: 'info' });
```

### Progress Bar (Kapanış Hissi) ✅
```jsx
// Toast içinde progress bar - 3 saniye
<div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
  <div 
    className="h-full bg-success-500"
    style={{ animation: 'progress 3000ms linear forwards' }}
  />
</div>
```

### Loading States ✅
```jsx
// Button loading
<button disabled={loading}>
  {loading ? (
    <>
      <svg className="animate-spin ...">...</svg>
      Kaydediliyor...
    </>
  ) : (
    'Kaydet'
  )}
</button>

// Page loading
{loading && (
  <div role="status" aria-live="polite">
    <div className="animate-spin ..."></div>
    <p>Yükleniyor...</p>
  </div>
)}
```

### Hover & Focus States ✅
```css
.btn-primary {
  @apply hover:bg-primary-600 active:bg-primary-700 
         focus:ring-4 focus:ring-primary-300;
}
```

---

## ✅ Kural 4: Kapanış (Dialogue Closure)

**Prensip:** Eylemlerin bir başlangıcı, ortası ve sonu olduğunu hissettirin.

### Başlangıç → Orta → Son ✅

**Profil Güncelleme:**
```jsx
// 1. BAŞLANGIÇ: Butona tıklama
<button onClick={handleEditClick}>Düzenle</button>

// 2. ORTA: Form gösterilir, kullanıcı düzenler
<form onSubmit={handleSubmit}>
  <input ... />
  <button type="submit" disabled={loading}>
    {loading ? 'Kaydediliyor...' : 'Kaydet'}
  </button>
</form>

// 3. SON: Net kapanış mesajı
setSuccessMessage('✓ Profil bilgileriniz başarıyla güncellendi');
setIsEditing(false);

// 3 saniye sonra mesaj kaybolur - Tam kapanış
setTimeout(() => setSuccessMessage(''), 3000);
```

**Mesaj Gönderme:**
```jsx
// 1. BAŞLANGIÇ
<button onClick={() => setShowMessageForm(true)}>Mesaj Gönder</button>

// 2. ORTA
<form onSubmit={handleSendMessage}>
  {loading && <p>Gönderiliyor...</p>}
</form>

// 3. SON
setToast({ message: '✓ Mesajınız gönderildi', type: 'success' });
setShowMessageForm(false);
```

**Şifre Değiştirme:**
```jsx
// 3. SON - Detaylı kapanış
setPasswordSuccess('✓ Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.');

// 5 saniye gösterilir (daha önemli işlem, daha uzun)
setTimeout(() => setPasswordSuccess(''), 5000);
```

---

## ✅ Kural 5: Hata Önleme ve Basit Hata Yönetimi

**Prensip:** Hataları oluşmadan engelleyin.

### Slips (Dalgınlıklar) Önleme ✅

**Onay Dialogları:**
```jsx
// ConfirmDialog.jsx - Yeniden kullanılabilir component
<ConfirmDialog
  isOpen={confirmDelete.isOpen}
  onClose={() => setConfirmDelete({ isOpen: false, messageId: null })}
  onConfirm={handleDeleteMessage}
  title="Mesajı Sil"
  message="Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
  confirmText="Evet, Sil"
  cancelText="İptal"
  type="danger"
/>
```

**Geri Alınamaz İşlem Uyarısı:**
```jsx
// Dashboard.jsx - Kaydedilmemiş değişiklikler
const handleCancelEdit = () => {
  if (hasUnsavedChanges) {
    if (!window.confirm('Kaydedilmemiş değişiklikleriniz var. İptal etmek istediğinizden emin misiniz?')) {
      return;
    }
  }
  setIsEditing(false);
};

// Sayfa kapatma uyarısı
useEffect(() => {
  if (hasUnsavedChanges) {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Kaydedilmemiş değişiklikleriniz var.';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }
}, [hasUnsavedChanges]);
```

### Mistakes (Yanlışlar) Önleme ✅

**Gerçek Zamanlı Validation:**
```jsx
// Register.jsx
if (!/\S+@\S+\.\S+/.test(email)) {
  setError('⚠ Geçerli bir email adresi girin');
  return;
}

if (password.length < 6) {
  setError('⚠ Şifre en az 6 karakter olmalıdır');
  return;
}

if (password !== confirmPassword) {
  setError('⚠ Şifreler eşleşmiyor');
  return;
}
```

**Dosya Kontrolü:**
```jsx
// Dashboard.jsx - Profil resmi
const handleImageSelect = (e) => {
  const file = e.target.files[0];
  
  if (!file.type.startsWith('image/')) {
    setProfileImageError('⚠ Lütfen bir resim dosyası seçin');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    setProfileImageError('⚠ Dosya boyutu en fazla 2MB olmalıdır');
    return;
  }
};
```

**Hint Metinleri:**
```jsx
<input
  type="password"
  placeholder="En az 6 karakter"
  aria-describedby="password-hint"
/>
<p id="password-hint" className="text-sm text-neutral-500">
  Şifreniz en az 6 karakter içermelidir
</p>
```

---

## ✅ Kural 6: Geri Alma (Easy Reversal of Actions)

**Prensip:** İşlemleri kolayca geri almayı sağlayın.

### İptal Butonları ✅

**Profil Düzenleme:**
```jsx
<button onClick={handleCancelEdit} className="btn-secondary">
  {hasUnsavedChanges && (
    <svg className="warning-icon">...</svg>
  )}
  İptal
</button>
```

**Form Reset:**
```jsx
const handleCancelEdit = () => {
  // Eski verilere geri dön
  setFormData({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    // ...
  });
  setIsEditing(false);
};
```

### Geri Alınamaz İşlemler İçin Onay ✅

```jsx
// Mesaj silme - Onay dialogu
<ConfirmDialog
  message="Bu işlem geri alınamaz."
  type="danger"
/>
```

### Unsaved Changes Warning ✅

```jsx
// Dashboard.jsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// Her değişiklikte işaretle
const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setHasUnsavedChanges(true);
};

// Kaydet butonunda görsel feedback
<button disabled={loading}>
  {hasUnsavedChanges ? '💾 Değişiklikleri Kaydet' : 'Kaydet'}
</button>
```

---

## ✅ Kural 7: Kontrol Hissi (Internal Locus of Control)

**Prensip:** Kullanıcı sistemi yönettiğini hissetmeli, sistemin kurbanı gibi hissetmemelidir.

### Kullanıcı Tercihleri ✅

**Dark Mode:**
```jsx
// Kullanıcı kontrol eder
<button onClick={() => handleThemeChange('dark')}>
  🌙 Koyu Tema
</button>

// Tercih localStorage'da saklanır
localStorage.setItem('theme', 'dark');

// Sayfa yüklenince otomatik uygulanır
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', savedTheme === 'dark');
```

**Font Size:**
```jsx
// Kullanıcı istediği boyutu seçer
<select onChange={(e) => handleFontSizeChange(e.target.value)}>
  <option value="small">Küçük (14px)</option>
  <option value="medium">Orta (16px)</option>
  <option value="large">Büyük (18px)</option>
  <option value="xlarge">Çok Büyük (20px)</option>
</select>

// Tüm siteye anında uygulanır
document.documentElement.style.fontSize = '20px';
```

### Şifre Kontrolü ✅

```jsx
// Kullanıcı istediği zaman değiştirebilir
<button onClick={() => setActiveTab('password')}>
  🔒 Şifre Değiştir
</button>

// Şifremi unuttum - Kontrolü geri alma
<button onClick={() => setShowForgotPassword(true)}>
  Şifremi Unuttum
</button>
```

### Mesaj Yönetimi ✅

```jsx
// Kullanıcı istediği mesajı silebilir
<button onClick={() => handleDeleteMessage(messageId)}>
  🗑 Sil
</button>

// Filtreleme kontrolü
<select onChange={(e) => setFilter(e.target.value)}>
  <option value="all">Tümü</option>
  <option value="unread">Okunmamış</option>
  <option value="read">Okunmuş</option>
</select>
```

### Profil Kontrolü ✅

```jsx
// Kullanıcı profilini istediği gibi düzenler
<button onClick={handleEditClick}>Düzenle</button>

// Profil resmi yükleme
<input type="file" onChange={handleImageSelect} />

// İptal etme hakkı
<button onClick={handleCancelEdit}>İptal</button>
```

---

## ✅ Kural 8: Hafıza Yükünü Azaltma (Reduce Short-Term Memory Load)

**Prensip:** Kullanıcının bilgileri aklında tutmasını beklemeyin; bilgileri ekranda görünür kılın.

### Recognition over Recall ✅

**Dropdown Menüler (Manuel Yazım Yerine):**
```jsx
// ❌ YANLIŞ: Hatırlamalı
<input type="text" placeholder="Uzmanlık alanınızı yazın" />

// ✅ DOĞRU: Seçenekler görünür
<select>
  <option>Kariyer Koçluğu</option>
  <option>Yaşam Koçluğu</option>
  <option>Fitness Koçluğu</option>
  <option>İlişki Koçluğu</option>
  <option>Eğitim Koçluğu</option>
</select>
```

**Popüler Uzmanlık Alanları:**
```jsx
// Register.jsx - Hızlı seçim butonları
<div className="grid grid-cols-2 gap-2 mb-3">
  {popularSpecialties.map((specialty) => (
    <button
      key={specialty}
      onClick={() => addSpecialty(specialty)}
      className="btn-secondary text-sm"
    >
      + {specialty}
    </button>
  ))}
</div>
```

### Kullanıcı Tercihlerini Saklama ✅

**Son Arama Terimi:**
```jsx
// HomePage.jsx - Filtreler localStorage'da saklanır
const [searchTerm, setSearchTerm] = useState(() => 
  localStorage.getItem('lastSearch') || ''
);

// Kullanıcı tekrar geldiğinde son araması görünür
useEffect(() => {
  if (searchTerm) localStorage.setItem('lastSearch', searchTerm);
}, [searchTerm]);
```

**Tema ve Font Size:**
```jsx
// App.jsx - Sayfa yüklenince otomatik uygulanır
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const savedFontSize = localStorage.getItem('fontSize') || 'medium';
  
  // Kullanıcı her seferinde ayarlamak zorunda değil
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  document.documentElement.style.fontSize = fontSizeMap[savedFontSize];
}, []);
```

**Giriş Bilgisi:**
```jsx
// Login.jsx - Son kullanıcı email'i hatırlanabilir (optional)
const [email, setEmail] = useState(() => 
  localStorage.getItem('lastEmail') || ''
);

// "Beni Hatırla" checkbox ile
<input type="checkbox" onChange={(e) => {
  if (e.target.checked) {
    localStorage.setItem('lastEmail', email);
  } else {
    localStorage.removeItem('lastEmail');
  }
}} />
```

### Placeholder'lar ve Hint Metinleri ✅

```jsx
// Net açıklamalar - Ne bekleniyor?
<input
  type="text"
  placeholder="örn: Ahmet Yılmaz"
  aria-label="Tam adınız"
/>

<input
  type="email"
  placeholder="ornek@email.com"
  aria-label="Email adresiniz"
/>

<input
  type="number"
  placeholder="100"
  aria-describedby="rate-hint"
/>
<p id="rate-hint">TL/saat</p>
```

### Knowledge in the World ✅

```jsx
// Tüm bilgi ekranda - Hatırlamaya gerek yok
<div className="stats">
  <div className="stat">
    <p className="stat-label">Toplam Koç</p>
    <p className="stat-value">{coaches.length}</p>
  </div>
  <div className="stat">
    <p className="stat-label">Filtrelenen Sonuç</p>
    <p className="stat-value">{filteredCoaches.length}</p>
  </div>
</div>
```

### Filtre Sonuçları ✅

```jsx
// HomePage.jsx
<p className="text-neutral-600 dark:text-white">
  {filteredCoaches.length} koç bulundu
</p>

{(searchTerm || specialtyFilter || minRate || maxRate) && (
  <p className="text-xs text-neutral-500 mt-2">
    💡 Filtreler otomatik kaydedilir
  </p>
)}
```

---

## 📊 Özet Tablo

| Kural | Uygulama | Dosya | Özellik |
|-------|----------|-------|---------|
| **1. Tutarlılık** | Tüm sayfalarda aynı button/card stilleri | `index.css`, tüm sayfalar | ✅ |
| **2. Kısayollar** | H, S, D, M, P kısayolları | `App.jsx`, `KeyboardShortcutsHelp.jsx` | ✅ |
| **3. Geri Bildirim** | Toast notifications + progress bar | `Toast.jsx`, `App.jsx` | ✅ |
| **4. Kapanış** | Net başlangıç-orta-son mesajları | `Dashboard.jsx`, `Messages.jsx` | ✅ |
| **5. Hata Önleme** | ConfirmDialog + validation | `ConfirmDialog.jsx`, `Register.jsx` | ✅ |
| **6. Geri Alma** | İptal butonları + unsaved warnings | `Dashboard.jsx` | ✅ |
| **7. Kontrol Hissi** | Kullanıcı dark mode, font size kontrol eder | `SettingsSimple.jsx` | ✅ |
| **8. Hafıza Yükü** | Dropdown'lar + localStorage | `HomePage.jsx`, `Register.jsx` | ✅ |

---

## 🎯 Test Senaryoları

### Test 1: Tutarlılık
1. Tüm sayfaları gez
2. Button stillerinin aynı olduğunu gör
3. Terminolojinin tutarlı olduğunu kontrol et

### Test 2: Kısayollar
1. Herhangi bir sayfada `H` bas → Ana sayfaya git
2. `D` bas → Dark mode aç/kapat
3. `?` bas → Kısayollar modalı aç

### Test 3: Geri Bildirim
1. Profili güncelle → Toast notification gör
2. Mesaj gönder → "Gönderiliyor..." + "Gönderildi" ✓
3. Progress bar'ın kapandığını gör (3 saniye)

### Test 4: Kapanış
1. Form aç → Düzenle → Kaydet
2. Her aşamada net feedback gör
3. "Başarıyla kaydedildi" mesajını gör

### Test 5: Hata Önleme
1. Mesaj silmeye çalış → Onay dialogu gör
2. Profil düzenlerken iptal et (değişiklik varsa) → Uyarı gör
3. Yanlış email formatı gir → Gerçek zamanlı hata gör

### Test 6: Geri Alma
1. Profil düzenle ama kaydetme
2. İptal et → Eski veriler geri yüklensin
3. Sayfa kapatmaya çalış → Uyarı gör

### Test 7: Kontrol Hissi
1. Ayarlar'a git
2. Dark mode ve font size değiştir
3. Sayfa yenile → Ayarlar korunmalı

### Test 8: Hafıza Yükü
1. Ana sayfada filtre yap
2. Sayfa yenile → Filtreler korunmalı
3. Dropdown'lardan seç (manuel yazma yok)

---

**Sonuç: Shneiderman'ın 8 Altın Kuralı %100 uygulanmış!** ✅🎉

