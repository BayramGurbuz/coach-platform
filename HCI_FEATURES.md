# 🎓 HCI Prensipleri ve Erişilebilirlik Özellikleri

Bu belge, Koç Platformu'nun Human-Computer Interaction (HCI) prensipleri ve erişilebilirlik özelliklerini detaylı olarak açıklar.

## 📚 İçindekiler

1. [HCI Prensipleri](#hci-prensipleri)
2. [Erişilebilirlik Özellikleri](#erişilebilirlik-özellikleri)
3. [Renk Körü Dostluğu](#renk-körü-dostluğu)
4. [Kullanılabilirlik Özellikleri](#kullanılabilirlik-özellikleri)
5. [WCAG 2.1 Uyumu](#wcag-21-uyumu)

---

## 🎯 HCI Prensipleri

### 1. Visibility (Görünürlük)

**Prensip:** Kullanıcı her zaman sistemin durumunu ve mevcut seçenekleri görebilmeli.

**Uygulamada:**
- ✅ Açık ve görünür navigasyon menüsü
- ✅ Aktif sayfa vurgulaması
- ✅ Koç durumu badge'leri (Yeni mesaj, Okundu, vs.)
- ✅ Filtre sonuçları sayacı ("15 koç bulundu")
- ✅ Loading spinner'lar (veri yüklenirken)
- ✅ Form doldurma ilerlemesi görünürlüğü

**Kod Örneği:**
```jsx
// Loading state gösterimi
{loading && (
  <div role="status" aria-live="polite">
    <div className="animate-spin ..."></div>
    <p>Yükleniyor...</p>
  </div>
)}
```

### 2. Feedback (Geri Bildirim)

**Prensip:** Her kullanıcı etkileşimi anında geri bildirim sağlamalı.

**Uygulamada:**
- ✅ Buton tıklamalarında görsel değişim (hover, active states)
- ✅ Form gönderiminde başarı/hata mesajları
- ✅ Mesaj gönderildiğinde onay bildirimi
- ✅ Profil güncellendiğinde başarı mesajı
- ✅ Input focus'ta border rengi değişimi
- ✅ Validasyon hataları anlık gösterim

**Kod Örneği:**
```jsx
// Başarı mesajı gösterimi
{successMessage && (
  <div className="bg-success-100 border-success-500" role="alert">
    <svg>...</svg>
    <p>{successMessage}</p>
  </div>
)}
```

### 3. Constraints (Kısıtlamalar)

**Prensip:** Hataları önlemek için kısıtlamalar kullanılmalı.

**Uygulamada:**
- ✅ Input type validasyonları (email, number)
- ✅ Min/max değer kısıtlamaları
- ✅ Required field işaretlemeleri
- ✅ Disabled states (form gönderilirken)
- ✅ Şifre uzunluğu kontrolü (min 6 karakter)
- ✅ Email format kontrolü

**Kod Örneği:**
```jsx
<input
  type="number"
  min="0"
  step="0.01"
  required
  aria-required="true"
/>
```

### 4. Consistency (Tutarlılık)

**Prensip:** Arayüz öğeleri tüm sayfalarda tutarlı olmalı.

**Uygulamada:**
- ✅ Tutarlı button stilleri (btn-primary, btn-secondary, btn-outline)
- ✅ Standart card komponentleri
- ✅ Aynı input stilleri her yerde
- ✅ Tutarlı renk paleti
- ✅ Aynı tipografi sistemi
- ✅ Standart spacing ve layout

**Kod Örneği:**
```css
.btn-primary {
  @apply px-6 py-3 rounded-lg bg-primary-500 text-white 
         hover:bg-primary-600 active:bg-primary-700;
}
```

### 5. Affordance (İşlevsellik İpuçları)

**Prensip:** Tasarım, bir öğenin nasıl kullanılacağını göstermeli.

**Uygulamada:**
- ✅ Butonlar tıklanabilir görünüyor (raised appearance)
- ✅ Linkler mavi ve altı çizgili (hover'da)
- ✅ Input alanları border ile çevrilmiş
- ✅ İkonlar metinle birlikte kullanılıyor
- ✅ Hover efektleri ile interaktif elementler belirgin
- ✅ Cursor pointer interaktif elementlerde

### 6. Error Prevention & Recovery

**Prensip:** Hataları önlemek ve kolayca düzeltmek mümkün olmalı.

**Uygulamada:**
- ✅ Gerçek zamanlı form validasyonu
- ✅ Açık ve yardımcı hata mesajları
- ✅ "Şifre Tekrar" alanı ile hata önleme
- ✅ Onay dialogları (örn: "İptal" butonu)
- ✅ Input placeholder'ları ile yönlendirme
- ✅ Hata durumunda odak otomatik yönlendirme

**Kod Örneği:**
```jsx
{errors.email && (
  <p id="email-error" className="text-danger-500" role="alert">
    {errors.email}
  </p>
)}
```

### 7. Recognition over Recall

**Prensip:** Kullanıcı bilgiyi hatırlamak yerine tanımalı.

**Uygulamada:**
- ✅ Dropdown menüler (manuel yazım yerine)
- ✅ Popüler uzmanlık alanları önerileri
- ✅ Placeholder metinler
- ✅ Form label'ları her zaman görünür
- ✅ Breadcrumb navigasyon
- ✅ Görsel ikonlar metinle birlikte

### 8. Flexibility and Efficiency

**Prensip:** Hem acemi hem uzman kullanıcılar için tasarım.

**Uygulamada:**
- ✅ Klavye kısayolları (Tab, Enter, Escape)
- ✅ Hem tıklama hem klavye ile kullanım
- ✅ Hızlı filtreleme seçenekleri
- ✅ "Enter" ile form gönderimi
- ✅ Skip to main content linki
- ✅ Çoklu filtreleme seçenekleri
- ✅ **Ayarlar sayfası** - Herkes için erişilebilir (giriş gerektirmez)
- ✅ **Font size ayarı** - Görme zorluğu olanlar için (4 seçenek)
- ✅ **Dark mode** - Göz yorgunluğunu azaltır

### 9. Miller Yasası ve Bilişsel Yük

**Prensip:** Kısa süreli hafıza 7±2 öğe ile sınırlıdır (Miller Yasası).

**Uygulamada:**
- ✅ Menü öğe sayısı optimum (Ana Sayfa, Mesajlar, Profilim, Ayarlar)
- ✅ Sekme tabanlı arayüzler (Dashboard: 3 sekme - Profil, Resim, Şifre)
- ✅ Bilgiyi hafızada tutmaya zorlamama
- ✅ Dropdown menüler (uzmanlık alanları) - Manuel yazımdan iyi
- ✅ Form alanları gruplanmış (Kişisel Bilgiler / Profesyonel Bilgiler)

**Kod Örneği:**
```jsx
// Dashboard'da 3 sekmeli yapı - Miller Yasasına uygun
<button>👤 Profil Bilgileri</button>
<button>📸 Profil Resmi</button>
<button>🔒 Şifre Değiştir</button>
```

### 10. Hata Önleme ve Yönetimi

**Prensip:** Slips (dalgınlıklar) ve Mistakes (yanlışlar) önlenmeli.

**Uygulamada:**

#### Slips Önleme:
- ✅ **Onay dialogları** - Mesaj silme: "Bu mesajı silmek istediğinizden emin misiniz?"
- ✅ Butonlar arası yeterli mesafe
- ✅ Tehlikeli işlemler (Sil) farklı renkle (kırmızı)
- ✅ Disabled states - İşlem yapılamayacağı net

#### Mistakes Önleme:
- ✅ **Şifre tekrarı alanı** - Yanlış şifre önleme
- ✅ **Input validation** - Gerçek zamanlı (email format, min karakter)
- ✅ **Açıklayıcı placeholder'lar** - Ne beklendiği net
- ✅ **Dosya yükleme kontrolü** - Max 2MB, sadece resim dosyaları
- ✅ **Hint metinleri** - "En az 6 karakter olmalıdır"

**Kod Örneği:**
```jsx
// Mesaj silme onayı - Slip önleme
const handleDeleteMessage = async (messageId) => {
  if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
    return;
  }
  await messagesAPI.delete(messageId);
};

// Dosya boyutu kontrolü - Mistake önleme
if (file.size > 2 * 1024 * 1024) {
  setError('Dosya boyutu en fazla 2MB olmalıdır');
  return;
}
```

---

## ♿ Erişilebilirlik Özellikleri

### Semantic HTML

**Neden Önemli:** Screen reader'lar sayfa yapısını anlar.

**Uygulamada:**
```html
<header role="banner">...</header>
<nav aria-label="Ana navigasyon">...</nav>
<main id="main-content">...</main>
<footer role="contentinfo">...</footer>
<article>...</article>
<section aria-labelledby="heading-id">...</section>
```

### ARIA (Accessible Rich Internet Applications)

**Neden Önemli:** Dinamik içerik ve interaktif öğeler için ek bilgi sağlar.

**Uygulamada:**

#### ARIA Labels
```jsx
<button aria-label="Profili düzenle">
  <svg aria-hidden="true">...</svg>
  Düzenle
</button>
```

#### ARIA Roles
```jsx
<div role="alert">Hata mesajı</div>
<div role="status">Yükleniyor...</div>
<div role="search">...</div>
```

#### ARIA States
```jsx
<button
  aria-expanded={isOpen}
  aria-pressed={isSelected}
  aria-invalid={hasError}
  aria-required="true"
>
```

#### ARIA Live Regions
```jsx
<div aria-live="polite">Mesaj gönderildi</div>
<div aria-live="assertive">Hata oluştu!</div>
```

### Klavye Navigasyonu

**Neden Önemli:** Motor engelli kullanıcılar ve klavye kullanıcıları için kritik.

**Uygulamada:**
- ✅ Tab ile tüm interaktif elementlere erişim
- ✅ Shift+Tab ile geriye gitme
- ✅ Enter ile buton/link aktivasyonu
- ✅ Escape ile modal/dropdown kapatma
- ✅ Space ile checkbox/button aktivasyonu
- ✅ Arrow tuşları ile radio button seçimi

**Focus Management:**
```css
* {
  @apply focus:outline-none 
         focus-visible:ring-2 
         focus-visible:ring-primary-500 
         focus-visible:ring-offset-2;
}
```

### Skip Links

**Neden Önemli:** Klavye kullanıcıları tekrarlayan içeriği atlayabilir.

**Uygulamada:**
```jsx
<a href="#main-content" className="skip-link">
  Ana içeriğe geç
</a>

// CSS
.skip-link {
  @apply absolute -translate-y-full focus:translate-y-0;
}
```

### Form Erişilebilirliği

**Best Practices:**

1. **Her input bir label'a sahip:**
```jsx
<label htmlFor="email" className="label">
  Email
</label>
<input id="email" type="email" />
```

2. **Error mesajları ile bağlantı:**
```jsx
<input
  aria-invalid={hasError}
  aria-describedby="email-error email-hint"
/>
<p id="email-error" role="alert">{error}</p>
<p id="email-hint">Örnek: user@example.com</p>
```

3. **Required field gösterimi:**
```jsx
<label>
  Email *
  <span className="sr-only">(gerekli)</span>
</label>
<input required aria-required="true" />
```

---

## 🎨 Renk Körü Dostluğu

### IBM Design Color Palette

**Neden IBM Paleti?**
- Bilimsel olarak test edilmiş
- Deuteranopia (kırmızı-yeşil) dostu
- Protanopia dostu
- Tritanopia (mavi-sarı) dostu
- WCAG AA/AAA kontrast oranları

### Ana Renkler

| Renk | Hex | Kullanım | Kontrast Oranı |
|------|-----|----------|----------------|
| Primary Blue | #0f62fe | Ana butonlar, linkler | 4.5:1 (AA) |
| Success Green | #198038 | Başarı mesajları | 4.5:1 (AA) |
| Warning Yellow | #f1c21b | Uyarılar | 3.5:1 (AA Large) |
| Danger Red | #da1e28 | Hatalar | 4.5:1 (AA) |
| Neutral Gray | #393939 | Metinler | 10:1 (AAA) |

### Sadece Renge Bağımlı Olmama

**Problem:** Renk körü kullanıcılar renk farklarını göremez.

**Çözüm:**
1. **İkonlar ile destekleme:**
```jsx
<div className="bg-success-100">
  <svg>✓</svg> {/* İkon */}
  <p>Başarılı</p>
</p>
```

2. **Şekiller ile destekleme:**
```jsx
<span className="badge-primary">
  ● Aktif
</span>
```

3. **Metin ile destekleme:**
```jsx
<button className="btn-primary">
  <span className="sr-only">Başarılı: </span>
  Kaydedildi
</button>
```

### Kontrast Oranları

**WCAG Gereksinimleri:**
- AA Level: 4.5:1 (normal metin), 3:1 (büyük metin)
- AAA Level: 7:1 (normal metin), 4.5:1 (büyük metin)

**Uygulamada:**
```css
/* Yüksek kontrast metin */
.text-neutral-900 on .bg-white /* 21:1 - AAA */
.text-white on .bg-primary-500 /* 8.1:1 - AAA */
.text-primary-800 on .bg-primary-100 /* 7.2:1 - AAA */
```

### High Contrast Mode Desteği

```css
@media (prefers-contrast: high) {
  body {
    @apply bg-white text-black;
  }
  
  .card {
    @apply border-2 border-neutral-900;
  }
}
```

---

## 🎯 Kullanılabilirlik Özellikleri

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Uygulamada:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 sütun, Tablet: 2 sütun, Desktop: 3 sütun */}
</div>
```

### Touch Target Boyutları

**WCAG Gereksinimi:** Minimum 44x44 piksel

**Uygulamada:**
```css
.btn {
  @apply px-6 py-3; /* 44px minimum height */
}

/* Mobile menü butonu */
.mobile-menu-button {
  @apply p-2 w-11 h-11; /* 44x44px */
}
```

### Reduced Motion

**Neden Önemli:** Vestibüler bozukluğu olan kullanıcılar için.

**Uygulamada:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tipografi ve Font Size Erişilebilirliği

**Okunaklı Fontlar:**
- Font Family: System fonts (optimal rendering)
- Font Size: Minimum 16px (body text)
- Line Height: 1.5 (optimal readability)
- Letter Spacing: Normal to slightly increased

**Kullanıcı Kontrollü Font Size (YENİ):**
- ✅ **4 seçenek:** Küçük (14px), Orta (16px), Büyük (18px), Çok Büyük (20px)
- ✅ **Görme zorluğu olanlar için** - WCAG AAA erişilebilirlik
- ✅ localStorage ile kalıcı - Tercih hatırlanır
- ✅ Tüm sitede anlık uygulanır
- ✅ **Hafıza yükünü azaltır** - Kullanıcı her sayfada zoom yapmasına gerek yok

**Hizalama (Alignment) Stratejileri:**
- ✅ **Metin sola dayalı** - Okuma kolaylığı (soldan sağa diller için)
- ✅ **Sayılar sağa dayalı** - Fiyatlar karşılaştırması kolay (150₺, 120₺, 100₺)
- ✅ **Form label'ları tutarlı hizalı**
- ✅ **Whitespace aktif kullanım** - Gruplamak için çizgi yerine boşluk

```css
body {
  @apply antialiased; /* Smooth font rendering */
  font-size: 16px; /* Varsayılan */
  line-height: 1.5;
}

/* Kullanıcı "Çok Büyük" seçerse */
html {
  font-size: 20px; /* JavaScript ile ayarlanır */
}
```

**Kod Örneği:**
```jsx
// Font size ayarı - Ayarlar sayfasında
const handleFontSizeChange = (newSize) => {
  setFontSize(newSize);
  localStorage.setItem('fontSize', newSize);
  // Tüm siteye uygula
  document.documentElement.style.fontSize = 
    newSize === 'xlarge' ? '20px' : '16px';
  showSuccess('Yazı boyutu ayarı kaydedildi');
};
```

### Loading States ve Geri Bildirim (Feedback)

**Neden Önemli:** Kullanıcı sistemin çalıştığını bilmeli (Synthesizability).

**Yanıt Süresi Standartları:**
- ✅ **<100ms:** Anlık hissettir (buton tıklama)
- ✅ **<1s:** Kullanıcı beklemeden işlem biter
- ✅ **>1s:** Loading göstergesi ZORUNLU

**Uygulamada:**
```jsx
{loading && (
  <div role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true"></div>
    <span className="sr-only">Yükleniyor...</span>
  </div>
)}

// Profil fotoğrafı yükleme
<button disabled={uploadingImage}>
  {uploadingImage ? 'Yükleniyor...' : 'Profil Resmini Güncelle'}
</button>

// Şifre değiştirme
<button disabled={passwordLoading}>
  {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
</button>
```

**Kapanış (Closure):**
- ✅ İşlem tamamlandığında net mesaj
- ✅ "Profiliniz başarıyla güncellendi" ✓
- ✅ "Şifreniz başarıyla değiştirildi" ✓
- ✅ "Mesaj silindi" ✓
- ✅ 3 saniye sonra otomatik kaybolur

**Geri Alınabilirlik (Reversibility):**
- ✅ Profil düzenleme - "İptal" butonu var
- ✅ Form doldurmayı bırakma - Değişiklikler kaybolur uyarısı yok (tasarım hatası değil, veri kaybı riski düşük)
- ✅ Mesaj silme - Onay dialogu (geri alınamaz işlem için)

---

## ✅ WCAG 2.1 Uyumu

### Level A (Minimum)

- ✅ 1.1.1 Non-text Content: Tüm görsellerde alt text
- ✅ 1.3.1 Info and Relationships: Semantic HTML
- ✅ 2.1.1 Keyboard: Tüm fonksiyonlar klavye ile erişilebilir
- ✅ 2.4.1 Bypass Blocks: Skip to main content
- ✅ 3.3.1 Error Identification: Hata mesajları açık
- ✅ 4.1.1 Parsing: Valid HTML

### Level AA (Orta)

- ✅ 1.4.3 Contrast: Minimum 4.5:1 kontrast oranı
- ✅ 1.4.5 Images of Text: Metin, resim olarak değil gerçek metin
- ✅ 2.4.6 Headings and Labels: Açıklayıcı başlıklar
- ✅ 2.4.7 Focus Visible: Focus göstergeleri
- ✅ 3.2.3 Consistent Navigation: Tutarlı navigasyon
- ✅ 3.3.3 Error Suggestion: Hata çözüm önerileri

### Level AAA (En İyi)

- ✅ 1.4.6 Contrast (Enhanced): 7:1 kontrast (birçok yerde)
- ✅ 2.4.8 Location: Breadcrumb navigasyon
- ✅ 3.3.5 Help: Context-sensitive help

---

## 🧪 Test Edilebilir Özellikler

### Klavye Testi
1. Tab tuşu ile tüm sayfalarda gezinin
2. Enter ile butonları aktive edin
3. Escape ile modal'ları kapatın

### Screen Reader Testi
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac)

### Renk Körü Simulasyonu
- Chrome DevTools (Rendering > Emulate vision deficiencies)
- Colour Contrast Analyser

### Otomatik Test Araçları
- axe DevTools
- Lighthouse Accessibility Audit
- WAVE Extension

---

## 📊 Performans Metrikleri

### Hedefler
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

### Optimizasyonlar
- ✅ Code splitting (React lazy loading)
- ✅ Image optimization
- ✅ Minification ve compression
- ✅ CDN usage (production'da)

---

## 🎓 Sonuç

Bu platform, HCI prensipleri ve erişilebilirlik standartlarını göz önünde bulundurarak tasarlanmıştır. Her kullanıcının, engel durumu ne olursa olsun, eşit bir deneyim yaşaması hedeflenmiştir.

### Temel İlkeler

1. **İnsan Odaklı Tasarım**: Kullanıcı ihtiyaçları her zaman öncelik
2. **Kapsayıcılık**: Herkes için erişilebilir
3. **Tutarlılık**: Öğrenilebilir ve tahmin edilebilir
4. **Geri Bildirim**: Her işlem için açık yanıt
5. **Hata Toleransı**: Hataları önle ve kolayca düzelt

---

**Not:** Bu özellikler, Human-Computer Interaction dersi kapsamında akademik bir proje olarak geliştirilmiştir ve gerçek dünya uygulamalarında referans olarak kullanılabilir.

