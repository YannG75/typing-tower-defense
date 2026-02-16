/**
 * Game configuration constants
 * Central location for all game balance and configuration values
 */

export const GAME_CONFIG = {
  // Available letters for gameplay
  AVAILABLE_LETTERS: ['Z', 'Q', 'S', 'D'] as const,

  // Player stats
  INITIAL_LIVES: 3,
  POINTS_PER_LETTER: 10,
  POINTS_PER_LEVEL: 50,

  // Difficulty scaling
  INITIAL_SPEED: 5, // seconds for letter to reach base
  MIN_SPEED: 2,
  SPEED_DECREASE_PER_LEVEL: 0.3,

  INITIAL_SPAWN_INTERVAL: 2000, // milliseconds
  MIN_SPAWN_INTERVAL: 500,
  SPAWN_DECREASE_PER_LEVEL: 200,

  // UI/Device detection
  TABLET_BREAKPOINT: 1024, // pixels

  // Animation timings
  LETTER_DESTRUCTION_DURATION: 300, // milliseconds
  PARTICLE_DURATION: 500, // milliseconds

  // Audio
  MUSIC_VOLUME_FACTOR: 0.2,
  SFX_VOLUME_FACTOR: 0.3,
} as const;

export const LETTER_COLORS = [
  '#ffd93d',
  '#6bcf7f',
  '#4ecdc4',
  '#a084dc',
  '#f06292',
  '#ff6b6b',
] as const;

// Type helpers
export type AvailableLetter = typeof GAME_CONFIG.AVAILABLE_LETTERS[number];
export type LetterColor = typeof LETTER_COLORS[number];
