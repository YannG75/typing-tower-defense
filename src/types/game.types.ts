
export type Direction = 'top' | 'bottom' | 'left' | 'right';

export interface LetterData {
    id: string;
    character: string;
    x: number;
    y: number|string;
    speed: number;
    direction: Direction;
}

export interface Particle {
    id: string;
    x: number;
    y: number;
    color: string;
}

export interface GameState {
    score: number;
    lives: number;
    level: number;
    isGameOver: boolean;
    letters: LetterData[];
}