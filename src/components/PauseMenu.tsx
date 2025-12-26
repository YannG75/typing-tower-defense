import {motion} from 'framer-motion';
import * as React from "react";
import {useState} from "react";

interface PauseMenuProps {
    onResume: () => void;
    onRestart: () => void;
    onQuit: () => void;
    musicVolume: number;
    sfxVolume: number;
    onMusicVolumeChange: (volume: number) => void;
    onSfxVolumeChange: (volume: number) => void;
}

export const PauseMenu: React.FC<PauseMenuProps> =
    ({
         onResume,
         onRestart,
         onQuit,
         musicVolume,
         sfxVolume,
         onSfxVolumeChange,
         onMusicVolumeChange
     }) => {
        const [showOptions, setShowOptions] = useState(false);
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(10, 10, 10, 0.9)',
                    zIndex: 150,
                }}
            >
                <motion.h1
                    initial={{scale: 0.8, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{delay: 0.1}}
                    style={{
                        fontSize: '2.5rem',
                        color: '#ffd93d',
                        textShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
                        marginBottom: '3rem',
                    }}
                >
                    PAUSED
                </motion.h1>

                {!showOptions ? (
                    // Menu principal
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <MenuButton onClick={onResume} delay={0.2}>
                            RESUME
                        </MenuButton>

                        <MenuButton onClick={() => setShowOptions(true)} delay={0.3}>
                            OPTIONS
                        </MenuButton>

                        <MenuButton onClick={onRestart} delay={0.4}>
                            RESTART
                        </MenuButton>

                        <MenuButton onClick={onQuit} delay={0.5}>
                            QUIT TO MENU
                        </MenuButton>
                    </div>
                ) : (
                    // Menu options
                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        animate={{opacity: 1, x: 0}}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            minWidth: '400px',
                        }}
                    >
                        {/* Volume Musique */}
                        <VolumeSlider
                            label="MUSIC"
                            value={musicVolume}
                            onChange={onMusicVolumeChange}
                        />

                        {/* Volume SFX */}
                        <VolumeSlider
                            label="SFX"
                            value={sfxVolume}
                            onChange={onSfxVolumeChange}
                        />

                        {/* Bouton retour */}
                        <MenuButton onClick={() => setShowOptions(false)} delay={0}>
                            BACK
                        </MenuButton>
                    </motion.div>
                )}

                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 0.6}}
                    transition={{delay: 0.6}}
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        fontSize: '0.7rem',
                        color: '#ffffff',
                    }}
                >
                    PRESS ESC TO RESUME
                </motion.div>
            </motion.div>
        );
    };

// Composant bouton réutilisable
interface MenuButtonProps {
    onClick: () => void;
    delay: number;
    children: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({onClick, delay, children}) => {
    return (
        <motion.button
            initial={{x: -50, opacity: 0}}
            animate={{x: 0, opacity: 1, transition: {delay}}}
            whileHover={{scale: 1.1, transition: {duration: 0.2}}}
            whileTap={{scale: 0.95}}
            onClick={onClick}
            style={{
                padding: '1rem 3rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#ffffff',
                background: '#906bcf',
                border: '4px solid #ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 0px rgba(0, 0, 0, 0.8)',
                fontFamily: 'inherit',
                letterSpacing: '1px',
                minWidth: '250px',
            }}
        >
            {children}
        </motion.button>
    );
};

// Composant slider de volume
interface VolumeSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({label, value, onChange}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#ffd93d',
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
            }}>
                <span>{label}</span>
                <span>{Math.round(value * 100)}%</span>
            </div>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{
                    width: '100%',
                    height: '8px',
                    cursor: 'pointer',
                    accentColor: '#6bcf7f',
                }}
            />
        </div>
    );
};