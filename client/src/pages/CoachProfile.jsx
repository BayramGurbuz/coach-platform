import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coachesAPI, messagesAPI } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const undoNotificationRef = useRef(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    sender_name: '',
    sender_email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sentMessageData, setSentMessageData] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  useEffect(() => {
    fetchCoach();
    // Sayfa açılınca en üste scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Undo notification'a scroll (font büyümesini engellemek için block: 'nearest')
  useEffect(() => {
    if (successMessage && sentMessageData && undoNotificationRef.current) {
      setTimeout(() => {
        undoNotificationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [successMessage, sentMessageData]);

  const fetchCoach = async () => {
    try {
      setLoading(true);
      const response = await coachesAPI.getById(id);
      setCoach(response.data);
    } catch (err) {
      setError('Koç bilgileri yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    
    if (!contactForm.sender_name || !contactForm.sender_email || !contactForm.message) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setSending(true);
      const response = await messagesAPI.send({
        coach_id: parseInt(id),
        ...contactForm,
      });
      
      // Mesajı ve form verilerini sakla (30 saniye geri alma için)
      const messageData = {
        messageId: response.data.id,
        formData: { ...contactForm },
      };
      setSentMessageData(messageData);
      
      setSuccessMessage('Mesajınız gönderildi! 30 saniye içinde geri alabilirsiniz.');
      setContactForm({
        sender_name: '',
        sender_email: '',
        message: '',
      });
      setShowContactForm(false);
      
      // 30 saniye sonra geri alma özelliğini kaldır
      const timer = setTimeout(() => {
        setSentMessageData(null);
        setSuccessMessage('');
      }, 30000);
      
      setUndoTimer(timer);
    } catch (err) {
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleUndoSendMessage = async () => {
    if (!sentMessageData) return;
    
    try {
      // Mesajı sil
      await messagesAPI.delete(sentMessageData.messageId);
      
      // Form verilerini geri yükle
      setContactForm(sentMessageData.formData);
      setShowContactForm(true);
      setSentMessageData(null);
      setSuccessMessage('Mesaj gönderimi iptal edildi. Mesajınızı düzenleyebilirsiniz.');
      
      // Timer'ı temizle
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }
      
      // Success mesajını 3 saniye sonra temizle
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      alert('Geri alma işlemi başarısız oldu.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-600 dark:text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="container-custom py-12">
      <div className="text-center py-12 text-danger-500 dark:text-danger-400" role="alert">
        <p>{error || 'Koç bulunamadı'}</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Ana Sayfaya Dön
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate('/')}
        className="btn-outline mb-6 flex items-center"
        aria-label="Ana sayfaya geri dön"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Geri Dön
      </button>

      {successMessage && (
        <div 
          ref={undoNotificationRef}
          className={`${
            sentMessageData 
              ? 'bg-warning-100 border-warning-500 text-warning-800' 
              : 'bg-success-100 border-success-500 text-success-800'
          } border-2 px-6 py-4 rounded-lg mb-6 flex items-center justify-between animate-slide-in`}
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
              {sentMessageData ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <p className="font-semibold">{successMessage}</p>
          </div>
          
          {sentMessageData && (
            <button
              onClick={handleUndoSendMessage}
              className="ml-4 px-4 py-2 bg-white text-warning-700 font-semibold rounded-lg hover:bg-warning-50 transition-colors border-2 border-warning-600"
            >
              ↶ Geri Al
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="card">
            <header className="border-b border-neutral-200 dark:border-neutral-700 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {coach.full_name}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-white">
                {coach.years_experience || 0} yıl deneyim
              </p>
            </header>

            <section className="mb-8" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Hakkında
              </h2>
              <p className="text-neutral-700 dark:text-white text-lg leading-relaxed">
                {coach.bio || 'Henüz bir açıklama eklenmemiş.'}
              </p>
            </section>

            <section className="mb-8" aria-labelledby="specialties-heading">
              <h2 id="specialties-heading" className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Uzmanlık Alanları
              </h2>
              <div className="flex flex-wrap gap-3">
                {coach.specialties?.map((specialty, index) => (
                  <span key={index} className="badge-primary text-base px-4 py-2">
                    {specialty}
                  </span>
                ))}
              </div>
            </section>

            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                İletişim
              </h2>
              <div className="bg-neutral-50 p-6 rounded-lg">
                <p className="text-neutral-700 dark:text-white mb-4">
                  <strong>Email:</strong> {coach.email}
                </p>
                <p className="text-sm text-neutral-600 dark:text-white mb-4">
                  Bu koç ile iletişime geçmek için aşağıdaki butona tıklayarak mesaj gönderebilirsiniz.
                </p>
                {!showContactForm ? (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="btn-primary"
                    aria-label="Mesaj gönderme formunu aç"
                  >
                    Mesaj Gönder
                  </button>
                ) : (
                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div>
                      <label htmlFor="sender_name" className="label">
                        Adınız *
                      </label>
                      <input
                        type="text"
                        id="sender_name"
                        name="sender_name"
                        value={contactForm.sender_name}
                        onChange={handleContactFormChange}
                        required
                        className="input"
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="sender_email" className="label">
                        Email Adresiniz *
                      </label>
                      <input
                        type="email"
                        id="sender_email"
                        name="sender_email"
                        value={contactForm.sender_email}
                        onChange={handleContactFormChange}
                        required
                        className="input"
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="label">
                        Mesajınız *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        required
                        rows="5"
                        className="input"
                        aria-required="true"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={sending}
                        className="btn-primary"
                        aria-label={sending ? 'Gönderiliyor...' : 'Mesajı gönder'}
                      >
                        {sending ? 'Gönderiliyor...' : 'Gönder'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="btn-secondary"
                        aria-label="Formu kapat"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </article>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="text-center border-b border-neutral-200 pb-6 mb-6">
              <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-primary-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {coach.full_name}
                  </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <span className="text-neutral-700 dark:text-white font-medium">Saatlik Ücret</span>
                <span className="text-3xl font-bold text-primary-500">
                  {coach.hourly_rate}₺
                </span>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-700 dark:text-white font-medium">Deneyim</span>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {coach.years_experience || 0} Yıl
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CoachProfile;

