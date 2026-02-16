import {motion} from 'framer-motion';
import * as React from "react";
import {useState} from "react";
import {MenuButton} from "./MenuButton";
import {VolumeSlider} from "./VolumeSlider";

interface PauseMenuProps {
    onResume: () => void;
    onRestart: () => void;
    onQuit: () => void;
    musicVolume: number;
    sfxVolume: number;
    onMusicVolumeChange: (volume: number) => void;
    onSfxVolumeChange: (volume: number) => void;
    isMobile?: boolean;
}

export const PauseMenu: React.FC<PauseMenuProps> =
    ({
         onResume,
         onRestart,
         onQuit,
         musicVolume,
         sfxVolume,
         onSfxVolumeChange,
         onMusicVolumeChange,
        isMobile = false
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
                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        animate={{opacity: 1, x: 0}}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            minWidth: isMobile ? '300px' : '400px',
                        }}
                    >
                        <VolumeSlider
                            label="MUSIC"
                            value={musicVolume}
                            onChange={onMusicVolumeChange}
                        />

                        <VolumeSlider
                            label="SFX"
                            value={sfxVolume}
                            onChange={onSfxVolumeChange}
                        />

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
                        bottom: isMobile ? '100px' : '50px',
                        fontSize: '0.7rem',
                        color: '#ffffff',
                    }}
                >
                    PRESS ESC TO RESUME
                </motion.div>
            </motion.div>
        );
    };
