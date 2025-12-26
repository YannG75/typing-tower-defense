import {motion} from 'framer-motion';
import * as React from "react";
import {useEffect, useState} from "react";

interface BaseProps {
    lives: number;
}

export const Base: React.FC<BaseProps> = ({lives}) => {
    const [isShaking, setIsShaking] = useState(false);
    const [previousLives, setPreviousLives] = useState(lives);

    // Déclencher le shake quand les vies diminuent
    useEffect(() => {
        if (lives < previousLives) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
        }
        setPreviousLives(lives);
    }, [lives, previousLives]);


    return (
        <motion.div
            animate={isShaking ? {
                x: ['-50%', '-58%','-42%', '-58%', '-42%', '-54%', '-46%', '-50%'], // Shake horizontal
                y: '-50%',
                transition: { duration: 0.4 }
            } : {
                x: '-50%', // ← Centre horizontal
                y: '-50%', // ← Centre vertical
            }}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                zIndex: 10,
            }}
        >
            {/* Base principale */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: isShaking
                        ? 'linear-gradient(135deg, #ff3333 0%, #dd4444 100%)' // Rouge plus vif quand hit
                        : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
                    border: '4px solid #ffffff',
                    boxShadow: isShaking
                        ? `
                            0 0 40px rgba(255, 51, 51, 1),
                            inset 0 0 30px rgba(255, 255, 255, 0.3),
                            0 0 60px rgba(255, 51, 51, 0.6)
                        `
                        : `
                            0 0 20px rgba(255, 107, 107, 0.8),
                            inset 0 0 20px rgba(255, 255, 255, 0.2),
                            0 0 40px rgba(255, 107, 107, 0.4)
                        `,
                    backgroundSize: '8px 8px',
                    imageRendering: 'pixelated',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Bordure néon animée */}
                <motion.div
                    animate={{
                        opacity: isShaking ? [1, 0.3, 1, 0.3, 1] : [0.2, 1, 0.2],
                    }}
                    transition={{
                        duration: isShaking ? 0.4 : 1.5,
                        repeat: isShaking ? 0 : Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        inset: '-4px',
                        border: isShaking ? '3px solid #ff3333' : '2px solid #ffd93d',
                        boxShadow: isShaking ? '0 0 25px #ff3333' : '0 0 15px #ffd93d',
                        pointerEvents: 'none',
                    }}
                />

                {/* Coeurs */}
                <div style={{display: 'flex', gap: '6px', fontSize: '1.8rem'}}>
                    {Array.from({length: 3}).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={i < lives ? {scale: [1, 1.2, 1]} : {}}
                            transition={{duration: 0.5, repeat: Infinity, delay: i * 0.15}}
                            style={{
                                opacity: i < lives ? 1 : 0.15,
                                filter: i < lives ? 'none' : 'grayscale(1)',
                                textShadow: i < lives ? '0 0 10px #ff6b6b' : 'none',
                            }}
                        >
                            ♥
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};