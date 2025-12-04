import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 dark:text-white mt-20" role="contentinfo">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'tr' ? 'Koç Platformu' : 'Coach Platform'}
            </h3>
            <p className="text-neutral-300 dark:text-neutral-200">
              {language === 'tr' 
                ? 'Profesyonel koçlarla buluşun. Kariyerinizi ve yaşamınızı geliştirin.'
                : 'Connect with professional coaches. Improve your career and life.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'tr' ? 'Hızlı Erişim' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-neutral-300 dark:text-neutral-200 hover:text-white transition-colors">
                  {language === 'tr' ? 'Ana Sayfa' : 'Home'}
                </a>
              </li>
              <li>
                <a href="/register" className="text-neutral-300 dark:text-neutral-200 hover:text-white transition-colors">
                  {language === 'tr' ? 'Koç Olarak Kayıt Ol' : 'Register as Coach'}
                </a>
              </li>
              <li>
                <a href="/login" className="text-neutral-300 dark:text-neutral-200 hover:text-white transition-colors">
                  {language === 'tr' ? 'Giriş Yap' : 'Login'}
                </a>
              </li>
            </ul>
          </div>

          {/* Accessibility Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'tr' ? 'Erişilebilirlik' : 'Accessibility'}
            </h3>
            <p className="text-neutral-300 dark:text-neutral-200">
              {language === 'tr'
                ? 'Bu platform renk körü dostu tasarımla geliştirilmiştir ve WCAG 2.1 AA standartlarını karşılar.'
                : 'This platform is designed with color-blind friendly features and meets WCAG 2.1 AA standards.'}
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800 dark:border-neutral-700 mt-8 pt-8 text-center text-neutral-400 dark:text-neutral-300">
          <p>&copy; {new Date().getFullYear()} {language === 'tr' ? 'Koç Platformu' : 'Coach Platform'}. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

