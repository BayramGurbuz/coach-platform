import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const emojis = ['😞','😕','😐','🙂','😍'];

function SatisfactionWidget({ initialCount = 0, onRate } ) {
  const { t, language } = useLanguage();
  const [rating, setRating] = useState(() => parseInt(localStorage.getItem('site_user_rating') || '0', 10));
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('site_rating_count') || String(initialCount), 10));
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [thanks, setThanks] = useState('');
  const [userHasVoted, setUserHasVoted] = useState(() => Boolean(localStorage.getItem('site_user_rating')));

  useEffect(() => {
    localStorage.setItem('site_rating_count', String(count));
  }, [count]);

  useEffect(() => {
    // Do not persist the user's site rating immediately when they click an icon.
    // Persist only on explicit submit so user can still type a comment.
    if (onRate) onRate(count);
  }, [rating, count]);

  const handleSelect = (value) => {
    // Prevent multiple votes: check both state and persistent storage
    if (userHasVoted || localStorage.getItem('site_user_rating')) return;
    if (rating && rating === value) return; // idempotent
    setRating(value);
    // Show comment box after selection; count increment will happen on submit
    setShowComment(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // store locally for now; in future POST to /api/site/rate
      const existing = JSON.parse(localStorage.getItem('site_ratings_list') || '[]');
      existing.push({ rating, comment, date: new Date().toISOString() });
      localStorage.setItem('site_ratings_list', JSON.stringify(existing));
      // mark that this browser/user has voted (persist now)
      localStorage.setItem('site_user_rating', String(rating));
      setUserHasVoted(true);

      // increment the count if this is considered positive feedback
      if (rating >= 4) setCount((c) => c + 1);

      setThanks(t('landing.satisfactionThanks'));
      // hide comment textarea after submit so users can't type again
      setShowComment(false);
      setComment('');
      setTimeout(() => setThanks(''), 4000);
    } catch (err) {
      console.error('Failed to save rating', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {[1,2,3,4,5].map((v) => (
            <button
              key={v}
              onClick={() => handleSelect(v)}
              disabled={userHasVoted || Boolean(localStorage.getItem('site_user_rating'))}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${rating >= v ? 'bg-primary-500 text-white shadow-lg' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600'} ${userHasVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label={`${v} ${t('landing.satisfactionAria')}`}
            >
              {emojis[v-1]}
            </button>
          ))}
        </div>

        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {t('landing.satisfactionSubtitle')}
          <div className="text-lg font-semibold mt-1">{Math.max(count, initialCount)} {t('landing.statsUsers')}</div>
        </div>
      </div>

      {showComment && (
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('landing.satisfactionCommentPlaceholder')}
            className="input w-full"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || userHasVoted || Boolean(localStorage.getItem('site_user_rating'))}
              className="btn-primary"
            >
              {submitting ? t('common.loading') : t('landing.satisfactionSubmit')}
            </button>
            <button
              onClick={() => { setShowComment(false); setComment(''); }}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {thanks && (
        <div className="mt-4 text-success-800 bg-success-100 border-2 border-success-500 px-4 py-2 rounded">
          {thanks}
        </div>
      )}
      {userHasVoted && (
        <div className="mt-3 text-xs text-neutral-600">{t('landing.satisfactionThanks')}</div>
      )}
    </div>
  );
}

export default SatisfactionWidget;
