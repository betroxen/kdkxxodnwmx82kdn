import React from 'react';

// --- Placeholder Icon Definitions (for single-file mandate) ---
// These mimic icons from lucide-react or similar libraries.
const Icons = {
    Shield: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
    RefreshCw: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
    Lock: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    Cpu: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>),
    Scale: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16.5V9.5"/><path d="M8 16.5V9.5"/><path d="M12 20.5V2.5"/><path d="M12 9.5a7 7 0 1 0 0 14h-6a7 7 0 1 0 0-14h6z"/></svg>),
    FileCheck: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>),
    Database: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>),
};

// --- Placeholder Card Component ---
const Card: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={`rounded-xl shadow-lg ${className}`}>
        {children}
    </div>
);

// --- ZapStackCard Component ---
const ZapStackCard: React.FC<{ number: string; title: string; children: React.ReactNode; icon: React.FC<any> }> = ({ number, title, children, icon: Icon }) => (
    <div className="bg-foundation border border-[#333] rounded-xl p-6 flex flex-col hover:border-neon-surge/50 transition duration-300 transform hover:translate-y-[-2px] h-full">
        <div className="flex items-center gap-3 mb-4">
            <span className="font-jetbrains-mono text-xl text-neon-surge">{number}</span>
            <Icon className="h-6 w-6 text-neon-surge opacity-80" />
        </div>
        <h3 className="font-orbitron text-lg font-bold text-white uppercase mb-3 tracking-wider">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed font-rajdhani flex-1">{children}</p>
    </div>
);

// --- Main About Us Page Component ---
const AboutUsPage: React.FC = () => {
    return (
        <div className="animate-fadeIn max-w-6xl mx-auto py-12 px-4 font-rajdhani bg-foundation-dark text-text-secondary min-h-screen">

            <header className="text-center mb-16">
                <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                    ZAPWAY // <span className="text-neon-surge">ARCHITECTURE OF INTEGRITY</span>
                </h1>
                <p className="font-jetbrains-mono text-lg text-neon-surge/80 mt-6 max-w-4xl mx-auto p-4 border-l-4 border-neon-surge/50 bg-foundation-light/10">
                    {'>'} THE ZERO-TRUST THESIS: We are here to dismantle the black box of centralized gaming. The traditional model relies on hope and weak promises. ZapWay replaces both with immutable code and verifiable mathematics. We are not a casino; we are the institutional infrastructure enforcing the new crypto standard.
                </p>
            </header>

            <div className="text-center mb-20 p-6 rounded-lg bg-foundation-light/30 shadow-neon-glow">
                <p className="font-orbitron text-xl uppercase tracking-[0.3em] text-neon-surge text-glow">
                    DIRECTIVE: DISMANTLE THE BLACK BOX. ESTABLISH THE NEW STANDARD.
                </p>
            </div>

            <section className="mb-24">
                <div className="text-center mb-12">
                    <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-wider">PHASE ONE: THE ZAP STACK</h2>
                    <h3 className="font-jetbrains-mono text-md text-text-tertiary uppercase tracking-[0.2em] mt-2">// ZERO-TRUST INFRASTRUCTURE</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ZapStackCard number="01" title="ZK-ROLLUP FINALITY" icon={Icons.Shield}>
                        PROOF, NOT PROMISE. Every action is processed on a Layer 2 ZK-Rollup. Results are cryptographically proven, not merely recorded. Instant finality with an immutable on-chain record.
                    </ZapStackCard>
                    <ZapStackCard number="02" title="DECENTRALIZED VRF" icon={Icons.RefreshCw}>
                        AUDITED RANDOMNESS. Game outcomes are powered by audited Verifiable Random Function (VRF) Oracles. This guarantees randomness and ensures provable fairness for every single hand or spin.
                    </ZapStackCard>
                    <ZapStackCard number="03" title="MPC CUSTODY" icon={Icons.Lock}>
                        SELF-CUSTODY DEFENSE. Corporate treasury and player assets are secured by Multi-Party Computation (MPC). This eliminates the single point of failure, enforcing N-of-M multi-signature security for all asset movements.
                    </ZapStackCard>
                    <ZapStackCard number="04" title="SSP REWARD CIRCUIT" icon={Icons.Zap}>
                        SKIN IN THE GAME. ZAPWAY introduces the SSP (Sentinel Score Protocol). Players are rewarded for verified activity and responsible behavior, turning platform participation into a quantifiable, valuable asset.
                    </ZapStackCard>
                </div>
            </section>

            <section className="mb-24">
                 <div className="text-center mb-12">
                    <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-wider">PHASE TWO: SENTINEL PROTOCOLS</h2>
                    <h3 className="font-jetbrains-mono text-md text-text-tertiary uppercase tracking-[0.2em] mt-2">// PLAYER PROTECTION</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-8 bg-foundation-light/20 border border-neon-surge/30 hover:border-neon-surge/70 transition duration-300">
                        <h3 className="font-orbitron text-xl font-bold text-white uppercase mb-6 border-b border-white/20 pb-4 tracking-wider">MODULE A: ETHICAL OVERSIGHT</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-neon-surge mb-2 flex items-center gap-2 text-lg"><Icons.Cpu className="h-5 w-5 mr-1" /> Explainable AI (XAI) Engine</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary pl-6">
                                    <li><strong className="text-white">Purpose:</strong> Proactively monitors and enforces Responsible Gaming limits based on auditable metrics.</li>
                                    <li><strong className="text-white">Transparency:</strong> Every automated intervention is fully transparent and auditable by the user. This fulfils rigorous GDPR Article 22 mandates for transparent automated decision-making. We show the user why a limit was applied.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-neon-surge mb-2 flex items-center gap-2 text-lg"><Icons.Scale className="h-5 w-5 mr-1" /> VASP Compliance and AML/CTF</h4>
                                 <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary pl-6">
                                    <li><strong className="text-white">Standard:</strong> We operate under strict dual-licensing requirements, meeting both iGaming and VASP (Virtual Asset Service Provider) AML/CTF standards.</li>
                                    <li><strong className="text-white">Enforcement:</strong> Zero-tolerance policy for illicit activity. Our systems are built to withstand institutional scrutiny, guaranteeing clean capital flow.</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-8 bg-foundation-light/20 border border-neon-surge/30 hover:border-neon-surge/70 transition duration-300">
                        <h3 className="font-orbitron text-xl font-bold text-white uppercase mb-6 border-b border-white/20 pb-4 tracking-wider">MODULE B: DATA VERIFICATION</h3>
                         <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-neon-surge mb-2 flex items-center gap-2 text-lg"><Icons.FileCheck className="h-5 w-5 mr-1" /> Verifiable Proofs (VPR)</h4>
                                 <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary pl-6">
                                    <li><strong className="text-white">Access:</strong> Every player gets a real-time, zero-delay dashboard to instantly verify the cryptographic proofs (VPR) of their gameplay.</li>
                                    <li><strong className="text-white">Motto:</strong> If you can't prove it, it didn't happen. The player holds the final key to verification.</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-neon-surge mb-2 flex items-center gap-2 text-lg"><Icons.Database className="h-5 w-5 mr-1" /> The Immutable Ledger</h4>
                                 <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary pl-6">
                                    <li><strong className="text-white">Auditability:</strong> All game transaction data is hashed and committed to the Layer 2 chain, creating a public, immutable ledger. This ensures complete, retroactive auditability of platform performance and fairness claims by any external party.</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="mb-12 text-center bg-foundation-light/30 border border-neon-surge/30 p-10 rounded-xl shadow-lg">
                 <div className="text-center mb-8">
                    <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-wider">THE FORWARD DEPLOYMENT</h2>
                    <h3 className="font-jetbrains-mono text-md text-text-tertiary uppercase tracking-[0.2em] mt-2">// ZAPWAY’S MISSION</h3>
                </div>
                <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
                    Our mission is not to capture a market; it's to **upgrade the entire industry**. We partner exclusively with elite operators and protocols, integrating our Provably Fair stack directly onto their platforms. This creates the ZAP Network, bringing a new, non-optional standard of integrity to the wider crypto market.
                </p>
                <div className="my-8 bg-foundation border-y-4 border-neon-surge/70 py-6 px-4">
                    <p className="font-orbitron text-white uppercase tracking-widest"><span className="text-neon-surge font-extrabold">YEAR 1 OBJECTIVE:</span> Establish the ZAP Stack as the default fairness API for all major crypto gaming platforms.</p>
                    <p className="font-orbitron text-white uppercase tracking-widest mt-2"><span className="text-neon-surge font-extrabold">THE METRIC:</span> Replacement of opaque RNG with provable VRF across 80% of partner wagers.</p>
                </div>
                <p className="text-xl font-bold text-white italic font-orbitron">
                    We are not just playing the game. We are the institutional force rewriting the rules.
                </p>
            </section>

             <footer className="text-center font-jetbrains-mono mt-16 space-y-2 border-t border-white/10 pt-6">
                <p className="text-text-tertiary text-sm uppercase tracking-widest">{'>'} TRANSMISSION COMPLETE.</p>
                <p className="text-neon-surge text-xl font-bold uppercase tracking-wider">{'>'} Join the new standard. Join ZapWay.</p>
            </footer>
        </div>
    );
};

export default AboutUsPage;

