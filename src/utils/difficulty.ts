import { GAME_CONFIG } from '../constants/game';

/**
 * Calculate letter speed based on current level
 * Speed decreases as level increases (letters move faster)
 *
 * @param level - Current game level
 * @returns Duration in seconds for letter to reach base
 */
export const calculateLetterSpeed = (level: number): number => {
    return Math.max(
        GAME_CONFIG.MIN_SPEED,
        GAME_CONFIG.INITIAL_SPEED - (level - 1) * GAME_CONFIG.SPEED_DECREASE_PER_LEVEL
    );
};

/**
 * Calculate spawn interval based on current level
 * Interval decreases as level increases (letters spawn more frequently)
 *
 * @param level - Current game level
 * @returns Interval in milliseconds between letter spawns
 */
export const calculateSpawnInterval = (level: number): number => {
    return Math.max(
        GAME_CONFIG.MIN_SPAWN_INTERVAL,
        GAME_CONFIG.INITIAL_SPAWN_INTERVAL - (level - 1) * GAME_CONFIG.SPAWN_DECREASE_PER_LEVEL
    );
};

/**
 * Calculate level based on current score
 *
 * @param score - Current player score
 * @returns Current level (starts at 1)
 */
export const calculateLevel = (score: number): number => {
    return Math.floor(score / GAME_CONFIG.POINTS_PER_LEVEL) + 1;
};
