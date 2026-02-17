import {motion} from 'framer-motion';
import {useEffect} from 'react';
import * as React from "react";

interface StartMenuProps {
    onStart: () => void;
    isMobile: boolean;
}

export const StartMenu: React.FC<StartMenuProps> = ({onStart, isMobile}) => {
    // Démarrer le jeu sur n'importe quelle touche
    useEffect(() => {
        const handleKeyPressOrTap = () => {
            onStart();
        };
        window.addEventListener('keydown', handleKeyPressOrTap);
        window.addEventListener('touchstart', handleKeyPressOrTap);
        return () => {
            window.removeEventListener('keydown', handleKeyPressOrTap);
            window.removeEventListener('touchstart', handleKeyPressOrTap);
        }
    }, [onStart]);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#0a0a0a',
                zIndex: 200,
            }}
        >
            {/* Titre principal */}
            <motion.h1
                initial={{y: -50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.3, duration: 0.8}}
                style={{
                    fontSize: '3rem',
                    color: '#ffd93d',
                    textShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                }}
            >
                TYPING
                <br/>
                TOWER
                <br/>
                DEFENSE
            </motion.h1>

            {/* Sous-titre clignotant */}
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    delay: 1,
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    fontSize: '1rem',
                    color: '#6bcf7f',
                    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
                    textAlign: 'center',
                }}
            >
                {isMobile ? 'TAP SCREEN' : 'PRESS ANY KEY'} TO START
            </motion.div>

            {/* Instructions */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 1.5}}
                style={{
                    position: 'absolute',
                    bottom: isMobile ? '100px' : '50px',
                    fontSize: '0.7rem',
                    color: '#ffffff',
                    textAlign: 'center',
                    opacity: 0.6,
                    lineHeight: 1.5
                }}
            >
                 {isMobile ? 'TAP KEY' : 'USE KEYBOARD'} TO DESTROY LETTERS (ZQSD)
                <br/>
                PRESS ESC TO PAUSE
                <br/>
                PROTECT YOUR BASE
            </motion.div>
        </motion.div>
    );
};