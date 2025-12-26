import {type AnyResolvedKeyframe, motion} from 'framer-motion';
import type {LetterData} from '../types/game.types';
import {getSpawnPosition} from "../utils/spawnHelpers";
import * as React from "react";
import {useState} from "react";

interface LetterProps {
    letter: LetterData;
    onReachBase: (id: string) => void;
    isDestroyed?: boolean;
    isPaused?: boolean;
}

interface LetterPosition {
    x: AnyResolvedKeyframe;
    y: AnyResolvedKeyframe;
}

const LETTER_COLORS = ['#ffd93d', '#6bcf7f', '#4ecdc4', '#a084dc', '#f06292', '#ff6b6b'];

const getRandomColor = () => {
    return LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)];
}

const getScale = () => {
    return (Math.random() + 0.5) * 3;
}

export const Letter: React.FC<LetterProps> = ({letter, onReachBase, isDestroyed = false, isPaused = false}) => {
    const positions = getSpawnPosition(letter.direction)
    const [ letterPositions, setLetterPositions ] =useState<LetterPosition>({x:positions.animate.x, y:positions.animate.y})
    const color = getRandomColor();
    const scale = getScale();
    return (
        <motion.div
            data-letter-id={letter.id}
            initial={{y: positions.initial.y, x: positions.initial.x, opacity: 1, scale: scale}}
            animate={ isPaused ? {
                y: letterPositions.y,
                x: letterPositions.x,
                opacity: isDestroyed ? 0 : 1,
                scale: isDestroyed ? 3 : scale,
                rotate: isDestroyed ? 270 : 0
            } : {
                y: isDestroyed ? letterPositions.y : positions.animate.y,
                x: isDestroyed ? letterPositions.x : positions.animate.x,
                opacity: isDestroyed ? 0 : 1,
                scale: isDestroyed ? 3 : scale,
                rotate: isDestroyed ? 270 : 0
            }}
            exit={{opacity: 0, scale: 0}}
            transition={{
                duration: isDestroyed ? 0.4 : letter.speed,
                ease: isDestroyed ? 'easeOut' : 'linear',
            }}
            onUpdate={(e) => {
                setLetterPositions({x: e.x, y: e.y});
            }}
            onAnimationComplete={() => {
                if (!isDestroyed && !isPaused) {
                    onReachBase(letter.id)
                }
            }}
            style={{
                position: 'absolute',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: color,
                textShadow: `3px 3px 0px rgba(0,0,0,0.8), 0 0 20px ${color}`,
                userSelect: 'none',
            }}
        >
            {letter.character}
        </motion.div>
    );
};