import { motion } from 'framer-motion';
import { useState } from 'react';
import * as React from "react";

interface ParticlesProps {
    x: number;
    y: number;
    color: string;
}

interface Particle {
    id: number;
    angle: number;
    distance: number;
}

export const Particles: React.FC<ParticlesProps> = ({ x, y, color }) => {
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            angle: (i * 360) / 8, // Répartition circulaire
            distance: 100 + Math.random() * 30, // Distance aléatoire
        }))
    );

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 20,
            }}
        >
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                    }}
                    animate={{
                        x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                        y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        backgroundColor: color,
                        borderRadius: '50%',
                        boxShadow: `0 0 10px ${color}`,
                    }}
                />
            ))}
        </div>
    );
};