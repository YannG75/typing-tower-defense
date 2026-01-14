import * as React from "react";

interface VolumeSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({label, value, onChange}) => {
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
