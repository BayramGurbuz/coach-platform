import { useEffect } from 'react';

/**
 * Reusable Confirm Dialog Component
 * Shneiderman Kural 5: Hata Önleme (Slips önleme için)
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Evet', cancelText = 'İptal', type = 'danger' }) {
  useEffect(() => {
    if (isOpen) {
      // Escape ile kapat
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    danger: 'border-danger-500 bg-danger-50 dark:bg-danger-900/30',
    warning: 'border-warning-500 bg-warning-50 dark:bg-warning-900/30',
    info: 'border-primary-500 bg-primary-50 dark:bg-primary-900/30',
  };

  const iconColors = {
    danger: 'text-danger-500',
    warning: 'text-warning-500',
    info: 'text-primary-500',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 rounded-lg border-2 mb-4 ${typeStyles[type]}`}>
          <div className="flex items-start">
            <svg
              className={`w-8 h-8 mr-3 ${iconColors[type]}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {type === 'danger' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              )}
              {type === 'warning' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
              {type === 'info' && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <div>
              <h3 id="confirm-title" className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-neutral-700 dark:text-white">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={async () => {
              await onConfirm();
            }}
            className={`btn ${
              type === 'danger'
                ? 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700'
                : 'btn-primary'
            }`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
          <kbd className="kbd">Escape</kbd> ile kapatabilirsiniz
        </p>
      </div>
    </div>
  );
}

export default ConfirmDialog;

