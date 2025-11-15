import React from 'react';
import { Shield, Users, Zap, ArrowRight } from 'lucide-react';

// Define Icons using lucide-react
const Icons = {
  Shield,
  Users,
  Zap,
  ArrowRight,
};

// --- STYLES FOR CARVED 3D EFFECT, NEON ONLY, AND ANIMATIONS ---
const ComponentStyles = () => (
    <style jsx="true">{`
        /* Font Imports */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

        /* Colors */
        .bg-foundation { background-color: #0A0A0A; } /* Matte Black Void */
        .bg-foundation-light { background-color: #1A1A1A; } /* Slightly lighter dark for card base */
        .text-neon-surge { color: #4affac; } /* Neon accent */
        .text-text-secondary { color: #b3b3b3; }
        .border-foundation-dark { border-color: #000000; }

        /* Typography */
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        
        /* --- NEON GRADIENT TEXT EFFECT --- */
        .neon-gradient-text {
            /* Fallback color */
            color: #4affac; 
            /* Gradient application */
            background: linear-gradient(45deg, #4affac 0%, #178a53 100%); 
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }


        /* Marquee Animation */
        @keyframes slide {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-slide { animation: slide 30s linear infinite; }
        .mask-image-lr {
            mask-image: linear-gradient(90deg, transparent, white 5%, white 95%, transparent);
            -webkit-mask-image: linear-gradient(90deg, transparent, white 5%, white 95%, transparent);
        }

        /* --- CARVED CARD DESIGN --- */
        .card-carved {
            background-color: #1A1A1A;
            border: 1px solid #000000;
            transition: all 0.4s ease-in-out;
            border-radius: 12px;
            
            /* Initial multi-layer box-shadow for deep carving */
            box-shadow: 
                inset 5px 5px 12px rgba(0, 0, 0, 1.0), 
                inset -5px -5px 12px rgba(40, 40, 40, 0.4),
                0 6px 15px rgba(0, 0, 0, 0.5);
        }

        .card-carved:hover {
            transform: translateY(-3px); /* Lift on hover */
            box-shadow: 
                0 0 25px rgba(74, 255, 172, 0.6), /* Stronger Neon outer glow */
                inset 3px 3px 8px rgba(0, 0, 0, 0.9),
                inset -3px -3px 8px rgba(40, 40, 40, 0.2); 
            border-color: #4affac; /* Neon border on hover */
        }

        /* Icon Container Carved Style */
        .icon-container-carved {
             background-color: #0A0A0A;
             border: 1px solid #000000;
             border-radius: 50%;
             box-shadow: 
                inset 3px 3px 6px rgba(0, 0, 0, 1.0),
                inset -3px -3px 6px rgba(30, 30, 30, 0.3);
             transition: all 0.3s ease-in-out;
        }

        /* --- ROBUST ICON ANIMATION --- */
        .card-carved.group:hover .icon-container-carved {
            transform: scale(1.05);
            box-shadow: 
                0 0 15px #4affac, /* Intense outer neon glow on icon container */
                inset 3px 3px 6px rgba(0, 0, 0, 1.0),
                inset -3px -3px 6px rgba(30, 30, 30, 0.3);
            border-color: #4affac;
        }

        .icon-spin {
            transition: transform 0.8s ease-in-out; 
        }
        .group:hover .icon-spin {
            transform: rotate(360deg);
        }

        /* --- SUBTLE PULSE ANIMATION --- */
        @keyframes pulse-shadow {
            0%, 100% {
                box-shadow: 
                    inset 5px 5px 12px rgba(0, 0, 0, 1.0), 
                    inset -5px -5px 12px rgba(40, 40, 40, 0.4),
                    0 6px 15px rgba(0, 0, 0, 0.5);
            }
            50% {
                box-shadow: 
                    inset 5px 5px 12px rgba(0, 0, 0, 1.0), 
                    inset -5px -5px 12px rgba(40, 40, 40, 0.4),
                    0 0 15px rgba(74, 255, 172, 0.2), 
                    0 8px 20px rgba(0, 0, 0, 0.7);
            }
        }
        .card-pulse { animation: pulse-shadow 4s infinite ease-in-out; }

        /* Links and Marquee */
        .marquee-text-hover:hover {
            color: #4affac;
            text-shadow: 0 0 8px #4affac;
        }
        .text-read-protocol {
            color: #4affac; 
            transition: color 0.3s ease;
        }
    `}</style>
);


const FeaturedCasinos = () => {
  const casinoNames = [ "DUEL", "STAKE", "ROOBET", "SHUFFLE", "GAMDOM" ];
  const marqueeContent = [...casinoNames, ...casinoNames, ...casinoNames];

  return (
    <section className="w-full bg-[#0A0A0A] py-12 border-y border-foundation-dark">
      <div className="container mx-auto max-w-7xl px-4 mb-8">
        <h2 className="text-center text-xl md:text-2xl font-orbitron font-semibold uppercase tracking-widest opacity-80 neon-gradient-text">
          POWERING THE TOP TIER OPERATORS
        </h2>
      </div>
      <div className="relative w-full overflow-hidden mask-image-lr">
        <div className="flex w-max animate-slide items-center">
          {marqueeContent.map((name, index) => (
            <div key={index} className="mx-6 md:mx-10 flex items-center justify-center select-none">
              <span className="text-2xl md:text-3xl font-orbitron font-extrabold text-white tracking-wider opacity-60 marquee-text-hover transition-opacity transition-colors duration-300 cursor-default">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: Icons.Shield, title: "ZK-ROLLUP SECURITY", description: "Every result is secured and proven by zero-knowledge proofs on a Layer 2 solution. Trust the math, not the operator. Verifiable Provenance Record (VPR) for all transactions." },
    { icon: Icons.Users, title: "XAI ETHICAL COMPLIANCE", description: "Our Explainable AI (XAI) framework provides automated Responsible Gaming (RG) interventions and transparent risk scoring. Regulatory strength baked into the protocol." },
    { icon: Icons.Zap, title: "DEGEN REWARDS PROTOCOL", description: "Earn Zap Points for network contribution, verifiable transparency checks, and mission completion. Loyalty is coded, not assumed. Maximize your tactical edge." }
  ];

  return (
    <section id="features" className="bg-foundation py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-4xl font-orbitron font-semibold uppercase tracking-tight neon-gradient-text md:text-5xl">THE ZAP MANDATE</h2>
        <p className="mb-12 text-center text-xl text-text-secondary font-rajdhani">We don't sell games. We sell institutional integrity.</p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> 
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl p-8 card-carved group card-pulse">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon-surge/10 icon-container-carved"> 
                <feature.icon className="h-8 w-8 text-neon-surge icon-spin" /> 
              </div>
              <h3 className="mb-3 text-2xl font-orbitron font-semibold text-white">{feature.title}</h3> {/* Changed to font-semibold */}
              <p className="text-text-secondary text-base leading-relaxed font-rajdhani">{feature.description}</p>
              <a href="#" className="mt-4 inline-flex items-center text-read-protocol text-sm font-semibold group-hover:underline">
                Read Protocol
                <Icons.ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CoreSections = () => {
    return (
        <>
            <ComponentStyles /> {/* Inject the CSS here */}
            <FeaturedCasinos />
            <FeaturesSection />
        </>
    )
}

export default CoreSections;

