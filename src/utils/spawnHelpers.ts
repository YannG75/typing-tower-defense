import type {Direction} from '../types/game.types';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export const getSpawnPosition = (direction: Direction) => {

    switch (direction) {
        case 'top':
            return {
                initial: {
                    x: Math.random() * SCREEN_WIDTH,
                    y: '-55vh',
                },
                animate: {
                    x: 0,
                    y: 0,
                }
            };
        case 'bottom':
            return {
                initial: {
                    x: Math.random() * SCREEN_WIDTH,
                    y: '55vh',
                },
                animate: {
                    x: 0,
                    y: 0,
                }
            }
        case 'left':
            return {
                initial: {
                    x: '-55vw',
                    y: Math.random() * SCREEN_HEIGHT,
                },
                animate: {
                    x: 0,
                    y: 0,
                }
            }
        case 'right':
            return {
                initial: {
                    x: '55vw',
                    y: Math.random() * SCREEN_HEIGHT,
                },
                animate: {
                    x: 0,
                    y: 0,
                }
            };
    }
}

export const getRandomDirection = (): Direction => {
    const directions : Direction[] = ['top', 'bottom', 'left', 'right'];
    return directions[Math.floor(Math.random() * directions.length)];
}