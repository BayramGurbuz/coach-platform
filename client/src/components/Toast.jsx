import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000, onUndo, undoText = 'Geri Al' }) {
  useEffect(() => {
    if (message && !onUndo) {
      // Sadece undo yoksa otomatik kapat
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose, onUndo]);

  if (!message) return null;

  const styles = {
    success: 'bg-success-100 border-success-500 text-success-800',
    error: 'bg-danger-100 border-danger-500 text-danger-800',
    info: 'bg-primary-100 border-primary-500 text-primary-800',
  };

  const icons = {
    success: (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 ${styles[type]} border-2 px-6 py-4 rounded-lg shadow-lg max-w-md animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        {icons[type]}
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
        </div>
        
        {/* Undo butonu varsa göster */}
        {onUndo && (
          <button
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="ml-2 px-3 py-1 bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 font-semibold rounded hover:bg-primary-50 dark:hover:bg-neutral-600 transition-colors"
            aria-label={undoText}
          >
            ↶ {undoText}
          </button>
        )}
        
        <button
          onClick={onClose}
          className="ml-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          aria-label="Bildirimi kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar - Kapanış hissi için (undo yoksa) */}
      {!onUndo && (
        <div className="mt-2 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-success-500' : 
              type === 'error' ? 'bg-danger-500' : 
              'bg-primary-500'
            }`}
            style={{
              animation: `progress ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Toast;

