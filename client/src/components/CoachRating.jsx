import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const stars = ['★','★','★','★','★'];

function CoachRating({ coachId }) {
  const { t } = useLanguage();
  const storageKey = `coach_ratings_${coachId}`;
  // Keep the current rating selection only for the active session.
  // If the user already voted (persisted marker exists) we want the textarea closed
  // on subsequent visits, so initialize `rating` to 0 by default.
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
      return [];
    }
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userHasVoted, setUserHasVoted] = useState(() => Boolean(localStorage.getItem(`coach_user_rating_${coachId}`)));
  const average = ratings.length ? (ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length) : 0;

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ratings));
  }, [ratings]);

  const handleSelect = (v) => {
    // Double-check localStorage in case state is out-of-sync
    if (userHasVoted || localStorage.getItem(`coach_user_rating_${coachId}`)) return;
    setRating((prev) => (prev === v ? 0 : v));
  };

  const handleSubmit = () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      // persist vote marker immediately to prevent any further interaction
      localStorage.setItem(`coach_user_rating_${coachId}`, String(rating));
      setUserHasVoted(true);
      const newRatings = [...ratings, { rating, comment: comment || '', date: new Date().toISOString() }];
      setRatings(newRatings);
      // clear comment and hide the comment box by resetting rating
      setComment('');
      // Reset rating so textarea (which is shown when rating>0) closes
      setRating(0);
      // brief thank you state could be handled here
      setTimeout(() => setSubmitting(false), 600);
    } catch (err) {
      console.error('Failed to save coach rating', err);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">{t('coachProfile.rateCoachTitle')}</div>
        <div className="text-2xl font-bold text-primary-600 mt-2">{average ? average.toFixed(1) : '—'} / 5</div>
        <div className="text-xs text-neutral-500">{ratings.length} {t('coachProfile.rateCount')}</div>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        {[1,2,3,4,5].map((v) => {
          const filled = hoverRating ? v <= hoverRating : v <= rating;
          return (
            <button
              key={v}
              onClick={() => handleSelect(v)}
              onMouseEnter={() => setHoverRating(v)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={userHasVoted || Boolean(localStorage.getItem(`coach_user_rating_${coachId}`))}
              title={userHasVoted ? t('coachProfile.rateSubmit') + ' (already voted)' : ''}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${filled ? 'bg-primary-500 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600'} ${userHasVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label={`${v} ${t('coachProfile.rateYourRatingAria')}`}
            >
              {stars[v-1]}
            </button>
          );
        })}
      </div>

      {rating > 0 && (
        <div className="mb-3">
          <textarea
            className="input w-full"
            rows={2}
            placeholder={t('coachProfile.rateCommentPlaceholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSubmit} disabled={submitting || userHasVoted} className="btn-primary flex-1">
              {submitting ? t('common.loading') : (userHasVoted ? t('common.confirm') : t('coachProfile.rateSubmit'))}
            </button>
            <button onClick={() => { setRating(0); setComment(''); }} className="btn-secondary">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachRating;
