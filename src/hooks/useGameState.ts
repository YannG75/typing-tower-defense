import { useCallback, useEffect, useState } from 'react';
import type { LetterData, Particle } from '../types/game.types';
import { GAME_CONFIG } from '../constants/game';
import { calculateLetterSpeed, calculateSpawnInterval, calculateLevel } from '../utils/difficulty';
import { getRandomDirection } from '../utils/spawnHelpers';
import { useGameLoop } from './useGameLoop';
import { useLocalStorage } from './useLocalStorage';

interface UseGameStateOptions {
    onLifeLost?: () => void;
    onLetterDestroyed?: () => void;
    onGameOver?: () => void;
    onGameHide?: () => void;
    onGameVisible?: () => void;
}

/**
 * Custom hook that manages all game state and logic
 * Separates game mechanics from UI concerns
 */
export const useGameState = ({ onLifeLost, onLetterDestroyed, onGameOver, onGameHide, onGameVisible }: UseGameStateOptions = {}) => {
    // Game flow state
    const [gameStarted, setGameStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    // Game stats
    const [score, setScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(GAME_CONFIG.INITIAL_LIVES);
    const [level, setLevel] = useState<number>(1);
    const [highScore, setHighScore] = useLocalStorage('high-score', 0);

    // Game entities
    const [letters, setLetters] = useState<LetterData[]>([]);
    const [destroyedLetters, setDestroyedLetters] = useState<string[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Handle tab visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            if (gameStarted) {
                // Pause/resume music based on visibility
                if (!isVisible) {
                    pauseGame()
                    onGameHide?.();
                }
                else {
                    onGameVisible?.();
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [gameStarted]);

    // Spawn a new letter
    const spawnLetter = useCallback(() => {
        const newLetter: LetterData = {
            id: Date.now().toString() + Math.random(),
            character: GAME_CONFIG.AVAILABLE_LETTERS[Math.floor(Math.random() * GAME_CONFIG.AVAILABLE_LETTERS.length)],
            x: Math.random() * (window.innerWidth - 100),
            y: '-55vh',
            speed: calculateLetterSpeed(level),
            direction: getRandomDirection()
        };

        setLetters((prev) => [...prev, newLetter]);
    }, [level]);

    // Handle letter destruction by keyboard input
    const destroyLetter = useCallback((key: string) => {
        if (isPaused) return;

        const matchingLetter = letters.find(
            (letter) => letter.character === key && !destroyedLetters.includes(letter.id)
        );

        if (matchingLetter) {
            onLetterDestroyed?.();

            const letterElement = document.querySelector(`[data-letter-id="${matchingLetter.id}"]`);
            if (letterElement) {
                const rect = letterElement.getBoundingClientRect();
                const color = window.getComputedStyle(letterElement).color;

                // Add particle effect
                setParticles((prev) => [...prev, {
                    id: matchingLetter.id,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    color: color,
                }]);

                // Remove particles after animation
                setTimeout(() => {
                    setParticles((prev) => prev.filter((p) => p.id !== matchingLetter.id));
                }, GAME_CONFIG.PARTICLE_DURATION);
            }

            // Mark letter as destroyed
            setDestroyedLetters((prev) => [...prev, matchingLetter.id]);

            // Increase score
            setScore((prev) => prev + GAME_CONFIG.POINTS_PER_LETTER);

            // Remove letter after animation
            setTimeout(() => {
                setLetters((prev) => prev.filter((l) => l.id !== matchingLetter.id));
                setDestroyedLetters((prev) => prev.filter((id) => id !== matchingLetter.id));
            }, GAME_CONFIG.LETTER_DESTRUCTION_DURATION);
        }
    }, [letters, destroyedLetters, isPaused, onLetterDestroyed]);

    // Handle letter reaching the base
    const handleLetterReachBase = useCallback((id: string) => {
        const newLives = lives - 1;
        setLives(newLives);
        onLifeLost?.();
        setLetters((prev) => prev.filter((letter) => letter.id !== id));

        // Check for game over
        if (newLives <= 0) {
            setIsGameOver(true);
            onGameOver?.();
            setLetters([]);
        }
    }, [lives, onLifeLost, onGameOver]);

    // Game control actions
    const startGame = useCallback(() => {
        setGameStarted(true);
    }, []);

    const pauseGame = useCallback(() => {
        if (isGameOver || isPaused) return;
        setIsPaused(true);
    }, [isGameOver, isPaused]);

    const resumeGame = useCallback(() => {
        setIsPaused(false);
    }, []);

    const restartGame = useCallback(() => {
        setScore(0);
        setLives(GAME_CONFIG.INITIAL_LIVES);
        setLevel(1);
        setLetters([]);
        setDestroyedLetters([]);
        setIsGameOver(false);
        if (isPaused) {
            setIsPaused(false);
        }
    }, [isPaused]);

    const quitToMenu = useCallback(() => {
        setGameStarted(false);
        setIsPaused(false);
        restartGame();
    }, [restartGame]);

    // Level progression based on score
    useEffect(() => {
        const newLevel = calculateLevel(score);
        if (newLevel !== level) {
            setLevel(newLevel);
            console.log(`🎉 Level UP! Now level ${newLevel}, speed is ${calculateLetterSpeed(newLevel)}, interval is ${calculateSpawnInterval(newLevel)}`);
        }
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score, level, highScore, setHighScore]);

    // Game loop - spawn letters at intervals
    useGameLoop({
        onTick: spawnLetter,
        interval: calculateSpawnInterval(level),
        isActive: !isGameOver && gameStarted && !isPaused
    });

    return {
        // State
        gameStarted,
        isPaused,
        isGameOver,
        score,
        lives,
        level,
        highScore,
        letters,
        destroyedLetters,
        particles,

        // Actions
        startGame,
        pauseGame,
        resumeGame,
        restartGame,
        quitToMenu,
        destroyLetter,
        handleLetterReachBase,
    };
};
