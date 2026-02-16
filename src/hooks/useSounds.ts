import { useEffect, useRef, useState } from 'react';

const MUSIC_VOLUME_FACTOR = 0.2;
const SFX_VOLUME_FACTOR = 0.3;

export const useSounds = (musicVolume: number = 1, sfxVolume: number = 1) => {
    const audioContext = useRef<AudioContext | null>(null);
    const [isTabVisible, setIsTabVisible] = useState(true);

    // Audio buffers for Web Audio API (better mobile performance)
    const audioBuffers = useRef<{
        explosion: AudioBuffer | null;
        hit: AudioBuffer | null;
        gameOver: AudioBuffer | null;
    }>({
        explosion: null,
        hit: null,
        gameOver: null,
    });

    // HTML Audio for music loop (easier looping)
    const gameLoopSound = useRef<HTMLAudioElement | null>(null);
    const musicGainNode = useRef<GainNode | null>(null);
    const sfxGainNode = useRef<GainNode | null>(null);

    // Handle tab visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            setIsTabVisible(isVisible);

            // Pause/resume music based on visibility
            if (gameLoopSound.current) {
                if (isVisible) {
                    gameLoopSound.current.play().catch(() => {});
                } else {
                    gameLoopSound.current.pause();
                }
            }

            // Suspend/resume audio context on mobile to save resources
            if (audioContext.current) {
                if (isVisible) {
                    audioContext.current.resume().catch(() => {});
                } else {
                    audioContext.current.suspend().catch(() => {});
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Initialize audio context and load sounds
    useEffect(() => {
        // Create audio context for SFX (Web Audio API for better mobile performance)
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContext.current = ctx;

        // Create gain nodes for volume control
        const musicGain = ctx.createGain();
        const sfxGain = ctx.createGain();
        musicGain.connect(ctx.destination);
        sfxGain.connect(ctx.destination);
        musicGainNode.current = musicGain;
        sfxGainNode.current = sfxGain;

        // Load and decode audio buffers for SFX
        const loadSound = async (url: string): Promise<AudioBuffer | null> => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                return await ctx.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error(`Failed to load sound: ${url}`, error);
                return null;
            }
        };

        // Load all SFX
        Promise.all([
            loadSound('/sounds/boom.wav'),
            loadSound('/sounds/hit.wav'),
            loadSound('/sounds/gameOver.wav'),
        ]).then(([explosion, hit, gameOver]) => {
            audioBuffers.current = { explosion, hit, gameOver };
        });

        // Setup music loop with HTML Audio
        const gameLoop = new Audio('/sounds/gameLoop.mp3');
        gameLoop.loop = true;
        gameLoopSound.current = gameLoop;

        return () => {
            // Cleanup
            ctx.close();
            if (gameLoop) {
                gameLoop.pause();
                gameLoop.src = "";
            }
        };
    }, []);

    // Update volumes when changed
    useEffect(() => {
        if (musicGainNode.current) {
            musicGainNode.current.gain.value = musicVolume * MUSIC_VOLUME_FACTOR;
        }

        if (sfxGainNode.current) {
            sfxGainNode.current.gain.value = sfxVolume * SFX_VOLUME_FACTOR;
        }

        if (gameLoopSound.current) {
            gameLoopSound.current.volume = musicVolume * MUSIC_VOLUME_FACTOR;
        }
    }, [musicVolume, sfxVolume]);

    // Play sound using Web Audio API (fast on mobile)
    const playSound = (buffer: AudioBuffer | null) => {
        if (!buffer || !audioContext.current || !sfxGainNode.current || !isTabVisible) return;

        const source = audioContext.current.createBufferSource();
        source.buffer = buffer;
        source.connect(sfxGainNode.current);
        source.start(0);
    };

    const playExplosion = () => {
        playSound(audioBuffers.current.explosion);
    };

    const playHit = () => {
        playSound(audioBuffers.current.hit);
    };

    const playGameOver = () => {
        playSound(audioBuffers.current.gameOver);
    };

    const playGameLoop = () => {
        if (gameLoopSound.current && isTabVisible) {
            gameLoopSound.current.currentTime = 0;
            gameLoopSound.current.play().catch(() => {});
        }
    };

    return { playExplosion, playHit, playGameOver, playGameLoop };
};