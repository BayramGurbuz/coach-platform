import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coachesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import SatisfactionWidget from '../components/SatisfactionWidget';

function LandingPage() {
  const { t } = useLanguage();
  const [topCoaches, setTopCoaches] = useState([]);
  const [stats, setStats] = useState({ coaches: 0, messages: 0, happyUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [ratingCount, setRatingCount] = useState(() => parseInt(localStorage.getItem('ratingCount') || '0', 10));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await coachesAPI.getAll();
        const coaches = response.data;
        
        // En çok mesaj alan 3 koç
        const sorted = [...coaches].sort((a, b) => (b.message_count || 0) - (a.message_count || 0));
        setTopCoaches(sorted.slice(0, 3));
        
        // İstatistikler
        const totalMessages = coaches.reduce((sum, c) => sum + (c.message_count || 0), 0);
        setStats({
          coaches: coaches.length,
          messages: totalMessages,
          happyUsers: Math.max(Math.floor(totalMessages * 0.95), ratingCount || 0),
        });
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCoachRating = (id) => {
    try {
      const arr = JSON.parse(localStorage.getItem(`coach_ratings_${id}`) || '[]');
      if (!arr || arr.length === 0) return { avg: 0, count: 0 };
      const sum = arr.reduce((s, r) => s + (r.rating || 0), 0);
      return { avg: sum / arr.length, count: arr.length };
    } catch (e) {
      return { avg: 0, count: 0 };
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container-custom py-24 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">{stats.coaches}+ {t('landing.statsCoaches')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t('landing.heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/coaches"
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('landing.findCoachBtn')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('landing.becomeCoachBtn')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-neutral-50 dark:fill-neutral-900"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{stats.coaches}+</div>
              <div className="text-neutral-600 dark:text-neutral-300">{t('landing.statsCoaches')}</div>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{stats.messages}+</div>
              <div className="text-neutral-600 dark:text-neutral-300">{t('landing.statsMessages')}</div>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">{Math.max(stats.happyUsers, ratingCount)}+</div>
              <div className="text-neutral-600 dark:text-neutral-300">{t('landing.statsUsers')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction Section */}
      <section className="bg-white dark:bg-neutral-800 py-16">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="card p-8">
            <SatisfactionWidget
              initialCount={ratingCount}
              onRate={(newCount) => {
                // update local count and the visible stats
                setRatingCount(newCount);
                localStorage.setItem('ratingCount', String(newCount));
                setStats((prev) => ({ ...prev, happyUsers: Math.max(prev.happyUsers, newCount) }));
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-neutral-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-neutral-50 dark:bg-neutral-700 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('landing.feature1Title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {t('landing.feature1Desc')}
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 bg-neutral-50 dark:bg-neutral-700 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
              <div className="w-14 h-14 bg-success-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('landing.feature2Title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {t('landing.feature2Desc')}
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 bg-neutral-50 dark:bg-neutral-700 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
              <div className="w-14 h-14 bg-warning-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('landing.feature3Title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {t('landing.feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Coaches Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {t('landing.topCoachesTitle')}
              </h2>
              <div className="w-16 h-1 bg-primary-600 rounded-full"></div>
            </div>
            <Link
              to="/coaches"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-2"
            >
              {t('landing.viewAll')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
              {t('common.loading')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topCoaches.map((coach, index) => (
                <div
                  key={coach.id}
                  className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {/* Rank Badge */}
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white z-10 ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-neutral-400' : 'bg-orange-600'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  {/* Profile Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    {coach.profile_image ? (
                      <img
                        src={coach.profile_image}
                        alt={coach.full_name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-5xl font-bold text-white">
                          {coach.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {coach.full_name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="font-semibold">{coach.message_count || 0} {t('coaches.messages')}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {(() => {
                        const r = getCoachRating(coach.id);
                        return (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 rounded-full text-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 .587l3.668 7.431L23.4 9.168l-5.6 5.458L18.836 24 12 20.201 5.164 24l1.036-9.374L.6 9.168l7.732-1.15L12 .587z" />
                            </svg>
                            <strong>{r.count ? r.avg.toFixed(1) : '—'}</strong>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">/5 • {r.count}</span>
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coach.specialties?.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                        ₺{coach.hourly_rate}
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{t('coaches.hourlyRate')}</span>
                      </span>
                      <Link
                        to={`/coach/${coach.id}`}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        {t('coaches.viewProfile')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('landing.heroSubtitle')}
          </h2>
          <Link
            to="/coaches"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-lg"
          >
            {t('landing.findCoachBtn')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

