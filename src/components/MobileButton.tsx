import { motion } from 'framer-motion';
import { useState } from 'react';
import * as React from "react";

interface MobileButtonProps {
    letter: string;
    onTap: (key: string) => void;
}

export const MobileButton: React.FC<MobileButtonProps> = ({ letter, onTap }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <motion.div
            animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
            onTouchStart={(e) => {
                setIsPressed(true);
                e.stopPropagation();
                onTap(letter);
            }}
            onTouchEnd={() => setIsPressed(false)}
            style={{
                border: '2px solid #ffd93d',
                boxShadow: isPressed ? '0 0 20px #ffd93d' : '0 0 10px #ffd93d',
                padding: '20px 25px',
                minWidth: '60px',          // ← Ajoute ça
                minHeight: '60px',
                background: isPressed ? 'rgba(255, 217, 61, 0.7)' : 'transparent',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.1s',
            }}
        >
            <p style={{
                fontSize: '1.5rem',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#ffd93d',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                margin: 0,
            }}>
                {letter}
            </p>
        </motion.div>
    );
};