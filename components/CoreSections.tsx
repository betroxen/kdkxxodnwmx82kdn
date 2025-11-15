import React from 'react';

// --- INLINE SVG ICON DEFINITIONS ---
// These replace the external 'lucide-react' imports to solve the build failure.
const Icons = {
  // Shield (Security)
  Shield: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c-1.3-3.6-4.5-5.5-8-6.5s-6.7-2.4-8-6"/>
      <path d="M4 11.08V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6.08c0 5.43-3.26 9.5-8 11.92c-4.74-2.42-8-6.49-8-11.92z"/>
    </svg>
  ),
  // Users (Compliance/Community)
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  // Zap (Rewards/Power)
  Zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  // ArrowRight (CTA)
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
};

// --- FEATURED CASINOS MARQUEE ---
const FeaturedCasinos = () => {
  const casinoNames = [ "DUEL", "STAKE", "ROOBET", "SHUFFLE", "GAMDOM" ];
  const marqueeContent = [...casinoNames, ...casinoNames, ...casinoNames];

  return (
    <section className="w-full bg-foundation py-12 border-y border-foundation-light/20">
      <div className="container mx-auto max-w-7xl px-4 mb-8">
        <h2 className="text-center text-xl md:text-2xl font-orbitron font-semibold uppercase tracking-widest opacity-90 neon-gradient-text">
          POWERING THE TOP TIER OPERATORS
        </h2>
      </div>
      <div className="relative w-full overflow-hidden mask-image-lr">
        <div className="flex w-max animate-slide items-center">
          {marqueeContent.map((name, index) => (
            <div key={index} className="mx-6 md:mx-10 flex items-center justify-center select-none">
              <span className="text-2xl md:text-3xl font-orbitron font-extrabold text-white tracking-wider opacity-60 marquee-text-hover transition-colors duration-300 cursor-default">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CORE FEATURES SECTION ---
const FeaturesSection = () => {
  const features = [
    { icon: Icons.Shield, title: "ZK-ROLLUP SECURITY", description: "Every result is secured and proven by zero-knowledge proofs on a Layer 2 solution. Trust the math, not the operator. Verifiable Provenance Record (VPR) for all transactions." },
    { icon: Icons.Users, title: "XAI ETHICAL COMPLIANCE", description: "Our Explainable AI (XAI) framework provides automated Responsible Gaming (RG) interventions and transparent risk scoring. Regulatory strength baked into the protocol." },
    { icon: Icons.Zap, title: "DEGEN REWARDS PROTOCOL", description: "Earn Zap Points for network contribution, verifiable transparency checks, and mission completion. Loyalty is coded, not assumed. Maximize your tactical edge." }
  ];

  return (
    <section id="features" className="bg-foundation py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-4xl font-orbitron font-extrabold uppercase tracking-tight neon-gradient-text md:text-5xl">THE ZAP MANDATE</h2>
        <p className="mb-12 text-center text-xl text-text-secondary font-jetbrains-mono">We don't sell games. We sell institutional integrity.</p>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> 
          {features.map((feature, index) => (
            // Use the feature.icon as a component here
            <div key={index} className="rounded-xl p-6 md:p-8 card-carved group card-pulse">
              <div className="mb-6 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-neon-surge/10 icon-container-carved"> 
                <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-neon-surge icon-spin" /> 
              </div>
              <h3 className="mb-3 text-xl md:text-2xl font-orbitron font-bold text-white tracking-wide">{feature.title}</h3>
              <p className="text-text-secondary text-base leading-relaxed font-jetbrains-mono">{feature.description}</p>
              
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
            <FeaturedCasinos />
            <FeaturesSection />
        </>
    )
}

export default CoreSections;

