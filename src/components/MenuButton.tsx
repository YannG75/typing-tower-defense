import {motion} from 'framer-motion';
import * as React from "react";

interface MenuButtonProps {
    onClick: () => void;
    delay?: number;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export const MenuButton: React.FC<MenuButtonProps> = ({onClick, delay = 0, children, variant = 'primary'}) => {
    const isPrimary = variant === 'primary';

    return (
        <motion.button
            initial={isPrimary ? {x: -50, opacity: 0} : {y: 20, opacity: 0}}
            animate={isPrimary ? {x: 0, opacity: 1, transition: {delay}} : {y: 0, opacity: 1, transition: {delay}}}
            whileHover={{scale: 1.1, transition: {duration: 0.15}}}
            whileTap={{scale: 0.95}}
            onClick={onClick}
            style={{
                padding: isPrimary ? '1rem 3rem' : '1rem 3rem',
                fontSize: isPrimary ? '1rem' : '1.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                background: isPrimary ? '#8b47ff' : 'transparent',
                border: '4px solid #ffffff',
                cursor: 'pointer',
                boxShadow: isPrimary
                    ? '0 4px 0px rgba(0, 0, 0, 0.8)'
                    : '0 4px 0px rgba(0, 0, 0, 0.8), 0 0 20px rgba(197,107,207,0.6)',
                fontFamily: 'inherit',
                letterSpacing: '1px',
                minWidth: isPrimary ? '250px' : undefined,
            }}
        >
            {children}
        </motion.button>
    );
};
