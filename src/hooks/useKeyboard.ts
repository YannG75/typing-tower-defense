import { useEffect } from 'react';

export const useKeyboard = (onKeyPress: (key: string) => void) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignorer les touches spéciales (Shift, Ctrl, etc.)
            if (event.key.length === 1) {
                onKeyPress(event.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup : retirer l'event listener quand le composant unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onKeyPress]);
};