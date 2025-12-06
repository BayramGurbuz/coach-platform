import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import HelpButton from './components/HelpButton';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import CoachesPage from './pages/CoachesPage';
import CoachProfile from './pages/CoachProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import SettingsSimple from './pages/SettingsSimple';
import { LanguageProvider } from './context/LanguageContext';

// Inner component to use hooks
function AppContent({ user, onLogout, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Shneiderman Kural 2: Klavye Kısayolları
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // H - Ana sayfa
      if (e.key === 'h' || e.key === 'H') {
        navigate('/');
        setToast({ message: 'Ana sayfaya yönlendiriliyorsunuz', type: 'info' });
      }

      // C - Koç Bul
      if (e.key === 'c' || e.key === 'C') {
        navigate('/coaches');
        setToast({ message: 'Koç Bul sayfasına yönlendiriliyorsunuz', type: 'info' });
      }

      // S - Ayarlar
      if (e.key === 's' || e.key === 'S') {
        navigate('/settings');
        setToast({ message: 'Ayarlar sayfasına yönlendiriliyorsunuz', type: 'info' });
      }

      // D - Dark mode toggle
      if (e.key === 'd' || e.key === 'D') {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        setToast({ 
          message: `${newTheme === 'dark' ? 'Koyu' : 'Açık'} tema etkinleştirildi`, 
          type: 'success' 
        });
      }

      // M - Mesajlar (sadece giriş yapılmışsa)
      if ((e.key === 'm' || e.key === 'M') && user) {
        navigate('/messages');
        setToast({ message: 'Mesajlar sayfasına yönlendiriliyorsunuz', type: 'info' });
      }

      // P - Profil (sadece giriş yapılmışsa)
      if ((e.key === 'p' || e.key === 'P') && user) {
        navigate('/dashboard');
        setToast({ message: 'Profilinize yönlendiriliyorsunuz', type: 'info' });
      }

      // ? - Klavye kısayolları yardımı
      if (e.key === '?') {
        setShowKeyboardHelp(true);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Ana içeriğe geç
      </a>

      <Header user={user} onLogout={onLogout} />
      
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/coach/:id" element={<CoachProfile />} />
          <Route path="/register" element={<Register user={user} onRegister={(userData, token) => {
            onLogin(userData, token);
            setToast({ message: '✓ Kayıt başarılı! Hoş geldiniz!', type: 'success' });
          }} />} />
          <Route path="/login" element={<Login onLogin={(userData, token) => {
            onLogin(userData, token);
            setToast({ message: '✓ Giriş başarılı! Hoş geldiniz!', type: 'success' });
          }} />} />
          <Route path="/dashboard" element={<Dashboard user={user} onLogout={onLogout} />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/settings" element={<SettingsSimple />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Floating Help Button - HCI: Yardım & Dökümantasyon */}
      <HelpButton />
      
      {/* Keyboard Shortcuts Help - Shneiderman Kural 2 */}
      <KeyboardShortcutsHelp 
        isOpen={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />
      
      {/* Toast Notifications - Shneiderman Kural 3: Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    // Initialize user synchronously from localStorage so child routes
    // don't redirect to /login during the initial render on page refresh.
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      return token && userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Failed to parse stored user', err);
      return null;
    }
  });

  useEffect(() => {
    // Apply saved theme and font size on app load
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';

    // Apply theme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font size
    const root = document.documentElement;
    switch (savedFontSize) {
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
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <LanguageProvider>
      <Router>
        <AppContent user={user} onLogout={handleLogout} onLogin={handleLogin} />
      </Router>
    </LanguageProvider>
  );
}

export default App;
