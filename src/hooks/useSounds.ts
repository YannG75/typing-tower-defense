import {useEffect, useRef, useState} from 'react';
import {GAME_CONFIG} from '../constants/game';

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

    // Initialize audio context and load sounds
    useEffect(() => {
        // Create audio context for SFX (Web Audio API for better mobile performance)
        // Handle both standard and webkit-prefixed AudioContext
        const AudioContextClass = window.AudioContext ||
            (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
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
            audioBuffers.current = {explosion, hit, gameOver};
        });

        // Setup music loop with HTML Audio
        const gameLoop = new Audio('/sounds/gameLoop.mp3');
        gameLoop.loop = true;
        gameLoop.preload = 'auto';
        gameLoop.load();
        gameLoopSound.current = gameLoop;

        // Add a user interaction handler to unlock audio on mobile
        const unlockAudio = () => {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            // Play and immediately pause to unlock HTML Audio
            if (gameLoop.paused) {
                gameLoop.play().catch(() => {});
            }
        };

        // Listen for first user interaction to unlock audio
        const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, unlockAudio, {once: true});
        });

        return () => {
            // Cleanup event listeners
            events.forEach(event => {
                document.removeEventListener(event, unlockAudio);
            });
            // Cleanup audio
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
            musicGainNode.current.gain.value = musicVolume * GAME_CONFIG.MUSIC_VOLUME_FACTOR;
        }

        if (sfxGainNode.current) {
            sfxGainNode.current.gain.value = sfxVolume * GAME_CONFIG.SFX_VOLUME_FACTOR;
        }

        if (gameLoopSound.current) {
            gameLoopSound.current.volume = musicVolume * GAME_CONFIG.MUSIC_VOLUME_FACTOR;
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

    const pauseSounds = () => {
        setIsTabVisible(false);
        if (gameLoopSound.current) {
            gameLoopSound.current.pause();
        }
        if (audioContext.current) {
            audioContext.current.suspend().catch(() => {});
        }
    }

    const resumeSounds = () => {
        setIsTabVisible(true);
        if (gameLoopSound.current) {
            console.log('resuming game loop sound')
            gameLoopSound.current.play().catch(() => {});
        }
        if (audioContext.current) {
            console.log('resuming audio context')
            audioContext.current.resume().catch(() => {});
        }
    }


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
        if (!gameLoopSound.current || !isTabVisible) return;

        // On mobile, AudioContext starts suspended and needs to be resumed
        // before any sound can play. Resume it here since this is triggered
        // close to a user gesture (tapping "Start Game").
        const ctx = audioContext.current;
        const play = () => {
            gameLoopSound.current!.currentTime = 0;
            gameLoopSound.current!.play().catch(() => {
            });
        };

        if (ctx && ctx.state === 'suspended') {
            ctx.resume().then(play).catch(() => {
            });
        } else {
            play();
        }
    };

    return {playExplosion, playHit, playGameOver, playGameLoop, pauseSounds, resumeSounds};
};