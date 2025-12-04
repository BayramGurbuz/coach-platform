import { createContext, useContext, useState, useEffect } from 'react';

// Çeviriler
const translations = {
  tr: {
    // Navigation
    nav: {
      home: 'Ana Sayfa',
      findCoach: 'Koç Bul',
      messages: 'Mesajlar',
      profile: 'Profilim',
      settings: 'Ayarlar',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
    },
    // Landing Page
    landing: {
      heroTitle: 'Hayallerinize Ulaşın',
      heroSubtitle: 'Profesyonel koçlarla tanışın ve potansiyelinizi keşfedin',
      findCoachBtn: 'Koç Bul',
      becomeCoachBtn: 'Koç Ol',
      featuresTitle: 'Neden Bizi Tercih Etmelisiniz?',
      feature1Title: 'Uzman Koçlar',
      feature1Desc: 'Alanında uzman, sertifikalı koçlarla çalışın',
      feature2Title: 'Esnek Zamanlama',
      feature2Desc: 'Size uygun zamanlarda randevu alın',
      feature3Title: 'Güvenli İletişim',
      feature3Desc: 'Koçunuzla güvenli bir şekilde iletişim kurun',
      statsCoaches: 'Aktif Koç',
      statsMessages: 'Mesaj Gönderildi',
      statsUsers: 'Mutlu Kullanıcı',
      topCoachesTitle: 'En Çok İletişime Geçilen Koçlar',
      viewAll: 'Tümünü Gör',
    },
    // Coaches Page
    coaches: {
      title: 'Koç Bul',
      subtitle: 'Size en uygun koçu bulun',
      searchPlaceholder: 'İsim veya uzmanlık alanı ara...',
      filterSpecialty: 'Uzmanlık Alanı',
      filterAllSpecialties: 'Tüm Alanlar',
      filterMinPrice: 'Min Fiyat',
      filterMaxPrice: 'Max Fiyat',
      filterMinExp: 'Min Deneyim (Yıl)',
      filterMaxExp: 'Max Deneyim (Yıl)',
      sortBy: 'Sırala',
      sortDefault: 'Varsayılan',
      sortPriceAsc: 'Fiyat (Düşük → Yüksek)',
      sortPriceDesc: 'Fiyat (Yüksek → Düşük)',
      sortNameAsc: 'İsim (A → Z)',
      sortNameDesc: 'İsim (Z → A)',
      sortMsgDesc: 'En Çok Mesaj',
      sortMsgAsc: 'En Az Mesaj',
      sortExpDesc: 'En Deneyimli',
      sortExpAsc: 'En Az Deneyimli',
      clearFilters: 'Filtreleri Temizle',
      noResults: 'Aramanıza uygun koç bulunamadı',
      hourlyRate: '/saat',
      yearsExp: 'yıl deneyim',
      messages: 'mesaj',
      viewProfile: 'Profili Gör',
      contact: 'İletişime Geç',
      loading: 'Koçlar yükleniyor...',
    },
    // Coach Profile
    coachProfile: {
      breadcrumb: 'Koç Profili',
      about: 'Hakkında',
      specialties: 'Uzmanlık Alanları',
      experience: 'Deneyim',
      hourlyRate: 'Saatlik Ücret',
      totalMessages: 'Toplam Mesaj',
      contactTitle: 'İletişime Geç',
      yourName: 'Adınız Soyadınız',
      yourEmail: 'E-posta Adresiniz',
      yourMessage: 'Mesajınız',
      sendMessage: 'Mesaj Gönder',
      sending: 'Gönderiliyor...',
      messageSent: 'Mesajınız gönderildi!',
      undoMessage: 'saniye içinde geri alabilirsiniz',
      undo: 'Geri Al',
    },
    // Messages
    messages: {
      title: 'Mesajlarım',
      subtitle: 'Size gönderilen mesajları görüntüleyin ve yönetin',
      noMessages: 'Henüz mesajınız yok',
      unread: 'Okunmamış',
      read: 'Okunmuş',
      markAsRead: 'Okundu İşaretle',
      delete: 'Sil',
      deleteAll: 'Tümünü Sil',
      deleteAllConfirm: 'Tüm mesajları silmek istediğinizden emin misiniz?',
      filterAll: 'Tümü',
      filterUnread: 'Okunmamış',
      filterRead: 'Okunmuş',
      filterByDate: 'Tarihe Göre',
      dateNewest: 'En Yeni',
      dateOldest: 'En Eski',
      dateToday: 'Bugün',
      dateThisWeek: 'Bu Hafta',
      dateThisMonth: 'Bu Ay',
      messageDeleted: 'Mesaj silindi',
      allDeleted: 'Tüm mesajlar silindi',
      from: 'Kimden',
      date: 'Tarih',
      loading: 'Mesajlar yükleniyor...',
    },
    // Login
    login: {
      title: 'Giriş Yap',
      subtitle: 'Koç hesabınıza giriş yapın',
      email: 'E-posta',
      password: 'Şifre',
      rememberMe: 'Beni Hatırla',
      forgotPassword: 'Şifremi Unuttum',
      loginBtn: 'Giriş Yap',
      loggingIn: 'Giriş yapılıyor...',
      noAccount: 'Hesabınız yok mu?',
      registerLink: 'Kayıt Ol',
    },
    // Register
    register: {
      title: 'Koç Olarak Kayıt Ol',
      subtitle: 'Uzmanlığınızı paylaşın ve insanlara yardımcı olun',
      fullName: 'Ad Soyad',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifre Tekrar',
      bio: 'Hakkınızda',
      hourlyRate: 'Saatlik Ücret (₺)',
      experience: 'Deneyim (Yıl)',
      specialties: 'Uzmanlık Alanları',
      addSpecialty: 'Alan Ekle',
      registerBtn: 'Kayıt Ol',
      registering: 'Kayıt yapılıyor...',
      hasAccount: 'Zaten hesabınız var mı?',
      loginLink: 'Giriş Yap',
    },
    // Dashboard
    dashboard: {
      title: 'Profilim',
      subtitle: 'Koç profilinizi görüntüleyin ve düzenleyin',
      tabProfile: 'Profil Bilgileri',
      tabPhoto: 'Profil Resmi',
      tabSecurity: 'Şifre Değiştir',
      saveChanges: 'Değişiklikleri Kaydet',
      saving: 'Kaydediliyor...',
      uploadPhoto: 'Fotoğraf Yükle',
      currentPassword: 'Mevcut Şifre',
      newPassword: 'Yeni Şifre',
      confirmNewPassword: 'Yeni Şifre Tekrar',
      changePassword: 'Şifreyi Değiştir',
    },
    // Settings
    settings: {
      title: 'Ayarlar',
      subtitle: 'Görünüm tercihlerinizi yönetin',
      appearance: 'Görünüm',
      theme: 'Tema',
      lightMode: 'Açık Mod',
      darkMode: 'Koyu Mod',
      fontSize: 'Yazı Boyutu',
      small: 'Küçük',
      medium: 'Orta',
      large: 'Büyük',
      extraLarge: 'Çok Büyük',
      language: 'Dil',
    },
    // Common
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu',
      success: 'Başarılı',
      cancel: 'İptal',
      confirm: 'Onayla',
      save: 'Kaydet',
      edit: 'Düzenle',
      delete: 'Sil',
      back: 'Geri',
      next: 'İleri',
      search: 'Ara',
      clear: 'Temizle',
      yes: 'Evet',
      no: 'Hayır',
    },
    // Footer
    footer: {
      description: 'Profesyonel koçluk hizmetleri platformu',
      rights: 'Tüm hakları saklıdır.',
      links: 'Hızlı Linkler',
      contact: 'İletişim',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      findCoach: 'Find Coach',
      messages: 'Messages',
      profile: 'My Profile',
      settings: 'Settings',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    // Landing Page
    landing: {
      heroTitle: 'Reach Your Dreams',
      heroSubtitle: 'Meet professional coaches and discover your potential',
      findCoachBtn: 'Find Coach',
      becomeCoachBtn: 'Become a Coach',
      featuresTitle: 'Why Choose Us?',
      feature1Title: 'Expert Coaches',
      feature1Desc: 'Work with certified experts in their field',
      feature2Title: 'Flexible Scheduling',
      feature2Desc: 'Book appointments at times that suit you',
      feature3Title: 'Secure Communication',
      feature3Desc: 'Communicate securely with your coach',
      statsCoaches: 'Active Coaches',
      statsMessages: 'Messages Sent',
      statsUsers: 'Happy Users',
      topCoachesTitle: 'Most Contacted Coaches',
      viewAll: 'View All',
    },
    // Coaches Page
    coaches: {
      title: 'Find a Coach',
      subtitle: 'Find the coach that suits you best',
      searchPlaceholder: 'Search by name or specialty...',
      filterSpecialty: 'Specialty',
      filterAllSpecialties: 'All Specialties',
      filterMinPrice: 'Min Price',
      filterMaxPrice: 'Max Price',
      filterMinExp: 'Min Experience (Years)',
      filterMaxExp: 'Max Experience (Years)',
      sortBy: 'Sort By',
      sortDefault: 'Default',
      sortPriceAsc: 'Price (Low → High)',
      sortPriceDesc: 'Price (High → Low)',
      sortNameAsc: 'Name (A → Z)',
      sortNameDesc: 'Name (Z → A)',
      sortMsgDesc: 'Most Messages',
      sortMsgAsc: 'Least Messages',
      sortExpDesc: 'Most Experienced',
      sortExpAsc: 'Least Experienced',
      clearFilters: 'Clear Filters',
      noResults: 'No coaches found matching your search',
      hourlyRate: '/hour',
      yearsExp: 'years experience',
      messages: 'messages',
      viewProfile: 'View Profile',
      contact: 'Contact',
      loading: 'Loading coaches...',
    },
    // Coach Profile
    coachProfile: {
      breadcrumb: 'Coach Profile',
      about: 'About',
      specialties: 'Specialties',
      experience: 'Experience',
      hourlyRate: 'Hourly Rate',
      totalMessages: 'Total Messages',
      contactTitle: 'Get in Touch',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      yourMessage: 'Your Message',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Your message has been sent!',
      undoMessage: 'seconds to undo',
      undo: 'Undo',
    },
    // Messages
    messages: {
      title: 'My Messages',
      subtitle: 'View and manage messages sent to you',
      noMessages: 'No messages yet',
      unread: 'Unread',
      read: 'Read',
      markAsRead: 'Mark as Read',
      delete: 'Delete',
      deleteAll: 'Delete All',
      deleteAllConfirm: 'Are you sure you want to delete all messages?',
      filterAll: 'All',
      filterUnread: 'Unread',
      filterRead: 'Read',
      filterByDate: 'Filter by Date',
      dateNewest: 'Newest',
      dateOldest: 'Oldest',
      dateToday: 'Today',
      dateThisWeek: 'This Week',
      dateThisMonth: 'This Month',
      messageDeleted: 'Message deleted',
      allDeleted: 'All messages deleted',
      from: 'From',
      date: 'Date',
      loading: 'Loading messages...',
    },
    // Login
    login: {
      title: 'Login',
      subtitle: 'Sign in to your coach account',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password',
      loginBtn: 'Login',
      loggingIn: 'Logging in...',
      noAccount: "Don't have an account?",
      registerLink: 'Register',
    },
    // Register
    register: {
      title: 'Register as a Coach',
      subtitle: 'Share your expertise and help others',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      bio: 'About You',
      hourlyRate: 'Hourly Rate (₺)',
      experience: 'Experience (Years)',
      specialties: 'Specialties',
      addSpecialty: 'Add Specialty',
      registerBtn: 'Register',
      registering: 'Registering...',
      hasAccount: 'Already have an account?',
      loginLink: 'Login',
    },
    // Dashboard
    dashboard: {
      title: 'My Profile',
      subtitle: 'View and edit your coach profile',
      tabProfile: 'Profile Info',
      tabPhoto: 'Profile Photo',
      tabSecurity: 'Change Password',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      uploadPhoto: 'Upload Photo',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      changePassword: 'Change Password',
    },
    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Manage your appearance preferences',
      appearance: 'Appearance',
      theme: 'Theme',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      fontSize: 'Font Size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large',
      language: 'Language',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      clear: 'Clear',
      yes: 'Yes',
      no: 'No',
    },
    // Footer
    footer: {
      description: 'Professional coaching services platform',
      rights: 'All rights reserved.',
      links: 'Quick Links',
      contact: 'Contact',
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

