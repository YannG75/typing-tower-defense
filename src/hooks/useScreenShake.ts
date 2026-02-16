import { useEffect, useState } from 'react';

interface UseScreenShakeOptions {
    duration?: number;
    intensity?: number;
}

/**
 * Hook to trigger screen shake effect
 * Returns a trigger function and current shake offset
 */
export const useScreenShake = ({ duration = 500, intensity = 10 }: UseScreenShakeOptions = {}) => {
    const [isShaking, setIsShaking] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!isShaking) return;

        const startTime = Date.now();
        let animationFrame: number;

        const shake = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                setOffset({ x: 0, y: 0 });
                setIsShaking(false);
                return;
            }

            // Decay intensity over time
            const currentIntensity = intensity * (1 - progress);

            // Random offset
            const x = (Math.random() - 0.5) * currentIntensity;
            const y = (Math.random() - 0.5) * currentIntensity;

            setOffset({ x, y });
            animationFrame = requestAnimationFrame(shake);
        };

        animationFrame = requestAnimationFrame(shake);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isShaking, duration, intensity]);

    const trigger = () => {
        setIsShaking(true);
    };

    return { trigger, offset, isShaking };
};
