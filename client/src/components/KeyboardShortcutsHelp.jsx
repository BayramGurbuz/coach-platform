import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function KeyboardShortcutsHelp({ isOpen: externalIsOpen, onClose: externalOnClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { t } = useLanguage();
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined 
    ? (value) => {
        if (!value) externalOnClose();
        else setInternalIsOpen(value);
      }
    : setInternalIsOpen;

  // Escape tuşu ile kapat
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const shortcuts = [
    { key: '?', description: t('shortcuts.showShortcuts') },
    { key: 'H', description: t('shortcuts.goHome') },
    { key: 'S', description: t('shortcuts.goSettings') },
    { key: 'D', description: t('shortcuts.toggleDark') },
    { key: 'Escape', description: t('shortcuts.closeModal') },
    { key: 'Tab', description: t('shortcuts.nextElement') },
    { key: 'Shift + Tab', description: t('shortcuts.prevElement') },
    { key: 'Enter', description: t('shortcuts.submit') },
  ];

  return (
    <>
      {/* Help Button - Fixed bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-110 z-40"
        aria-label="Klavye kısayolları yardımı"
        title="Klavye kısayolları (? tuşu)"
      >
        <span className="text-2xl font-bold">?</span>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 id="shortcuts-title" className="text-2xl font-bold text-neutral-900 dark:text-white">
                {t('shortcuts.title')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                aria-label="Kapat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-neutral-600 dark:text-white mb-6">
              {t('shortcuts.helper')}
              <br />
              <span className="text-sm italic">
                {t('shortcuts.hint')}
              </span>
            </p>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                >
                  <span className="text-neutral-700 dark:text-white font-medium">
                    {shortcut.description}
                  </span>
                  <kbd className="kbd">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border-2 border-primary-200 dark:border-primary-700">
              <p className="text-sm text-neutral-700 dark:text-white">
              💡 <strong>Tip:</strong> {t('shortcuts.tip')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KeyboardShortcutsHelp;

