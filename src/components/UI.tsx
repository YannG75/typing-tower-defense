import * as React from "react";
import {MobileButton} from "./MobileButton.tsx";

interface UIProps {
    score: number,
    level: number,
    highScore: number,
    isMobile?: boolean,
    handleKeyTap: (key: string) => void,
    handlePauseKey?: () => void
}

export const UI: React.FC<UIProps> = ({score, level, highScore, isMobile, handleKeyTap, handlePauseKey}) => {
    return (
        <>
            {isMobile ? (
                // Layout mobile optimisé
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        zIndex: 100,
                    }}
                >
                    {/* Zone gauche: Infos empilées */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            color: '#ffd93d',
                            textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                            textTransform: 'uppercase',
                        }}
                    >
                        <div>SCORE: {score.toString().padStart(6, '0')}</div>
                        <div style={{ display: 'flex', gap: '12px' }}>
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
                // Layout desktop (inchangé)
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ffd93d',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                        zIndex: 100,
                        textTransform: 'uppercase'
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'column'}}>Score: {score.toString().padStart(6, '0')}</div>
                    <div>Best: {highScore.toString().padStart(6, '0')}</div>
                    <div>Level: {level}</div>
                </div>
            )}

            {isMobile && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        left: '20px',
                        right: '20px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        fontWeight: 'bold',
                        color: '#ffd93d',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                        zIndex: 100,
                        textTransform: 'uppercase'
                    }}
                >
                    {['Z', 'Q', 'S', 'D'].map((letter) => (
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