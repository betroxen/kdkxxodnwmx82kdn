import React from 'react';

// --- MOCKED DEPENDENCIES for this single-file context ---
// Assuming Card component provides the standard ZapWay UI container look.
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
    <div className={`bg-foundation-light rounded-xl border border-[#333] shadow-lg ${className || ''}`}>
        {children}
    </div>
);
// Note: Unused imports from the original snippet (casinos, AppContext, Icons, etc.) 
// have been removed for a cleaner, production-ready file focused only on this page's logic.
// --------------------------------------------------------

const CopyrightNoticePage: React.FC = () => {
    // Determine the current year dynamically for the copyright notice
    const currentYear = new Date().getFullYear();

    return (
        // Using <main> for semantic structure and setting max width
        <main className="animate-fadeIn max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* The main content wrapper, using the mock Card component for styling */}
            <Card className="p-6 md:p-10 lg:p-12 space-y-8 border-neon-surge/20">
                
                {/* Header Section */}
                <header className="pb-6 border-b border-neon-surge/30">
                    <h1 className="font-orbitron text-2xl md:text-3xl lg:text-4xl font-black text-white text-center uppercase leading-snug tracking-wider">
                        ZAPWAY CORP. OFFICIAL <span className="text-neon-surge text-glow">INTELLECTUAL PROPERTY</span> PROTOCOL
                    </h1>
                    <p className="text-text-tertiary text-sm text-center mt-4 font-jetbrains-mono tracking-wider">
                         &copy; Copyright {currentYear} ZapWay Corp. All Rights Reserved. :: Data Block 01
                    </p>
                </header>

                {/* Content Sections */}
                <div className="mt-8 space-y-10 text-sm leading-relaxed text-text-secondary">
                    
                    {/* Section 1: Copyright Ownership */}
                    <section className="p-4 rounded-lg border border-[#1a1a1a] bg-foundation-light/50">
                        <h2 className="font-orbitron text-lg font-bold text-neon-surge mb-3 tracking-wider">1. COPYRIGHT OWNERSHIP: THE STACK</h2>
                        <p>All content, code, documentation, graphics, logos, designs, architecture, and core technology—including but not limited to the **Zap Rewards Protocol**, the **Protocol Scoreboard**, the **ZK-Rollup Integration methodology**, and all related software source code (collectively, the "Proprietary Material")—are the exclusive property of ZapWay Corp., unless otherwise explicitly stated.</p>
                        <p className="mt-3">This Proprietary Material is protected by international copyright laws and treaties. **Unauthorized reproduction, distribution, public display, or modification is strictly prohibited** and constitutes an infringement of ZapWay Corp.'s rights. We built this; it's ours.</p>
                    </section>

                    {/* Section 2: Trademarks */}
                    <section className="p-4 rounded-lg border border-[#1a1a1a] bg-foundation-light/50">
                        <h2 className="font-orbitron text-lg font-bold text-neon-surge mb-3 tracking-wider">2. TRADEMARKS: THE BRAND SIGNAL</h2>
                        <p>The marks **ZAPWAY®**, **ZAP POINTS™**, **ZP™**, and the associated Zap logo and stylized names are registered or unregistered trademarks and service marks of ZapWay Corp. These are the signal identifiers in the noise.</p>
                        <p className="mt-3">The use of any ZapWay Corp. trademark or service mark without our express written permission is strictly prohibited. You may not use these trademarks in connection with any product or service that is not ours or in any manner that causes confusion or discredits ZapWay Corp.</p>
                    </section>

                    {/* Section 3: Reservation of Rights */}
                    <section className="p-4 rounded-lg border border-[#1a1a1a] bg-foundation-light/50">
                        <h2 className="font-orbitron text-lg font-bold text-neon-surge mb-3 tracking-wider">3. RESERVATION OF RIGHTS: THE FIREWALL</h2>
                        <p>ZapWay Corp. reserves all rights not expressly granted in and to the Proprietary Material and the trademarks. No implicit license or right under any intellectual property is granted by simply accessing our domain or application.</p>
                        <p className="mt-3 text-warning-high font-bold border border-warning-high/50 p-3 rounded-md bg-warning-high/10">WARNING: Any attempt to reverse-engineer, decompile, or otherwise access the proprietary source code of the ZapWay Protocol without a signed institutional agreement is a direct and prosecutable violation of this notice. We take our digital armor seriously.</p>
                    </section>

                    {/* Footer / Contact */}
                    <footer className="border-t border-neon-surge/30 pt-6 mt-12 text-xs font-jetbrains-mono">
                        <p className="font-bold text-white uppercase mb-2">:: INTELLECTUAL PROPERTY CONTACT ::</p>
                        <p className="text-text-tertiary">For inquiries regarding licensing or permissions, use the designated secure channel:</p>
                        <a 
                            href="mailto:compliance@zapway.gg" 
                            className="text-neon-surge hover:text-white hover:underline text-sm font-medium transition-colors tracking-widest"
                        >
                            compliance@zapway.gg
                        </a>
                    </footer>
                </div>
            </Card>
        </main>
    );
};

export default CopyrightNoticePage;

