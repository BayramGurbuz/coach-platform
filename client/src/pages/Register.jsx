import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { coachesAPI } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

function Register({ user, onRegister }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    bio: '',
    hourly_rate: '',
    specialties: [],
    years_experience: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const commonSpecialties = [
    t('register.careerCoaching'),
    t('register.lifeCoaching'),
    t('register.leadership'),
    t('register.personalDev'),
    t('register.workLife'),
    t('register.motivation'),
    t('register.fitness'),
    t('register.health'),
    t('register.nutrition'),
    t('register.mindfulness'),
    t('register.relationships'),
    t('register.finance'),
    t('register.entrepreneurship'),
    t('register.stress'),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const addSpecialty = (specialty) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }));
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = t('register.validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('register.validation.invalidEmail');

    if (!formData.password) newErrors.password = t('register.validation.passwordRequired');
    else if (formData.password.length < 6) newErrors.password = t('register.validation.passwordTooShort');

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.validation.passwordsDontMatch');
    }

    if (!formData.full_name) newErrors.full_name = t('register.validation.nameRequired');
    if (!formData.hourly_rate) newErrors.hourly_rate = t('register.validation.hourlyRateRequired');
    else if (parseFloat(formData.hourly_rate) <= 0) newErrors.hourly_rate = t('register.validation.hourlyRateInvalid');

    if (formData.specialties.length === 0) {
      newErrors.specialties = t('register.validation.specialtiesRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await coachesAPI.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        bio: formData.bio,
        hourly_rate: parseFloat(formData.hourly_rate),
        specialties: formData.specialties,
        years_experience: parseInt(formData.years_experience) || 0,
      });

      onRegister(response.data.coach, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || t('common.error');
      setErrors({ submit: errorMessage });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('register.title'), href: null },
          ]}
        />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('register.title')}
          </h1>
          <p className="text-neutral-600 dark:text-white">
            {t('register.subtitle')}
          </p>
          {/* Koç bildirimi */}
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('register.coachOnlyNotice')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6" noValidate>
          {errors.submit && (
            <div 
              className="bg-danger-100 border-2 border-danger-500 text-danger-800 px-4 py-3 rounded-lg"
              role="alert"
            >
              {errors.submit}
            </div>
          )}

          {/* Personal Information */}
          <fieldset>
            <legend className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('register.personalInfo')}
            </legend>

            <div className="space-y-4">
              <div>
                  <label htmlFor="full_name" className="label">
                  {t('register.fullName')} *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`input ${errors.full_name ? 'border-danger-500' : ''}`}
                  aria-required="true"
                  aria-invalid={errors.full_name ? 'true' : 'false'}
                  aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                />
                {errors.full_name && (
                  <p id="full_name-error" className="text-danger-500 text-sm mt-1" role="alert">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="label">
                  {t('register.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-danger-500' : ''}`}
                  aria-required="true"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-danger-500 text-sm mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  {t('register.password')} *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'border-danger-500' : ''}`}
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error password-hint' : 'password-hint'}
                />
                <p id="password-hint" className="text-sm text-neutral-600 dark:text-white mt-1">
                  {t('register.passwordHint')}
                </p>
                {errors.password && (
                  <p id="password-error" className="text-danger-500 text-sm mt-1" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  {t('register.confirmPassword')} *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-danger-500 text-sm mt-1" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Professional Information */}
          <fieldset>
            <legend className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('register.professionalInfo')}
            </legend>

            <div className="space-y-4">
              <div>
                  <label htmlFor="bio" className="label">
                  {t('register.bio')}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                  placeholder={t('register.bioPlaceholder')}
                  aria-describedby="bio-hint"
                />
                <p id="bio-hint" className="text-sm text-neutral-600 dark:text-white mt-1">
                  {t('register.bioHint')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hourly_rate" className="label">
                    {t('register.hourlyRateLabel')}
                  </label>
                  <input
                    type="number"
                    id="hourly_rate"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`input ${errors.hourly_rate ? 'border-danger-500' : ''}`}
                    aria-required="true"
                    aria-invalid={errors.hourly_rate ? 'true' : 'false'}
                    aria-describedby={errors.hourly_rate ? 'hourly_rate-error' : undefined}
                  />
                  {errors.hourly_rate && (
                    <p id="hourly_rate-error" className="text-danger-500 text-sm mt-1" role="alert">
                      {errors.hourly_rate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="years_experience" className="label">
                    {t('register.yearsExperience')}
                  </label>
                  <input
                    type="number"
                    id="years_experience"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    min="0"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="specialty-input" className="label">
                  {t('register.specialties')} *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="specialty-input"
                    value={currentSpecialty}
                    onChange={(e) => setCurrentSpecialty(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty(currentSpecialty);
                      }
                    }}
                    placeholder={t('register.specialtyPlaceholder')}
                    className="input"
                    aria-describedby="specialty-hint"
                  />
                  <button
                    type="button"
                    onClick={() => addSpecialty(currentSpecialty)}
                    className="btn-primary whitespace-nowrap"
                    aria-label={t('register.addSpecialtyAria')}
                  >
                    {t('register.addSpecialty')}
                  </button>
                </div>
                <p id="specialty-hint" className="text-sm text-neutral-600 dark:text-white mb-2">
                  {t('register.addByEnter')}
                </p>

                {/* Common specialties */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-neutral-700 dark:text-white mb-2">{t('register.popularSpecialties')}</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSpecialties.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => addSpecialty(spec)}
                        disabled={formData.specialties.includes(spec)}
                        className={`text-sm px-3 py-1 rounded-full border-2 transition-colors ${
                          formData.specialties.includes(spec)
                            ? 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed'
                            : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                        }`}
                        aria-label={`${spec} ${t('common.add')}`}
                        aria-pressed={formData.specialties.includes(spec)}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected specialties */}
                {formData.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-white mb-2">{t('register.selectedSpecialties')}</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="badge-primary flex items-center gap-2"
                        >
                          {spec}
                          <button
                            type="button"
                            onClick={() => removeSpecialty(spec)}
                            className="hover:text-danger-500 transition-colors"
                            aria-label={`${spec} ${t('common.remove')}`}
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {errors.specialties && (
                  <p className="text-danger-500 text-sm mt-2" role="alert">
                    {errors.specialties}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
              aria-label={loading ? t('register.registering') : t('register.registerBtn')}
            >
              {loading ? t('register.registering') : t('register.registerBtn')}
            </button>
            <Link to="/" className="btn-secondary flex-1 text-center">
              {t('common.cancel')}
            </Link>
          </div>

          <p className="text-center text-neutral-600 dark:text-white">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 font-semibold">
              {t('register.loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

