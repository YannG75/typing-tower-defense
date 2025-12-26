import { motion } from 'framer-motion';
import * as React from "react";

interface GameOverProps {
    score: number;
    highScore: number;
    onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
    const isNewHighScore = score >= highScore;
    return (
        <motion.div
            initial={{ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)'}}
            animate={{ opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(10, 10, 10, 0.95)',
                padding: '3rem',
                border: '4px solid #ff6b6b',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(255, 107, 107, 0.6), inset 0 0 40px rgba(255, 107, 107, 0.1)',
                zIndex: 100,
                minWidth: '400px',
            }}
        >
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: '#ff6b6b',
                    textShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
                }}
            >
                GAME OVER
            </motion.h1>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                style={{
                    fontSize: '2rem',
                    margin: '2rem 0',
                    color: '#ffd93d',
                    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
                }}
            >
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>SCORE</div>
                <div style={{ fontSize: '2rem' }}>{score.toString().padStart(6, '0')}</div>
            </motion.div>

            {isNewHighScore && (
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        delay: 0.6,
                        scale: { repeat: Infinity, duration: 0.8 },
                        rotate: { duration: 0.5 }
                    }}
                    style={{
                        fontSize: '1rem',
                        color: '#6bcf7f',
                        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
                        marginBottom: '1rem',
                    }}
                >
                    ★ NEW HIGH SCORE ★
                </motion.div>
            )}

            {!isNewHighScore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        fontSize: '0.7rem',
                        color: '#ffffff',
                        marginBottom: '1rem',
                    }}
                >
                    HIGH SCORE: {highScore.toString().padStart(6, '0')}
                </motion.div>
            )}

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 , transition: { delay: 0.6 }}}
                whileHover={{ scale: 1.1, transition: { duration: 0.150}}}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                style={{
                    padding: '1rem 3rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    background: 'transparent',
                    border: '4px solid #ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 0px rgba(0, 0, 0, 0.8), 0 0 20px rgba(197,107,207,0.6)',
                    transition: 'all 0.150s ease',
                    letterSpacing: '1px',
                }}
            >
                RETRY
            </motion.button>
        </motion.div>
    );
};