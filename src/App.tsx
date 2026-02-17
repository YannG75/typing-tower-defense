import {useEffect, useRef, useState} from 'react';
import {Letter} from './components/Letter';
import {Base} from './components/Base';
import {UI} from './components/UI';
import {useKeyboard} from "./hooks/useKeyboard.ts";
import {GameOver} from "./components/GameOver.tsx";
import {useSounds} from "./hooks/useSounds.ts";
import {StartMenu} from './components/StartMenu';
import {PauseMenu} from './components/PauseMenu';
import {Particles} from "./components/Particles.tsx";
import {useLocalStorage} from "./hooks/useLocalStorage.ts";
import {GAME_CONFIG} from './constants/game';
import {useScreenShake} from './hooks/useScreenShake';
import {useGameState} from './hooks/useGameState';

function App() {
    // UI-specific state
    const [isMobile, setIsMobile] = useState(false);
    const [musicVolume, setMusicVolume] = useLocalStorage('music-volume', 1);
    const [sfxVolume, setSfxVolume] = useLocalStorage('sfx-volume', 1);

    // Audio and effects
    const {playExplosion, playHit, playGameOver, playGameLoop} = useSounds(musicVolume, sfxVolume);
    const { trigger: triggerShake, offset: shakeOffset } = useScreenShake({ duration: 500, intensity: 15 });
    const hasPlayedMusic = useRef(false);

    // Game state (all game logic is now in this hook)
    const gameState = useGameState({
        onLifeLost: () => {
            playHit();
            triggerShake();
        },
        onLetterDestroyed: () => {
            playExplosion();
        },
        onGameOver: () => {
            playGameOver();
        }
    });

    // Mobile detection
    useEffect(() => {
        const isMobileOrTablet = (): boolean => {
            // Combinaison : taille d'écran + détection tactile
            const isSmallScreen = window.innerWidth <= GAME_CONFIG.TABLET_BREAKPOINT;
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

    // Play music once when game starts
    useEffect(() => {
        if (!hasPlayedMusic.current && gameState.gameStarted) {
            playGameLoop();
            hasPlayedMusic.current = true;
        }
    }, [playGameLoop, gameState.gameStarted]);

    // Handle ESC key for pause
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && gameState.gameStarted && !gameState.isGameOver) {
                gameState.pauseGame();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [gameState]);

    // Keyboard input handler
    useKeyboard((key) => {
        gameState.destroyLetter(key);
    });

    return (
        <div
            className="game-container no-select"
            style={{
                transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
                transition: 'none',
            }}
        >
            {!gameState.gameStarted && (
                <StartMenu onStart={gameState.startGame} isMobile={isMobile}/>
            )}

            {gameState.gameStarted && (
                <>
                    <UI
                        score={gameState.score}
                        level={gameState.level}
                        highScore={gameState.highScore}
                        isMobile={isMobile}
                        handleKeyTap={gameState.destroyLetter}
                        handlePauseKey={gameState.pauseGame}
                    />

                    {gameState.letters.map((letter) => (
                        <Letter
                            key={letter.id}
                            letter={letter}
                            onReachBase={gameState.handleLetterReachBase}
                            isDestroyed={gameState.destroyedLetters.includes(letter.id)}
                            isPaused={gameState.isPaused}
                            isMobile={isMobile}
                        />
                    ))}

                    {gameState.isPaused && (
                        <PauseMenu
                            onResume={gameState.resumeGame}
                            onRestart={gameState.restartGame}
                            onQuit={gameState.quitToMenu}
                            musicVolume={musicVolume}
                            sfxVolume={sfxVolume}
                            onMusicVolumeChange={setMusicVolume}
                            onSfxVolumeChange={setSfxVolume}
                            isMobile={isMobile}
                        />
                    )}

                    {gameState.particles.map((particle) => (
                        <Particles key={particle.id} x={particle.x} y={particle.y} color={particle.color}/>
                    ))}

                    <Base lives={gameState.lives}/>

                    {gameState.isGameOver && (
                        <GameOver
                            score={gameState.score}
                            highScore={gameState.highScore}
                            onRestart={gameState.restartGame}
                            isMobile={isMobile}
                        />
                    )}
                </>
            )}
        </div>
    );
}

    export default App;