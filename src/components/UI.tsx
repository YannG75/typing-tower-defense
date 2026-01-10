import * as React from "react";

interface UIProps {
    score: number;
    level: number;
    highScore: number;
    isMobile?: boolean;
    handleKeyTap?: (key: string) => void;
}

export const UI: React.FC<UIProps> = ({ score, level, highScore, isMobile, handleKeyTap }) => {
    return (
       <>
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

           {isMobile && (
               <div
                   style={{
                       position: 'absolute',
                       bottom: '20px',
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
                   <div style={{
                       border: '2px solid #ffd93d',
                       boxShadow: '0 0 10px #ffd93d',
                       padding: '10px',
                   }}>
                       <p style={{
                           fontSize: '1.5rem',
                           textAlign: 'center',
                           fontWeight: 'bold',
                           color: '#ffd93d',
                           textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                           userSelect: 'none'
                       }}
                          onTouchStart={() => {
                              console.log('Z');
                              handleKeyTap && handleKeyTap('Z');
                          }}
                       >Z</p>
                   </div>
                   <div style={{
                       border: '2px solid #ffd93d',
                       boxShadow: '0 0 10px #ffd93d',
                       padding: '10px',
                   }}>
                       <p style={{
                           fontSize: '1.5rem',
                           textAlign: 'center',
                           fontWeight: 'bold',
                           color: '#ffd93d',
                           textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                           userSelect: 'none'
                       }}
                       onTouchStart={() => {
                           console.log('Q');
                           handleKeyTap && handleKeyTap('Q');
                       }}
                       >Q</p>
                   </div>
                   <div style={{
                       border: '2px solid #ffd93d',
                       boxShadow: '0 0 10px #ffd93d',
                       padding: '10px',
                   }}>
                       <p style={{
                           fontSize: '1.5rem',
                           textAlign: 'center',
                           fontWeight: 'bold',
                           color: '#ffd93d',
                           textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                           userSelect: 'none'
                       }}
                       onTouchStart={() => {
                           console.log('S');
                           handleKeyTap && handleKeyTap('S');
                       }}
                       >S</p>
                   </div>
                   <div style={{
                       border: '2px solid #ffd93d',
                       boxShadow: '0 0 10px #ffd93d',
                       padding: '10px',
                   }}>
                       <p style={{
                           fontSize: '1.5rem',
                           textAlign: 'center',
                           fontWeight: 'bold',
                           color: '#ffd93d',
                           textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                           userSelect: 'none'
                       }}
                          onTouchStart={() =>
                          {
                              console.log('D');
                              handleKeyTap && handleKeyTap('D');
                          }
                       }
                       >D</p>
                   </div>
               </div>
           )}
       </>
    );
};