import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { coachesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Breadcrumbs from '../components/Breadcrumbs';

function CoachesPage() {
  const { t, language } = useLanguage();
  const resultsRef = useRef(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shouldScroll, setShouldScroll] = useState(false);
  const [filters, setFilters] = useState(() => {
    // LocalStorage'dan filtreleri yükle (HCI: Hafıza yükünü azalt)
    const saved = localStorage.getItem('coachFilters');
    return saved ? JSON.parse(saved) : {
      specialty: '',
      minRate: '',
      maxRate: '',
      minExperience: '',
      maxExperience: '',
      search: '',
    };
  });
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('coachSortBy') || '';
  });
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    fetchSpecialties();
    fetchCoaches();
  }, []);

  // Filtreleri LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('coachFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('coachSortBy', sortBy);
  }, [sortBy]);

  const fetchSpecialties = async () => {
    try {
      const response = await coachesAPI.getSpecialties();
      setSpecialties(response.data);
    } catch (err) {
      console.error('Uzmanlık alanları yüklenemedi:', err);
    }
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const response = await coachesAPI.getAll(filters);
      setCoaches(response.data);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoaches();
    // Arama yapıldıktan sonra "X koç bulundu" yazısına scroll (tam görünsün)
    setTimeout(() => {
      if (resultsRef.current) {
        const yOffset = -100; // Üstten 20px boşluk bırak
        const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  };

  const clearFilters = () => {
    const emptyFilters = {
      specialty: '',
      minRate: '',
      maxRate: '',
      minExperience: '',
      maxExperience: '',
      search: '',
    };
    setFilters(emptyFilters);
    setSortBy('');
    localStorage.removeItem('coachFilters');
    localStorage.removeItem('coachSortBy');
    setTimeout(() => fetchCoaches(), 100);
  };

  // Sıralama fonksiyonu
  const sortCoaches = (coachesList) => {
    if (!sortBy) return coachesList;

    const sorted = [...coachesList];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.full_name || '').localeCompare(b.full_name || '', 'tr-TR')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.full_name || '').localeCompare(a.full_name || '', 'tr-TR')
        );
      case 'msg-desc':
        return sorted.sort((a, b) => (b.message_count || 0) - (a.message_count || 0));
      case 'msg-asc':
        return sorted.sort((a, b) => (a.message_count || 0) - (b.message_count || 0));
      case 'exp-desc':
        return sorted.sort((a, b) => (b.years_experience || 0) - (a.years_experience || 0));
      case 'exp-asc':
        return sorted.sort((a, b) => (a.years_experience || 0) - (b.years_experience || 0));
      default:
        return sorted;
    }
  };

  const sortedCoaches = sortCoaches(coaches);

  return (
    <div className="container-custom py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.findCoach'), href: null },
        ]}
      />

      {/* Header */}
      <section className="text-center mb-12" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {t('coaches.title')}
        </h1>

        {/* Kayıt olmadan iletişim bildirimi */}
        <div className="inline-flex items-center gap-2 bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 px-4 py-2 rounded-full text-sm border border-success-200 dark:border-success-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{language === 'tr' ? 'Kayıt olmadan koçlarla iletişime geçebilirsiniz!' : 'Contact coaches without registration!'}</span>
        </div>
      </section>

      {/* Filter Section */}
      <section className="card mb-12" role="search">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Row 1: Search & Specialty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="label dark:text-white">
                🔍 {t('common.search')}
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t('coaches.searchPlaceholder')}
                className="input"
              />
            </div>

            {/* Specialty */}
            <div>
              <label htmlFor="specialty" className="label dark:text-white">
                🎯 {t('coaches.filterSpecialty')}
              </label>
              <select
                id="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">{t('coaches.filterAllSpecialties')}</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sortBy" className="label dark:text-white">
                📊 {t('coaches.sortBy')}
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="">{t('coaches.sortDefault')}</option>
                <option value="price-asc">💰 {t('coaches.sortPriceAsc')}</option>
                <option value="price-desc">💎 {t('coaches.sortPriceDesc')}</option>
                <option value="name-asc">🔤 {t('coaches.sortNameAsc')}</option>
                <option value="name-desc">🔤 {t('coaches.sortNameDesc')}</option>
                <option value="msg-desc">📬 {t('coaches.sortMsgDesc')}</option>
                <option value="msg-asc">📭 {t('coaches.sortMsgAsc')}</option>
                <option value="exp-desc">⭐ {t('coaches.sortExpDesc')}</option>
                <option value="exp-asc">🌱 {t('coaches.sortExpAsc')}</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price & Experience Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Min Rate */}
            <div>
              <label htmlFor="minRate" className="label dark:text-white">
                {t('coaches.filterMinPrice')}
              </label>
              <input
                type="number"
                id="minRate"
                name="minRate"
                value={filters.minRate}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                className="input"
              />
            </div>

            {/* Max Rate */}
            <div>
              <label htmlFor="maxRate" className="label dark:text-white">
                {t('coaches.filterMaxPrice')}
              </label>
              <input
                type="number"
                id="maxRate"
                name="maxRate"
                value={filters.maxRate}
                onChange={handleFilterChange}
                placeholder="1000"
                min="0"
                className="input"
              />
            </div>

            {/* Min Experience */}
            <div>
              <label htmlFor="minExperience" className="label dark:text-white">
                {t('coaches.filterMinExp')}
              </label>
              <input
                type="number"
                id="minExperience"
                name="minExperience"
                value={filters.minExperience}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                className="input"
              />
            </div>

            {/* Max Experience */}
            <div>
              <label htmlFor="maxExperience" className="label dark:text-white">
                {t('coaches.filterMaxExp')}
              </label>
              <input
                type="number"
                id="maxExperience"
                name="maxExperience"
                value={filters.maxExperience}
                onChange={handleFilterChange}
                placeholder="30"
                min="0"
                className="input"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('common.search')}
            </button>
            <button type="button" onClick={clearFilters} className="btn-secondary">
              {t('coaches.clearFilters')}
            </button>
          </div>
        </form>
      </section>

      {/* Results Section */}
      <section ref={resultsRef} aria-labelledby="results-heading">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h2 id="results-heading" className="text-2xl font-bold text-neutral-900 dark:text-white">
              {coaches.length} {language === 'tr' ? 'koç bulundu' : 'coaches found'}
            </h2>
            {/* Aşağı Ok - Koçların aşağıda olduğunu gösterir */}
            <svg className="w-6 h-6 text-primary-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          
          {sortBy && (
            <div className="text-sm text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-lg">
              🔄 {t('coaches.sortBy')}: <strong>
                {sortBy === 'price-asc' && t('coaches.sortPriceAsc')}
                {sortBy === 'price-desc' && t('coaches.sortPriceDesc')}
                {sortBy === 'name-asc' && t('coaches.sortNameAsc')}
                {sortBy === 'name-desc' && t('coaches.sortNameDesc')}
                {sortBy === 'msg-desc' && t('coaches.sortMsgDesc')}
                {sortBy === 'msg-asc' && t('coaches.sortMsgAsc')}
                {sortBy === 'exp-desc' && t('coaches.sortExpDesc')}
                {sortBy === 'exp-asc' && t('coaches.sortExpAsc')}
              </strong>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300">{t('coaches.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-danger-500">{error}</div>
        ) : coaches.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">{t('coaches.noResults')}</p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              {t('coaches.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCoaches.map((coach) => (
              <article key={coach.id} className="card hover:shadow-xl transition-all transform hover:-translate-y-1">
                {/* Profile Image */}
                <div className="flex items-center gap-4 mb-4">
                  {coach.profile_image ? (
                    <img
                      src={coach.profile_image}
                      alt={coach.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-primary-200">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {coach.full_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {coach.full_name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {coach.years_experience || 0} {t('coaches.yearsExp')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₺{coach.hourly_rate}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('coaches.hourlyRate')}</p>
                  </div>
                </div>

                {/* Message Count Badge */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {coach.message_count || 0} {t('coaches.messages')}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-neutral-700 dark:text-neutral-300 mb-4 line-clamp-2">
                  {coach.bio || '-'}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties?.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="badge-primary text-xs">
                      {specialty}
                    </span>
                  ))}
                  {coach.specialties?.length > 3 && (
                    <span className="text-xs text-neutral-500">+{coach.specialties.length - 3}</span>
                  )}
                </div>

                {/* Actions */}
                <Link
                  to={`/coach/${coach.id}`}
                  className="btn-primary w-full text-center"
                >
                  {t('coaches.viewProfile')}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CoachesPage;

