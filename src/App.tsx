import {useCallback, useEffect, useRef, useState} from 'react';
import {Letter} from './components/Letter';
import {Base} from './components/Base';
import {UI} from './components/UI';
import type {LetterData} from './types/game.types';
import {useKeyboard} from "./hooks/useKeyboard.ts";
import {useGameLoop} from "./hooks/useGameLoop.ts";
import {getRandomDirection} from './utils/spawnHelpers';
import {GameOver} from "./components/GameOver.tsx";
import {useSounds} from "./hooks/useSounds.ts";
import {StartMenu} from './components/StartMenu';
import {PauseMenu} from './components/PauseMenu';
import {Particles} from "./components/Particles.tsx";
import {useLocalStorage} from "./hooks/useLocalStorage.ts";
import {MobileIncoming} from "./components/MobileIncoming";

// Lettres disponibles
const AVAILABLE_LETTERS = ['Z', 'Q', 'S', 'D'];

function App() {
    const [isMobile, setIsMobile] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);
    const [level, setLevel] = useState<number>(1);
    const [letters, setLetters] = useState<LetterData[]>([]);
    const [destroyedLetters, setDestroyedLetters] = useState<string[]>([]);
    const [musicVolume, setMusicVolume] = useLocalStorage('music-volume', 1);
    const [sfxVolume, setSfxVolume] = useLocalStorage('sfx-volume', 1);
    const [tapCount, setTapCount] = useState(0);
    const [devMod, setDevMod] = useState(false);

    const [highScore, setHighScore] = useLocalStorage('high-score', 0);
    const {playExplosion, playHit, playGameOver, playGameLoop} = useSounds(musicVolume, sfxVolume);

    const [particles, setParticles] = useState<Array<{ id: string, x: number, y: number, color: string }>>([]);


    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    const hasPlayedMusic = useRef(false);

    const handleStart = () => {
        setGameStarted(true);
    };

    const TABLET_BREAKPOINT = 1024; // Couvre mobiles + tablettes

    useEffect(() => {
        const isMobileOrTablet = (): boolean => {
            // Combinaison : taille d'écran + détection tactile
            const isSmallScreen = window.innerWidth <= TABLET_BREAKPOINT;
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            return isSmallScreen || hasTouch;
        };

        const handleChange = () => {
            console.log(isMobileOrTablet() ? 'Mobile detected' : 'Desktop detected')
            setIsMobile(isMobileOrTablet());
        };

        handleChange();
        window.addEventListener('resize', handleChange);

        return () => {
            window.removeEventListener('resize', handleChange);
        };
    }, []);

    // Jouer la musique une seule fois au montage
    useEffect(() => {
        if (!hasPlayedMusic.current && gameStarted) {
            playGameLoop();
            hasPlayedMusic.current = true;
        }
    }, [playGameLoop, gameStarted]);

    // Gérer la touche ESC pour pause
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && gameStarted && !isGameOver) {
                setIsPaused((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [gameStarted, isGameOver, setIsPaused]);

    // Calcul de la difficulté selon le niveau
    const getSpeed = (currentLevel: number) => {
        return Math.max(2, 5 - (currentLevel - 1) * 0.3); // Vitesse minimale : 2 secondes
    };

    const getSpawnInterval = (currentLevel: number) => {
        return Math.max(500, 2000 - (currentLevel - 1) * 200); // Interval min : 800ms
    };

    // Fonction pour spawner une nouvelle lettre
    const spawnLetter = useCallback(() => {
        const newLetter: LetterData = {
            id: Date.now().toString() + Math.random(),
            character: AVAILABLE_LETTERS[Math.floor(Math.random() * AVAILABLE_LETTERS.length)],
            x: Math.random() * (window.innerWidth - 100),
            y: '-55vh',
            speed: getSpeed(level),
            direction: getRandomDirection()
        };

        setLetters((prev) => [...prev, newLetter]);
    }, [level]);


    const handleRestart = () => {
        setScore(0);
        setLives(3);
        setLevel(1);
        setLetters([]);
        setDestroyedLetters([]);
        setIsGameOver(false);
        if (isPaused) {
            setIsPaused(false);
        }
    }

    const handleResume = () => {
        setIsPaused(false);
    };



    useEffect(() => {
        const handleCustomTap = () => {
            if (tapCount < 2) {
                setTapCount((prev) => prev + 1);
            }
            if (tapCount === 2) {
                if (!devMod) setDevMod(true);
            }
        }

        window.addEventListener('touchstart', handleCustomTap);
        return () => window.removeEventListener('touchstart', handleCustomTap);
    }, [tapCount, setDevMod]);

    const handleQuitToMenu = () => {
        setGameStarted(false);
        setIsPaused(false);
        handleRestart(); // Reset le jeu
    };


    useEffect(() => {
        const newLevel = Math.floor(score / 50) + 1;
        if (newLevel !== level) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLevel(newLevel);
            console.log(`🎉 Level UP! Now level ${newLevel}, speed is ${getSpeed(newLevel)}, interval is ${getSpawnInterval(newLevel)}`);
        }
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score, level, highScore, setHighScore])

    useGameLoop({
        onTick: spawnLetter,
        interval: getSpawnInterval(level),
        isActive: !isGameOver && gameStarted && !isPaused
    })

    const handleKey = (key: string) => {
        // Chercher une lettre qui correspond à la touche tapée
        if (isPaused) return;

        const matchingLetter = letters.find(
            (letter) => letter.character === key && !destroyedLetters.includes(letter.id)
        );
        if (matchingLetter) {
            playExplosion()

            const letterElement = document.querySelector(`[data-letter-id="${matchingLetter.id}"]`);
            if (letterElement) {
                const rect = letterElement.getBoundingClientRect();
                const color = window.getComputedStyle(letterElement).color;

                // Ajouter les particules
                setParticles((prev) => [...prev, {
                    id: matchingLetter.id,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    color: color,
                }]);

                // Retirer après l'animation
                setTimeout(() => {
                    setParticles((prev) => prev.filter((p) => p.id !== matchingLetter.id));
                }, 500);
            }
            // Marquer la lettre comme détruite
            setDestroyedLetters((prev) => [...prev, matchingLetter.id]);

            // Augmenter le score
            setScore((prev) => prev + 10);

            // Retirer la lettre après l'animation (300ms)
            setTimeout(() => {
                setLetters((prev) => prev.filter((l) => l.id !== matchingLetter.id));
                setDestroyedLetters((prev) => prev.filter((id) => id !== matchingLetter.id));
            }, 300);
        }
    }

        useKeyboard((key) => {
            handleKey(key);
        });

        const handleReachBase = (id: string) => {
            // Retirer une vie
            const newLives = lives - 1;
            setLives(newLives);
            playHit()
            setLetters((prev) => prev.filter((letter) => letter.id !== id));

            // Game Over si plus de vies
            if (newLives <= 0) {
                setIsGameOver(true);
                playGameOver();
                setLetters([]);
            }
        };

        return (
            <div className="game-container"
                 onSelect={() => {return false;}}
            >

                {isMobile && !devMod && <MobileIncoming/>}
                {!gameStarted && !isMobile || (!gameStarted && isMobile && devMod) && <StartMenu onStart={handleStart} isMobile={isMobile}/>}


                {gameStarted && (
                    <>
                        <UI score={score} level={level} highScore={highScore} isMobile={isMobile} handleKeyTap={handleKey}/>

                        {letters.map((letter) => (
                            <Letter
                                key={letter.id}
                                letter={letter}
                                onReachBase={handleReachBase}
                                isDestroyed={destroyedLetters.includes(letter.id)}
                                isPaused={isPaused}
                            />
                        ))}

                        {isPaused && (
                            <PauseMenu
                                onResume={handleResume}
                                onRestart={handleRestart}
                                onQuit={handleQuitToMenu}
                                musicVolume={musicVolume}
                                sfxVolume={sfxVolume}
                                onMusicVolumeChange={setMusicVolume}
                                onSfxVolumeChange={setSfxVolume}
                            />
                        )}

                        {particles.map((particle) => (
                            <Particles key={particle.id} x={particle.x} y={particle.y} color={particle.color}/>
                        ))}

                        <Base lives={lives}/>
                        {
                            isGameOver && <GameOver score={score} highScore={highScore} onRestart={handleRestart} isMobile={isMobile}/>
                        }
                    </>
                )}
            </div>
        );
    }

    export default App;