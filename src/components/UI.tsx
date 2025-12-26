import * as React from "react";

interface UIProps {
    score: number;
    level: number;
    highScore: number;
}

export const UI: React.FC<UIProps> = ({ score, level, highScore }) => {
    return (
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
                textTransform: 'uppercase',
            }}
        >
            <div style={{display: 'flex', flexDirection: 'column'}}>Score: {score.toString().padStart(6, '0')}</div>
            <div>Best: {highScore.toString().padStart(6, '0')}</div>
            <div>Level: {level}</div>
        </div>
    );
};