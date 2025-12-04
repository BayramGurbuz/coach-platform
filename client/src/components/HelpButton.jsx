import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const content = {
    tr: {
      title: 'Yardım & Bilgi',
      subtitle: 'Koç Platformu - Kullanım Kılavuzu',
      sections: [
        {
          title: '🎯 Site Hakkında',
          items: [
            'Bu platform, profesyonel koçlarla kullanıcıları buluşturur.',
            'Koçları inceleyebilir, filtreleyebilir ve iletişime geçebilirsiniz.',
            'Koç olarak kayıt olup kendi profilinizi oluşturabilirsiniz.',
          ],
        },
        {
          title: '🔍 Koç Bulma',
          items: [
            '"Koç Bul" sayfasından tüm koçları görüntüleyin.',
            'Uzmanlık alanı, fiyat ve deneyime göre filtreleyin.',
            'Mesaj sayısı veya fiyata göre sıralayın.',
            'Koç profiline tıklayarak detayları görün.',
          ],
        },
        {
          title: '📧 Mesajlaşma',
          items: [
            'Koç profilinden "Mesaj Gönder" ile iletişime geçin.',
            'Koçlar gelen mesajlarını "Mesajlarım" sayfasından görür.',
            'Mesajları okundu/okunmadı işaretleyebilirsiniz.',
            'Silinen mesajları 30 saniye içinde geri alabilirsiniz.',
          ],
        },
        {
          title: '⚙️ Ayarlar',
          items: [
            'Koyu/Açık tema seçebilirsiniz.',
            'Yazı boyutunu ihtiyacınıza göre ayarlayın.',
            'TR/EN dil desteği mevcuttur.',
          ],
        },
      ],
      shortcuts: [
        { key: 'H', desc: 'Ana Sayfa' },
        { key: 'C', desc: 'Koç Bul' },
        { key: 'S', desc: 'Ayarlar' },
        { key: 'D', desc: 'Tema Değiştir' },
        { key: 'M', desc: 'Mesajlar (giriş yapılmışsa)' },
        { key: 'P', desc: 'Profil (giriş yapılmışsa)' },
        { key: '?', desc: 'Bu yardım paneli' },
        { key: 'ESC', desc: 'Modalı kapat' },
      ],
      close: 'Kapat',
    },
    en: {
      title: 'Help & Info',
      subtitle: 'Coach Platform User Guide',
      sections: [
        {
          title: '🎯 About the Site',
          items: [
            'This platform connects users with professional coaches.',
            'You can browse, filter, and contact coaches.',
            'Register as a coach and create your profile.',
          ],
        },
        {
          title: '🔍 Finding a Coach',
          items: [
            'View all coaches from the "Find Coach" page.',
            'Filter by specialty, price, and experience.',
            'Sort by message count or price.',
            'Click on a coach profile for details.',
          ],
        },
        {
          title: '📧 Messaging',
          items: [
            'Contact coaches via "Send Message" on their profile.',
            'Coaches see messages in "My Messages" page.',
            'Mark messages as read/unread.',
            'Undo deleted messages within 30 seconds.',
          ],
        },
        {
          title: '⚙️ Settings',
          items: [
            'Choose Dark/Light theme.',
            'Adjust font size to your needs.',
            'TR/EN language support available.',
          ],
        },
      ],
      shortcuts: [
        { key: 'H', desc: 'Home' },
        { key: 'C', desc: 'Find Coach' },
        { key: 'S', desc: 'Settings' },
        { key: 'D', desc: 'Toggle Theme' },
        { key: 'M', desc: 'Messages (if logged in)' },
        { key: 'P', desc: 'Profile (if logged in)' },
        { key: '?', desc: 'This help panel' },
        { key: 'ESC', desc: 'Close modal' },
      ],
      close: 'Close',
    },
  };

  const c = content[language];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center z-50 group"
        aria-label="Yardım"
      >
        <span className="text-2xl font-bold">?</span>
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1 bg-neutral-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {language === 'tr' ? 'Yardım & Bilgi' : 'Help & Info'}
        </span>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">?</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{c.title}</h2>
                    <p className="text-white/80">{c.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Site Info */}
                <div className="space-y-4">
                  {c.sections.map((section, idx) => (
                    <div key={idx} className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                      <h3 className="font-bold text-neutral-900 dark:text-white mb-2">{section.title}</h3>
                      <ul className="space-y-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="text-sm text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
                            <span className="text-primary-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Right Column - Shortcuts */}
                <div className="space-y-4">
                  {/* Keyboard Shortcuts */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-3">⌨️ Klavye Kısayolları</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {c.shortcuts.map((shortcut, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <kbd className="px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded font-mono text-xs min-w-[28px] text-center">
                            {shortcut.key}
                          </kbd>
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">{shortcut.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4">
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-3">📊 Platform</h3>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">100%</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Ücretsiz</div>
                      </div>
                      <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-success-600">🔒</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">Güvenli</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  💡 Tip: {language === 'tr' ? 'Klavyede ? tuşuna basarak bu paneli açabilirsiniz' : 'Press ? on keyboard to open this panel'}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-primary"
                >
                  {c.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HelpButton;
