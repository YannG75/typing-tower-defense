import { useEffect, useRef } from 'react';
import * as React from "react";
export const useSounds = (musicVolume: number = 1, sfxVolume: number = 1) => {
    const explosionSound = useRef<HTMLAudioElement | null>(null);
    const hitSound = useRef<HTMLAudioElement | null>(null);
    const gameOverSound = useRef<HTMLAudioElement | null>(null);
    const gameLoopSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Précharger les sons
        const explosion = new Audio('/sounds/boom.wav');
        const hit = new Audio('/sounds/hit.wav');
        const gameOver = new Audio('/sounds/gameOver.wav');
        const gameLoop = new Audio('/sounds/gameLoop.mp3');

        gameLoop.loop = true;

        explosionSound.current = explosion;
        hitSound.current = hit;
        gameOverSound.current = gameOver;
        gameLoopSound.current = gameLoop;

        return () => {
            [explosion, hit, gameOver, gameLoop].forEach(sound => {
                sound.pause();
                sound.src = "";
            });
        };
    }, []);

    useEffect(() => {
        const MUSIC_VOLUME_FACTOR = 0.2;
        const SFX_VOLUME_FACTOR = 0.3;
        //
        const updateVolume = (ref: React.RefObject<HTMLAudioElement | null>, volume: number) => {
            if (ref.current) {
                ref.current.volume = volume;
            }
        };

        // Musique
        if (gameLoopSound.current) {
            gameLoopSound.current.volume = musicVolume * MUSIC_VOLUME_FACTOR;
            gameLoopSound.current.pause();
            gameLoopSound.current.play().catch(() => {
            });
        }

        // SFX
        const sfxVolumeLevel = sfxVolume * SFX_VOLUME_FACTOR;
        [explosionSound, hitSound, gameOverSound].forEach(soundRef =>
            updateVolume(soundRef, sfxVolumeLevel)
        );
    }, [musicVolume, sfxVolume]);

    const playExplosion = () => {
        if (explosionSound.current) {
            explosionSound.current.currentTime = 0;
            explosionSound.current.play().catch(() => {});
        }
    };

    const playHit = () => {
        if (hitSound.current) {
            hitSound.current.currentTime = 0;
            hitSound.current.play().catch(() => {});
        }
    };

    const playGameOver = () => {
        if (gameOverSound.current) {
            gameOverSound.current.currentTime = 0;
            gameOverSound.current.play().catch(() => {});
        }
    };

    const playGameLoop = () => {
        if (gameLoopSound.current) {
            gameLoopSound.current.currentTime = 0;
            gameLoopSound.current.play().catch(() => {});
        }
    }

    return { playExplosion, playHit, playGameOver, playGameLoop };
};