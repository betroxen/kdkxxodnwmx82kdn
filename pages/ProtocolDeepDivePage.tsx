import React from 'react';
import { Icons } from '../components/icons';

// NOTE: Assumes Tailwind configuration defines utility colors like 'neon-surge', 
// 'foundation', 'warning-low', and 'text-secondary'.

const ProtocolDeepDivePage: React.FC = () => {

  // Custom glow class for high-impact text presentation
  const textGlow = "text-shadow-[0_0_5px_var(--tw-colors-neon-surge)]";

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Background Effect: Opaque Video & Gradient Overlay */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 opacity-10 blur-sm" onError={(e) => console.error("Video failed to load:", e.target)}>
        <source src="https://files.catbox.moe/tibx6u.mp4" type="video/mp4" /> {/* MANDATE: Replace with reliable, permanent asset URL */}
      </video>
      <div className="fixed inset-0 bg-foundation/95 backdrop-blur-sm z-0"></div>
      
      {/* Main Content Container */}
      <div className="relative z-10">
        <header className="text-center mb-16">
          <h1 className={`font-orbitron text-5xl md:text-6xl font-black uppercase tracking-tight ${textGlow}`}>
            The Verifiable Provenance Protocol
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-neon-surge font-rajdhani font-bold tracking-wider">
            Verification is Non-Negotiable. Compliance is Obsolete.
          </p>
        </header>

        {/* Introduction to PF Failure */}
        <section className="mb-16 bg-foundation-light/50 border border-neon-surge/20 rounded-xl p-6 sm:p-10 shadow-lg">
          <h2 className={`font-orbitron text-3xl font-black text-warning-low uppercase mb-4 text-center`}>
            Legacy "Provably Fair" is a Half-Truth.
          </h2>
          <p className="text-text-secondary leading-relaxed font-rajdhani text-lg text-center">
            It verifies the fairness of a **single roll** (C Fairness) but is willfully blind to the operator's overall systemic return. They can show you a "fair" sequence while quietly **RIGGING THE HOUSE EDGE** behind the scenes. ZapWay closes this catastrophic loophole by verifying the **OUTPUT ACCUMULATION** itself.
          </p>
        </section>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* LEGACY PF Model */}
          <div className="bg-foundation-light/30 border border-yellow-500/30 rounded-xl p-8 space-y-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/40">
                    <Icons.FileText className="h-7 w-7 text-yellow-400" />
                  </div>
                  <h2 className="font-orbitron text-2xl font-bold text-yellow-400 uppercase">Legacy PF Model</h2>
                </div>
                <p className="text-text-secondary font-rajdhani text-base mb-6">
                  The basic commit–reveal architecture suited for simple games (Dice, Plinko). It requires trust in the operator to not tamper with the aggregated data, only verifying the seed for the *single* transaction.
                </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3 tracking-wider text-lg">Failure Points:</h3>
              <ul className="space-y-4 text-text-secondary font-rajdhani text-sm">
                <li className="flex items-start gap-3"><Icons.XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" /><span>**Limited Scope:** Only verifies the fairness of the random number generator (RNG) for a single round.</span></li>
                <li className="flex items-start gap-3"><Icons.XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" /><span>**Trust Assumption:** Requires faith that the operator accurately reports the **global, aggregate RTP** for all rounds played.</span></li>
                <li className="flex items-start gap-3"><Icons.XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" /><span>**No Systemic Audit:** Does not automatically prove the integrity of the total house edge over time.</span></li>
              </ul>
            </div>
          </div>

          {/* ZAPWAY PROTOCOL Column */}
          <div className={`bg-foundation-light/50 border border-neon-surge/50 rounded-xl p-8 space-y-6 shadow-2xl shadow-neon-surge/20 flex flex-col justify-between`}>
            <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-neon-surge/10 p-4 rounded-xl border border-neon-surge/40">
                    <Icons.Shield className="h-7 w-7 text-neon-surge" />
                  </div>
                  <h2 className="font-orbitron text-2xl font-bold text-neon-surge uppercase">ZapWay Protocol</h2>
                </div>
                <p className="text-text-secondary font-rajdhani text-base mb-6">
                  Every result is secured and proven by **ZERO-KNOWLEDGE PROOFS** on a Layer 2 solution. This creates an **immutable and publicly auditable Verifiable Provenance Record (VPR)** for the entire system's history.
                </p>
            </div>
            <div>
              <h3 className={`font-bold text-white mb-3 tracking-wider text-lg ${textGlow}`}>ZapWay Enforcement:</h3>
              <ul className="space-y-4 text-text-secondary font-rajdhani text-sm">
                <li className="flex items-start gap-3"><Icons.Verified className="h-5 w-5 text-neon-surge mt-1 shrink-0" /><span>**Systemic Integrity:** The VPR continuously cross-references the operator's stated RTP against the **actual, proven RNG output aggregate.**</span></li>
                <li className="flex items-start gap-3"><Icons.Verified className="h-5 w-5 text-neon-surge mt-1 shrink-0" /><span>**Real-Time Audits:** We verify the **SYSTEM'S INTEGRITY** in real-time, not just single bets.</span></li>
                <li className="flex items-start gap-3"><Icons.Verified className="h-5 w-5 text-neon-surge mt-1 shrink-0" /><span>**Automated Enforcement:** Deviation from the proven aggregate RNG data instantly flags the disparity across the ZAP Grid.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ZK-Proof Cycle Visual Breakdown */}
        <section className="mt-24">
            <h2 className={`text-center font-orbitron text-3xl sm:text-4xl font-black uppercase mb-12 ${textGlow}`}>
                The ZK-Proof Integrity Cycle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1: Commit */}
                <div className="bg-foundation-light/40 border border-blue-500/30 p-6 rounded-xl text-center transition duration-300 hover:bg-foundation-light/60 hover:shadow-lg hover:shadow-blue-500/10">
                    <Icons.Lock className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                    <h3 className="font-orbitron text-xl font-bold mb-2 text-white">1. Commit & Hash</h3>
                    <p className="text-text-secondary text-sm">
                        The RNG result is created and immediately committed to. Its hash is locked on the L2 chain, creating an immutable commitment block.
                    </p>
                </div>
                
                {/* Step 2: Reveal & Prove */}
                <div className="bg-foundation-light/40 border border-purple-500/30 p-6 rounded-xl text-center transition duration-300 hover:bg-foundation-light/60 hover:shadow-lg hover:shadow-purple-500/10">
                    <Icons.Cpu className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                    <h3 className="font-orbitron text-xl font-bold mb-2 text-white">2. ZK-Proof Generation</h3>
                    <p className="text-text-secondary text-sm">
                        A Zero-Knowledge Proof is generated, mathematically proving the game result derived from the committed hash, without revealing the hash itself.
                    </p>
                </div>
                
                {/* Step 3: Aggregate & Audit */}
                <div className="bg-foundation-light/40 border border-green-500/30 p-6 rounded-xl text-center transition duration-300 hover:bg-foundation-light/60 hover:shadow-lg hover:shadow-green-500/10">
                    <Icons.Activity className="h-10 w-10 text-green-400 mx-auto mb-4" />
                    <h3 className="font-orbitron text-xl font-bold mb-2 text-white">3. Aggregate & Verify</h3>
                    <p className="text-text-secondary text-sm">
                        The L2 Verifiable Provenance Record (VPR) aggregates all ZK-Proofs, creating a real-time, auditable record of the system's *actual* RTP.
                    </p>
                </div>

            </div>
        </section>

        {/* Final CTA */}
        <div className="mt-20 text-center">
            <p className="text-2xl font-black text-white font-orbitron uppercase mb-6">
                Stop <span className="text-warning-low">TRUSTING</span>. Start <span className="text-neon-surge">VERIFYING</span> THE ENTIRE ECOSYSTEM.
            </p>
            <a href="/casino-directory" 
               className={`inline-flex items-center justify-center px-12 py-4 border border-neon-surge/50 text-lg font-bold rounded-full shadow-neon-card uppercase tracking-widest bg-neon-surge/20 text-neon-surge 
                          transition duration-300 transform hover:scale-[1.03] hover:bg-neon-surge/30 ${textGlow} focus:outline-none focus:ring-4 focus:ring-neon-surge/50`}>
                <Icons.Verified className="w-5 h-5 mr-3" />
                Access Certified Platforms
            </a>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDeepDivePage;

