import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { coachesAPI } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  // "Beni Hatırla" - localStorage'dan email yükle
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError(t('login.email') + ' ve ' + t('login.password') + ' gerekli');
      return;
    }

    try {
      setLoading(true);
      const response = await coachesAPI.login(formData);
      
      // "Beni Hatırla" - email'i kaydet veya sil
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      onLogin(response.data.coach, response.data.token);
        navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || t('common.error');
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      setError(t('login.email') + ' gerekli');
      return;
    }

    try {
      setForgotLoading(true);
      setError('');
      setForgotSuccess('');
      
      const response = await coachesAPI.forgotPassword({ email: forgotEmail });
      setForgotSuccess(response.data.message);
      setForgotEmail('');
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotSuccess('');
      }, 3000);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('login.title'), href: null },
          ]}
        />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('login.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {t('login.subtitle')}
          </p>
          {/* Koç bildirimi */}
          <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('login.coachOnly')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6" noValidate>
          {error && (
            <div className="bg-danger-100 border-2 border-danger-500 text-danger-800 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label dark:text-white">
              {t('login.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              autoComplete="email"
              required
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label dark:text-white">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          {/* Beni Hatırla */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-2 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {t('login.rememberMe')}
              </span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-primary-500 hover:text-primary-600 font-medium text-sm hover:underline"
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? t('login.loggingIn') : t('login.loginBtn')}
          </button>

          <p className="text-center text-neutral-600 dark:text-neutral-300">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 font-semibold hover:underline">
              {t('login.registerLink')}
            </Link>
          </p>
        </form>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForgotPassword(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {t('login.forgotPassword')}
                </h2>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {forgotSuccess && (
                <div className="bg-success-100 border-2 border-success-500 text-success-800 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">{forgotSuccess}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  Şifre sıfırlama talimatları email adresinize gönderilecektir.
                </p>

                <div>
                  <label htmlFor="forgot-email" className="label dark:text-white">
                    {t('login.email')}
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="input"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary flex-1"
                  >
                    {forgotLoading ? t('common.loading') : 'Gönder'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="btn-secondary"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
