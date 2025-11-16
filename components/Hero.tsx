import React, { useMemo } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES (MOCKS & DEFINITIONS) ---

// 1. Mock Button Component (Reused from previous files)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', onClick, variant = 'primary', size = 'md', ...props }) => {
    const baseStyle = "font-bold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center";
    
    let colorStyle = '';
    switch (variant) {
        case 'primary':
            // High-intensity neon style
            colorStyle = 'bg-neon-surge text-black hover:bg-neon-surge/80 shadow-[0_0_15px_rgba(0,255,192,0.4)]';
            break;
        case 'secondary':
            colorStyle = 'bg-transparent text-white border border-[#333] hover:border-neon-surge/50 hover:bg-[#333]';
            break;
        case 'ghost':
            colorStyle = 'bg-transparent text-text-tertiary hover:text-white hover:bg-[#333]/50';
            break;
    }

    let sizeStyle = '';
    switch (size) {
        case 'sm':
            sizeStyle = 'h-8 px-3 text-xs';
            break;
        case 'md':
            sizeStyle = 'h-10 px-4 text-sm';
            break;
        case 'lg':
            sizeStyle = 'h-12 px-6 text-base';
            break;
    }

    return (
        <button
            type="button"
            className={`${baseStyle} ${sizeStyle} font-orbitron uppercase tracking-wider ${colorStyle} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// 2. Custom CSS Styles for the ZAP Aesthetic
const HeroStyles = `
/* Define core ZAP colors for consistency */
:root {
    --color-foundation: #111115;
    --color-foundation-light: #1c1c22;
    --color-neon-surge: #00FFC0;
    --color-text-secondary: #A0A0B0;
}

/* Grid Background Pattern */
.bg-grid {
    background-image: 
        linear-gradient(to right, #333 1px, transparent 1px),
        linear-gradient(to bottom, #333 1px, transparent 1px);
    background-size: 40px 40px;
    height: 200%;
    width: 200%;
    position: absolute;
    top: -50%;
    left: -50%;
}

/* Grid Animation */
@keyframes moving-grid {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
}

.animate-moving-grid {
    animation: moving-grid 40s linear infinite;
}

/* Neon Glow for "WE'RE THE CODE." */
.zap-logo-text {
    color: var(--color-neon-surge);
    text-shadow: 
        0 0 10px rgba(0, 255, 192, 0.7), 
        0 0 20px rgba(0, 255, 192, 0.5),
        0 0 30px rgba(0, 255, 192, 0.3);
}

/* CTA Pulse Glow Shadow */
@keyframes pulse-glow-shadow {
    0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 192, 0.4); }
    50% { box-shadow: 0 0 60px rgba(0, 255, 192, 0.8); }
}

.animate-pulse-glow-shadow {
    animation: pulse-glow-shadow 3s ease-in-out infinite;
}

/* Fade In Animation (for the main content block) */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
}

.bg-foundation { background-color: var(--color-foundation); }
.bg-foundation-light { background-color: var(--color-foundation-light); }
.text-neon-surge { color: var(--color-neon-surge); }
.text-text-secondary { color: var(--color-text-secondary); }
`;

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---


interface HeroProps {
  /** Handler for the main CTA button (e.g., opening a registration modal) */
  onRegisterClick: () => void;
}

/**
 * Hero component for the ZAP protocol landing page.
 * Features a high-impact, cybernetic aesthetic.
 */
export const Hero: React.FC<HeroProps> = React.memo(({ onRegisterClick }) => {
  
  // Custom styles need to be injected into the DOM once.
  // Using useMemo here ensures this structure is stable.
  const styleBlock = useMemo(() => (
    <style dangerouslySetInnerHTML={{ __html: HeroStyles }} />
  ), []);
  
  return (
    <section 
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center 
                 bg-gradient-to-br from-foundation-light to-foundation/90 
                 px-4 py-24 text-center overflow-hidden"
      role="banner"
    >
      {styleBlock}
      
      {/* Grid Overlay Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
          <div className="bg-grid animate-moving-grid"></div>
      </div>

      {/* Radial Gradient Mask - Ensures content contrast and blends to background */}
      <div 
        className="absolute inset-0 bg-foundation [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,var(--color-foundation)_100%)] pointer-events-none z-10"
        style={{ backgroundColor: 'var(--color-foundation)' }}
      />

      <div className="relative z-20 max-w-6xl flex flex-col items-center animate-fadeIn">
        {/* Header Tag / Operational Status Indicator */}
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-neon-surge/5 border border-neon-surge/30 rounded-full text-neon-surge font-jetbrains-mono text-xs uppercase tracking-[0.3em] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              {/* Pulsing Dot */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-surge opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-surge"></span>
            </span>
            INSTITUTIONAL GRADE TRANSPARENCY
        </div>

        {/* Primary Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-orbitron font-black tracking-tighter text-white leading-none mb-8 drop-shadow-[0_0_25px_rgba(0,255,192,0.1)]">
          WE'RE NOT A CASINO.
          <br />
          <span className="zap-logo-text">
            WE'RE THE CODE.
          </span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto max-w-3xl text-xl text-text-secondary md:text-2xl leading-relaxed mb-12 font-jetbrains-mono">
          Your fortified gateway to a smarter, fairer crypto gambling ecosystem. Engineered by degens, hardened by ZK-Rollups, amplified by unassailable data.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              variant="primary"
              onClick={onRegisterClick} 
              className="shadow-[0_0_50px_rgba(0,255,192,0.4)] uppercase tracking-[0.2em] py-4 px-10 text-lg animate-pulse-glow-shadow"
            >
                [ EXECUTE LOGIN PROTOCOL ]
            </Button>
        </div>
      </div>

      {/* Bottom fade to foundation color */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-foundation via-foundation/80 to-transparent z-10"></div>
    </section>
  );
});

Hero.displayName = 'Hero';

