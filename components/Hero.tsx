import React from 'react';
import { Button } from './Button';

interface HeroProps {
  onRegisterClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  return (
    <section 
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center 
                 bg-gradient-to-br from-foundation-light to-foundation/90 
                 px-4 py-24 text-center overflow-hidden"
    >

      {/* Grid Overlay Effect (Retained) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
          <div className="absolute inset-0 bg-grid animate-moving-grid"></div>
      </div>
      
      {/* Radial Gradient Mask (Retained) - Ensures edges blend cleanly */}
      <div className="absolute inset-0 bg-foundation [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,#000_100%)] pointer-events-none z-10"></div>

      <div className="relative z-20 max-w-6xl flex flex-col items-center animate-fadeIn">
        {/* Header Tag */}
        <div className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-neon-surge/5 border border-neon-surge/30 rounded-full text-neon-surge font-jetbrains-mono text-xs uppercase tracking-[0.3em] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
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
};