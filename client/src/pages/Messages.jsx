import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

function Messages({ user }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const undoNotificationRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, messageId: null, senderName: '' });
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  
  // Geri alma için state'ler
  const [deletedMessage, setDeletedMessage] = useState(null);
  const [deletedAllMessages, setDeletedAllMessages] = useState(null); // Tüm silinen mesajlar
  const [undoTimer, setUndoTimer] = useState(null);
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [undoType, setUndoType] = useState('single'); // 'single' veya 'all'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMessages();
  }, [user, navigate]);

  // Undo notification'a scroll (font büyümesini engellemek için block: 'nearest')
  useEffect(() => {
    if (showUndoNotification && undoNotificationRef.current) {
      setTimeout(() => {
        undoNotificationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showUndoNotification]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getMyMessages();
      setMessages(response.data);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      setError(t('common.error'));
      console.error('Mesaj okundu işaretlenemedi:', err);
    }
  };

  // Okunmadı olarak işaretle
  const handleMarkAsUnread = async (messageId) => {
    try {
      await messagesAPI.markAsUnread(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: false } : msg
        )
      );
    } catch (err) {
      setError(t('common.error'));
      console.error('Mesaj okunmadı işaretlenemedi:', err);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      const messageToDelete = messages.find(msg => msg.id === confirmDelete.messageId);
      await messagesAPI.delete(confirmDelete.messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== confirmDelete.messageId));
      
      // Geri alma için sakla
      setDeletedMessage(messageToDelete);
      setDeletedAllMessages(null);
      setUndoType('single');
      setShowUndoNotification(true);
      setConfirmDelete({ isOpen: false, messageId: null, senderName: '' });
      
      // Önceki timer'ı temizle
      if (undoTimer) clearTimeout(undoTimer);
      
      const timer = setTimeout(() => {
        setDeletedMessage(null);
        setShowUndoNotification(false);
      }, 30000);
      
      setUndoTimer(timer);
    } catch (err) {
      alert(t('common.error'));
      console.error('Mesaj silme hatası:', err);
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      // Önce tüm mesajları sakla (geri alma için)
      const allMessages = [...messages];
      
      await messagesAPI.deleteAll();
      setMessages([]);
      setConfirmDeleteAll(false);
      
      // Geri alma için sakla
      setDeletedAllMessages(allMessages);
      setDeletedMessage(null);
      setUndoType('all');
      setShowUndoNotification(true);
      
      // Önceki timer'ı temizle
      if (undoTimer) clearTimeout(undoTimer);
      
      const timer = setTimeout(() => {
        setDeletedAllMessages(null);
        setShowUndoNotification(false);
      }, 30000);
      
      setUndoTimer(timer);
    } catch (err) {
      alert(t('common.error'));
      console.error('Tüm mesajları silme hatası:', err);
    }
  };

  const handleUndo = async () => {
    try {
      if (undoType === 'single' && deletedMessage) {
        // Tek mesajı geri yükle
        setMessages((prev) => [...prev, deletedMessage]);
        setDeletedMessage(null);
      } else if (undoType === 'all' && deletedAllMessages) {
        // Tüm mesajları geri yükle
        setMessages(deletedAllMessages);
        setDeletedAllMessages(null);
      }
      
      setShowUndoNotification(false);
      
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }
    } catch (err) {
      alert(t('common.error'));
      console.error(err);
    }
  };

  // Filtreleme
  const filterByDate = (msg) => {
    if (dateFilter === 'all') return true;
    
    const msgDate = new Date(msg.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const msgDay = new Date(msgDate);
      msgDay.setHours(0, 0, 0, 0);
      return msgDay.getTime() === today.getTime();
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return msgDate >= weekAgo;
    }
    
    if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return msgDate >= monthAgo;
    }
    
    return true;
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filter === 'unread') return !msg.is_read;
      if (filter === 'read') return msg.is_read;
      return true;
    })
    .filter(filterByDate)
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const locale = language === 'tr' ? 'tr-TR' : 'en-US';

    if (minutes < 1) return t('messages.justNow');
    if (minutes < 60) return t('messages.minutesAgo').replace('{{count}}', minutes);
    if (hours < 24) return t('messages.hoursAgo').replace('{{count}}', hours);
    if (days < 7) return t('messages.daysAgo').replace('{{count}}', days);

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('messages.title'), href: null },
            ]}
          />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {t('messages.title')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                {t('messages.subtitle')}
              </p>
            </div>
            
            {messages.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="btn bg-danger-500 text-white hover:bg-danger-600 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('messages.deleteAll')}
              </button>
            )}
          </div>

          {/* Undo Notification - Scroll hedefi */}
          {showUndoNotification && (
            <div 
              ref={undoNotificationRef}
              className="bg-warning-100 border-2 border-warning-500 text-warning-800 px-6 py-4 rounded-lg mb-6 flex items-center justify-between animate-slide-in"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">
                    {undoType === 'all' 
                      ? `${deletedAllMessages?.length || 0} ${t('messages.allDeleted')}`
                      : `${deletedMessage?.sender_name} - ${t('messages.messageDeleted')}`
                    }
                  </p>
                  <p className="text-sm">30 {t('coachProfile.undoMessage')}</p>
                </div>
              </div>
              
              <button
                onClick={handleUndo}
                className="ml-4 px-4 py-2 bg-white text-warning-700 font-semibold rounded-lg hover:bg-warning-50 transition-colors border-2 border-warning-600"
              >
                ↶ {t('coachProfile.undo')}
              </button>
            </div>
          )}

          {/* Filter Section */}
          <div className="card mb-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-4" role="tablist">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                  role="tab"
                >
                  {t('messages.filterAll')} ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                    filter === 'unread'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                  role="tab"
                >
                  {t('messages.filterUnread')} ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                    filter === 'read'
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                  role="tab"
                >
                  {t('messages.filterRead')} ({messages.length - unreadCount})
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="label dark:text-white">{t('messages.filterByDate')}</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">{t('messages.filterAll')}</option>
                    <option value="today">📅 {t('messages.dateToday')}</option>
                    <option value="week">📆 {t('messages.dateThisWeek')}</option>
                    <option value="month">🗓️ {t('messages.dateThisMonth')}</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="label dark:text-white">{t('coaches.sortBy')}</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="input"
                  >
                    <option value="newest">🕐 {t('messages.dateNewest')}</option>
                    <option value="oldest">🕰️ {t('messages.dateOldest')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div id="messages-panel" role="tabpanel" aria-live="polite">
            {loading ? (
              <div className="text-center py-12" role="status">
                <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-neutral-600 dark:text-neutral-300">{t('messages.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-danger-500" role="alert">
                <p>{error}</p>
                <button onClick={fetchMessages} className="btn-primary mt-4">
                  {t('common.retry')}
                </button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xl text-neutral-600 dark:text-neutral-300">
                  {t('messages.noMessages')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <article
                    key={message.id}
                    className={`card hover:shadow-lg transition-shadow ${
                      !message.is_read
                        ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-bold">
                              {message.sender_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                              {message.sender_name}
                              {!message.is_read && (
                                <span className="badge bg-primary-500 text-white text-xs">
                                  {t('messages.unread')}
                                </span>
                              )}
                            </h3>
                            <a 
                              href={`mailto:${message.sender_email}`}
                              className="text-sm text-primary-500 dark:text-primary-400 hover:underline"
                            >
                              {message.sender_email}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(message.created_at)}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                          {new Date(message.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                        </p>
                      </div>
                    </div>

                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                      {message.message}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {/* Okundu / Okunmadı İşaretle Butonları */}
                      {!message.is_read ? (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="btn-outline flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('messages.markAsRead')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(message.id)}
                          className="btn-outline flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {t('messages.markAsUnread')}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setConfirmDelete({ 
                          isOpen: true, 
                          messageId: message.id,
                          senderName: message.sender_name
                        })}
                        className="btn bg-danger-500 text-white hover:bg-danger-600 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('messages.delete')}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, messageId: null, senderName: '' })}
        onConfirm={handleDeleteMessage}
        title={t('messages.delete')}
        message={
          language === 'tr'
            ? `${confirmDelete.senderName} kullanıcısından gelen mesajı silmek istediğinizden emin misiniz?`
            : `Are you sure you want to delete the message from ${confirmDelete.senderName}?`
        }
        confirmText={t('common.yes')}
        cancelText={t('common.cancel')}
        type="danger"
      />

      <ConfirmDialog
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={handleDeleteAllMessages}
        title={t('messages.deleteAll')}
        message={`${t('messages.deleteAllConfirm')} (${messages.length})`}
        confirmText={t('common.yes')}
        cancelText={t('common.cancel')}
        type="danger"
      />
    </>
  );
}

export default Messages;
