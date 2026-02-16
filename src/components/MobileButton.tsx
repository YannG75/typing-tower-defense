import { motion } from 'framer-motion';
import { useState } from 'react';
import * as React from "react";
import { LuPause } from "react-icons/lu";

interface MobileButtonProps {
    letter: string;
    onTap?: (key: string) => void;
    handlePause?: () => void;
    isPauseButton?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({ letter, onTap, handlePause, isPauseButton = false }) => {
    const [isPressed, setIsPressed] = useState(false);

    // Dimensions adaptées selon le type de bouton
    const buttonSize = isPauseButton ? { width: '55px', height: '55px', padding: '8px' } : { width: '60px', height: '60px', padding: '20px 25px' };

    return (
        <motion.div
            animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
            onTouchStart={(e) => {
                setIsPressed(true);
                e.stopPropagation();
                if (onTap) {
                    onTap(letter);
                }
                if (handlePause) {
                    handlePause();
                }
            }}
            onTouchEnd={() => setIsPressed(false)}
            style={{
                border: '2px solid #ffd93d',
                boxShadow: isPressed ? '0 0 20px #ffd93d' : '0 0 10px #ffd93d',
                width: buttonSize.width,
                height: buttonSize.height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: isPressed ? 'rgba(255, 217, 61, 0.7)' : 'transparent',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.1s',
            }}
        >
            {isPauseButton ?
                (<LuPause style={{color: '#ffd93d',
                fontSize: isPauseButton ? '1.8rem' : '1.5rem',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',}} />)
                :
                (<p style={{
                fontSize: isPauseButton ? '1.8rem' : '1.5rem',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#ffd93d',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                margin: 0,
            }}>
                {letter}
            </p>)}
        </motion.div>
    );
};