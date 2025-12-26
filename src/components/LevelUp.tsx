import { motion } from 'framer-motion';
export const LevelUp = () => {
    return (
        <motion.div
            initial={{ transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }}
            animate={{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#700bfc',
                textShadow: '0 0 30px rgba(78, 205, 196, 0.8)',
                zIndex: 50,
                pointerEvents: 'none',
            }}
        >
            🎉 LEVEL UP 🎉
        </motion.div>
    );
};