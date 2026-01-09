import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard shortcuts.
 * @param {Object} shortcuts - Mapping of key combos to callback functions.
 * Example: { 'k': () => focusSearch(), 'n': () => openModal() }
 * Note: 'k' will be treated as Cmd+K or Ctrl+K.
 */
export const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const isMod = event.metaKey || event.ctrlKey;
            const isAlt = event.altKey;

            // Cmd+K or Ctrl+K
            if (isMod && event.key.toLowerCase() === 'k') {
                if (shortcuts['k']) {
                    event.preventDefault();
                    shortcuts['k']();
                }
            }

            // Alt+N (New Contact)
            if (isAlt && event.key.toLowerCase() === 'n') {
                if (shortcuts['n']) {
                    event.preventDefault();
                    shortcuts['n']();
                }
            }

            // Escape
            if (event.key === 'Escape') {
                if (shortcuts['escape']) {
                    event.preventDefault();
                    shortcuts['escape']();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
