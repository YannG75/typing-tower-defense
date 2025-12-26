import { useEffect } from 'react';

interface UseGameLoopOptions {
    onTick: () => void;
    interval: number;
    isActive: boolean;
}

export const useGameLoop = ({ onTick, interval, isActive }: UseGameLoopOptions) => {
    useEffect(() => {
        if (!isActive) return;

        const gameLoop = setInterval(() => {
            onTick();
        }, interval);

        return () => clearInterval(gameLoop);
    }, [onTick, interval, isActive]);
};