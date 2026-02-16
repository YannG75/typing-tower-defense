import * as React from "react";
import {MobileButton} from "./MobileButton.tsx";
import {GAME_CONFIG} from '../constants/game';

interface UIProps {
    score: number,
    level: number,
    highScore: number,
    isMobile?: boolean,
    handleKeyTap: (key: string) => void,
    handlePauseKey?: () => void
}

// Shared text styles
const textStyle = {
    fontWeight: 'bold' as const,
    color: '#ffd93d',
    textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
    textTransform: 'uppercase' as const,
};

// Style objects
const styles = {
    mobileContainer: {
        position: 'absolute' as const,
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between' as const,
        alignItems: 'flex-start' as const,
        zIndex: 100,
    },
    mobileInfo: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '4px',
        fontSize: '0.75rem',
        ...textStyle,
    },
    mobileInfoRow: {
        display: 'flex',
        gap: '12px',
    },
    desktopContainer: {
        position: 'absolute' as const,
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between' as const,
        fontSize: '0.8rem',
        zIndex: 100,
        ...textStyle,
    },
    desktopColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    mobileButtonContainer: {
        position: 'absolute' as const,
        bottom: '80px',
        left: '20px',
        right: '20px',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        gap: '20px',
        zIndex: 100,
        ...textStyle,
    },
};

export const UI: React.FC<UIProps> = ({score, level, highScore, isMobile, handleKeyTap, handlePauseKey}) => {
    return (
        <>
            {isMobile ? (
                // Layout mobile optimisé
                <div style={styles.mobileContainer}>
                    {/* Zone gauche: Infos empilées */}
                    <div style={styles.mobileInfo}>
                        <div>SCORE: {score.toString().padStart(6, '0')}</div>
                        <div style={styles.mobileInfoRow}>
                            <span>BEST: {highScore.toString().padStart(6, '0')}</span>
                            <span>| LV: {level}</span>
                        </div>
                    </div>

                    {/* Zone droite: Bouton pause isolé */}
                    <MobileButton
                        letter="||"
                        handlePause={handlePauseKey}
                        isPauseButton={true}
                    />
                </div>
            ) : (
                // Layout desktop
                <div style={styles.desktopContainer}>
                    <div style={styles.desktopColumn}>Score: {score.toString().padStart(6, '0')}</div>
                    <div>Best: {highScore.toString().padStart(6, '0')}</div>
                    <div>Level: {level}</div>
                </div>
            )}

            {isMobile && (
                <div style={styles.mobileButtonContainer}>
                    {GAME_CONFIG.AVAILABLE_LETTERS.map((letter) => (
                        <MobileButton
                            key={letter}
                            letter={letter}
                            onTap={handleKeyTap}
                        />
                    ))}
                </div>
            )}
        </>
    );
};