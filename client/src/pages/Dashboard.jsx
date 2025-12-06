import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coachesAPI } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmDialog from '../components/ConfirmDialog';
import { useLanguage } from '../context/LanguageContext';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    hourly_rate: '',
    specialties: [],
    years_experience: '',
  });
  const [currentSpecialty, setCurrentSpecialty] = useState('');
  
  // Profile image
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Password change
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      full_name: user.full_name || '',
      bio: user.bio || '',
      hourly_rate: user.hourly_rate || '',
      specialties: user.specialties || [],
      years_experience: user.years_experience || '',
    });
    
    setProfileImagePreview(user.profile_image || '');
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.specialties.length === 0) {
      setError(t('dashboard.minSpecialtyRequired'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await coachesAPI.updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        hourly_rate: parseFloat(formData.hourly_rate),
        specialties: formData.specialties,
        years_experience: parseInt(formData.years_experience) || 0,
      });

      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      showSuccess(t('dashboard.profileUpdated'));
      setIsEditing(false);
    } catch (err) {
      setError(t('dashboard.profileUpdateError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError(t('dashboard.fileTooLarge'));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(t('dashboard.invalidImageFile'));
        return;
      }
      
      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile && !profileImagePreview) {
      setError(t('dashboard.invalidImageFile'));
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      
      // If there's a new file, use its base64
      // Otherwise, keep the existing preview (already uploaded)
      await coachesAPI.updateProfileImage({ 
        profile_image: profileImagePreview 
      });
      
      // Update local storage
      const updatedUser = { ...user, profile_image: profileImagePreview };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showSuccess(t('dashboard.profileImageUpdated'));
      setProfileImageFile(null);
    } catch (err) {
      setError(t('dashboard.profileImageUpdateError'));
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    setError('');
    
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setError(t('dashboard.fillAllFields'));
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setError(t('dashboard.passwordTooShort'));
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError(t('dashboard.passwordsDontMatch'));
      return;
    }

    try {
      setPasswordLoading(true);
      
      await coachesAPI.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      showSuccess(t('dashboard.passwordChanged'));
    } catch (err) {
      const errorMessage = err.response?.data?.error || t('dashboard.passwordChangeError');
      setError(errorMessage);
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('dashboard.title'), href: null },
          ]}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-neutral-600 dark:text-white">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {successMessage && (
          <div 
            className="bg-success-100 border-2 border-success-500 text-success-800 px-6 py-4 rounded-lg mb-6"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg 
                className="w-6 h-6 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div 
            className="bg-danger-100 border-2 border-danger-500 text-danger-800 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="card mb-6">
          <div 
            className="flex gap-4 border-b border-neutral-200 dark:border-neutral-700 pb-4"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'profile'}
            >
              👤 {t('dashboard.tabProfile')}
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'image'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'image'}
            >
              📸 {t('dashboard.tabPhoto')}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'security'}
            >
              🔒 {t('dashboard.tabSecurity')}
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                      {user.full_name}
                    </h2>
                    <p className="text-neutral-600 dark:text-white">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                    aria-label={t('dashboard.tabProfile')}
                  >
                    <span className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('common.edit')}
                    </span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      {t('register.bio')}
                    </h3>
                    <p className="text-neutral-700 dark:text-white">
                      {user.bio || t('coachProfile.noDescription')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                          {t('coachProfile.hourlyRate')}
                        </h3>
                        <p className="text-3xl font-bold text-primary-500">
                          {user.hourly_rate}₺
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                          {t('coachProfile.experience')}
                        </h3>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                          {user.years_experience || 0} {t('coaches.yearsExp')}
                        </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                        {t('register.specialties')}
                      </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.specialties?.map((specialty, index) => (
                        <span key={index} className="badge-primary">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="text-xl font-bold text-danger-600 dark:text-danger-400 mb-2">
                    {t('dashboard.deleteAccountTitle') || 'Hesabı Sil'}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                    {t('dashboard.deleteAccountDesc') || 'Hesabınızı ve tüm mesajlarınızı kalıcı olarak silmek için bu seçeneği kullanın.'}
                  </p>
                    <button
                      onClick={() => setConfirmOpen(true)}
                      className="btn bg-danger-500 text-white hover:bg-danger-600 w-full"
                    >
                      {t('dashboard.deleteAccountBtn') || 'Hesabımı Sil'}
                    </button>

                  <ConfirmDialog
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title={t('dashboard.deleteAccountTitle')}
                    message={t('dashboard.deleteConfirm')}
                    confirmText={t('common.yes')}
                    cancelText={t('common.cancel')}
                    type="danger"
                    onConfirm={async () => {
                      try {
                        await coachesAPI.deleteAccount();
                        setConfirmOpen(false);
                        onLogout?.();
                        navigate('/');
                      } catch (err) {
                        setConfirmOpen(false);
                        setError(t('common.error'));
                        console.error(err);
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {t('dashboard.editProfile') || 'Profili Düzenle'}
                  </h2>
                </div>

                <div>
                  <label htmlFor="full_name" className="label">
                    {t('register.fullName')}
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="label">
                    {t('register.bio')}
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="5"
                    className="input"
                    placeholder={t('register.bioPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hourly_rate" className="label">
                      {t('register.hourlyRateLabel') || 'Saatlik Ücret (₺)'}
                    </label>
                    <input
                      type="number"
                      id="hourly_rate"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="years_experience" className="label">
                      {t('register.yearsExperience') || 'Deneyim (Yıl)'}
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
                    {t('register.specialties')}
                  </label>
                  <div className="flex gap-2 mb-3">
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
                    />
                    <button
                      type="button"
                      onClick={() => addSpecialty(currentSpecialty)}
                      className="btn-primary whitespace-nowrap"
                    >
                      {t('register.addSpecialty')}
                    </button>
                  </div>

                  {formData.specialties.length > 0 && (
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
                            aria-label={`${spec} ${t('common.remove') || 'kaldır'}`}
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
                  )}
                </div>

                  <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? t('common.save') + '...' : t('common.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setFormData({
                        full_name: user.full_name || '',
                        bio: user.bio || '',
                        hourly_rate: user.hourly_rate || '',
                        specialties: user.specialties || [],
                        years_experience: user.years_experience || '',
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Profile Image Tab */}
        {activeTab === 'image' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('dashboard.tabPhoto')}
            </h2>
            <p className="text-neutral-600 dark:text-white mb-6">
              {t('dashboard.photoHint')}
            </p>

            <div className="space-y-6">
              {/* Current/Preview Image */}
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profil resmi önizleme" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<svg class="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                      }}
                    />
                  ) : (
                    <svg 
                      className="w-16 h-16 text-primary-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {profileImagePreview ? t('dashboard.currentImage') : t('dashboard.noProfileImage')}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-white">
                    {t('dashboard.imageFormats')}
                  </p>
                </div>
              </div>

              {/* File Input */}
              <div>
                <label htmlFor="profile-image-file" className="label">
                  {t('dashboard.chooseImage')}
                </label>
                <input
                  type="file"
                  id="profile-image-file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-neutral-600 dark:text-neutral-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900 dark:file:text-primary-300
                    file:cursor-pointer cursor-pointer"
                />
              </div>

              <button
                onClick={handleImageUpload}
                disabled={uploadingImage || (!profileImageFile && !profileImagePreview)}
                className="btn-primary w-full"
              >
                {uploadingImage ? t('common.loading') : t('dashboard.updateProfileImageBtn')}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('dashboard.tabSecurity')}
            </h2>
            <p className="text-neutral-600 dark:text-white mb-6">
              {t('dashboard.passwordHint')}
            </p>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="current_password" className="label">
                  {t('dashboard.currentPassword')}
                </label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordFormChange}
                  className="input"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="new_password" className="label">
                  {t('dashboard.newPassword')}
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordFormChange}
                  className="input"
                  autoComplete="new-password"
                  required
                />
                <p className="text-sm text-neutral-600 dark:text-white mt-1">
                  En az 6 karakter olmalıdır
                </p>
              </div>

              <div>
                <label htmlFor="confirm_password" className="label">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordFormChange}
                  className="input"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-primary w-full"
              >
                {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

