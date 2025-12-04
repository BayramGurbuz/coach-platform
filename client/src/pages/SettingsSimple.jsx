import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

function SettingsSimple() {
  const { language, setLanguage, t } = useLanguage();
  
  // Appearance settings
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, []);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const applyFontSize = (size) => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'xlarge':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    showSuccess(t('settings.theme') + ' ' + t('common.success').toLowerCase());
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    applyFontSize(newSize);
    showSuccess(t('settings.fontSize') + ' ' + t('common.success').toLowerCase());
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    showSuccess(t('settings.language') + ' ' + t('common.success').toLowerCase());
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('settings.title'), href: null },
          ]}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-200">
            {t('settings.subtitle')}
          </p>
        </div>

        {successMessage && (
          <div 
            className="bg-success-100 border-2 border-success-500 text-success-800 px-6 py-4 rounded-lg mb-6"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <div className="card space-y-8">
          {/* Language Selection */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              🌍 {t('settings.language')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-200 mb-4">
              Site dilini seçin / Choose site language
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleLanguageChange('tr')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  language === 'tr'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                }`}
                aria-pressed={language === 'tr'}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">🇹🇷 Türkçe</span>
                  {language === 'tr' && (
                    <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-200">Türkçe arayüz</p>
              </button>

              <button
                onClick={() => handleLanguageChange('en')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  language === 'en'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                }`}
                aria-pressed={language === 'en'}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">🇬🇧 English</span>
                  {language === 'en' && (
                    <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-200">English interface</p>
              </button>
            </div>
          </section>

          {/* Theme Selection */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              🎨 {t('settings.theme')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-200 mb-4">
              Sitenin görünümünü seçin (Erişilebilirlik özelliği - Göz yorgunluğunu azaltır)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                }`}
                aria-pressed={theme === 'light'}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">☀️ {t('settings.lightMode')}</span>
                  {theme === 'light' && (
                    <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-200">Standart beyaz arka plan</p>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                }`}
                aria-pressed={theme === 'dark'}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">🌙 {t('settings.darkMode')}</span>
                  {theme === 'dark' && (
                    <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-200">Koyu arka plan - Göz yorgunluğunu azaltır</p>
              </button>
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              📝 {t('settings.fontSize')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-200 mb-4">
              Sitenin yazı boyutunu ayarlayın (Erişilebilirlik özelliği - Görme zorluğu olanlar için)
            </p>
            <div className="space-y-3">
              {[
                { value: 'small', label: t('settings.small'), size: '14px', icon: '🔍' },
                { value: 'medium', label: t('settings.medium'), size: '16px', icon: '📄' },
                { value: 'large', label: t('settings.large'), size: '18px', icon: '📃' },
                { value: 'xlarge', label: t('settings.extraLarge'), size: '20px', icon: '📰' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    fontSize === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-300'
                  }`}
                  aria-pressed={fontSize === option.value}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white">{option.label}</span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-200 ml-2">({option.size})</span>
                      </div>
                    </div>
                    {fontSize === option.value && (
                      <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border-2 border-primary-200 dark:border-primary-700">
              <p className="text-sm text-neutral-700 dark:text-white">
                ♿ <strong>Erişilebilirlik:</strong> Bu özellik özellikle görme zorluğu olan kullanıcılar için tasarlanmıştır. 
                Yazı boyutunu ihtiyacınıza göre ayarlayarak siteyi daha rahat kullanabilirsiniz.
              </p>
            </div>
          </section>

          {/* Keyboard Shortcuts Info */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              ⌨️ Klavye Kısayolları
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'H', desc: 'Ana Sayfa' },
                { key: 'C', desc: 'Koç Bul' },
                { key: 'S', desc: 'Ayarlar' },
                { key: 'D', desc: 'Tema Değiştir' },
                { key: 'M', desc: 'Mesajlar' },
                { key: 'P', desc: 'Profil' },
                { key: '?', desc: 'Yardım' },
              ].map((shortcut) => (
                <div key={shortcut.key} className="flex items-center gap-2 p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <kbd className="px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">{shortcut.desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsSimple;
