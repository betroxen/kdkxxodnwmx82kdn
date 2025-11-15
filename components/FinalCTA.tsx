import React, { useContext } from 'react';
import { Button } from './Button';
import { AppContext } from '../context/AppContext';

/**
 * The final call-to-action component, featuring a deep-carved card
 * that triggers the registration modal using AppContext.
 */
export const FinalCTA: React.FC = () => {
  const appContext = useContext(AppContext);

  const handleRegisterClick = () => {
    if (appContext) {
      // Execute the protocol to open the registration modal
      appContext.openAuthModal('register'); 
    }
  };

  return (
    <section className="w-full bg-foundation py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Core CTA Card: Uses the deep matte 'card-carved' style */}
        <div className="card-carved group mx-auto max-w-4xl p-8 md:p-12 text-center rounded-xl transition-all duration-500">
          
          {/* Neon Accent Line */}
          <div className="mx-auto w-16 h-1 bg-neon-surge/70 rounded-full mb-6 transition-transform duration-500 group-hover:w-24 group-hover:bg-neon-surge"></div>

          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-4 neon-gradient-text drop-shadow-[0_0_10px_rgba(0,255,192,0.2)]">
            THE CIRCUIT IS <span className="text-neon-surge text-glow">LIVE.</span>
          </h2>
          
          {/* Subtext */}
          <p className="mt-4 text-lg md:text-xl text-text-secondary font-jetbrains-mono mb-10 leading-relaxed max-w-3xl mx-auto">
            Your tactical advantage is waiting. Stop guessing, start verifying. Join the protocol and unlock institutional-grade intel today.
          </p>
          
          {/* Primary CTA Button (Upgraded style) */}
          <Button
            size="lg"
            variant="primary"
            onClick={handleRegisterClick}
            className="uppercase tracking-widest text-lg py-4 px-12 shadow-[0_0_40px_rgba(0,255,192,0.4)] hover:shadow-[0_0_60px_rgba(0,255,192,0.6)] animate-pulse-glow-shadow"
          >
            [ JOIN THE CIRCUIT ]
          </Button>
        </div>
      </div>
    </section>
  );
};