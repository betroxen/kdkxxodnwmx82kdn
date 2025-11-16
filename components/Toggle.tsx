import React, { useCallback, useRef, useEffect } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

/**
 * Mock useSound hook implementation for single-file deployment.
 * It uses the native Audio API to play the sound URL.
 * NOTE: In a secure environment, remote audio URLs may fail due to CSP/network restrictions.
 * It provides a console fallback if audio initialization fails.
 */
const useSound = (url: string, volume: number): () => void => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element once
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Audio' in window) {
            try {
                const audio = new Audio(url);
                audio.volume = volume;
                audioRef.current = audio;
            } catch (e) {
                console.error("Failed to initialize audio element:", e);
                // Fallback for environments where Audio constructor is restricted
            }
        }
    }, [url, volume]);

    const playSound = useCallback(() => {
        if (audioRef.current) {
            // Stop and rewind for immediate re-triggering
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            // Play and catch potential promise errors (e.g., user interaction required)
            audioRef.current.play().catch(e => {
                // Audio is often blocked until user interaction. Log silently.
                // console.log('Audio playback blocked/failed:', e);
            });
        } else {
            // Log action if audio initialization failed
            console.log(`[Sound Mock]: Playing toggle sound from ${url} at volume ${volume}`);
        }
    }, [url, volume]);

    return playSound;
};

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => {
    // Ensures accessibility link between label and switch
    const id = React.useId(); 
    
    // Using a low-volume click sound for confirmation
    const playToggleSound = useSound('https://files.catbox.moe/a721g6.mp3', 0.2); 

    const handleChange = () => {
        playToggleSound();
        onChange(!checked);
    };

    return (
        <div className="flex items-start justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-foundation-light/10">
            {/* Text labels and description */}
            <div className="flex flex-col flex-1 pr-4">
                <label 
                    htmlFor={id} 
                    className="cursor-pointer font-orbitron text-sm font-bold text-white uppercase"
                >
                    {label}
                </label>
                <p className="text-text-secondary text-xs font-jetbrains-mono mt-1">
                    {description}
                </p>
            </div>
            
            {/* Toggle Switch Button */}
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={handleChange}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neon-surge focus:ring-offset-2 focus:ring-offset-foundation-dark ${checked ? 'bg-neon-surge' : 'bg-[#333]'}`}
            >
                <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};

