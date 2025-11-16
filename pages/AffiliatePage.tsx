import React, { useState, useContext, useEffect } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Placeholder Icons (Minimal set needed for this page)
const Icons = {
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    Database: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>),
    Lock: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
    ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>),
};

// 2. Placeholder Card Component
const Card: React.FC<any> = ({ children, className }) => (
    <div className={`bg-foundation border border-[#333] rounded-xl ${className}`}>
        {children}
    </div>
);

// 3. Placeholder Button Component
const Button: React.FC<any> = ({ children, className, onClick, loading, disabled, size = 'md', type = 'button' }) => {
    const baseStyle = "font-orbitron font-bold rounded-lg transition-all duration-300 active:scale-[0.98]";
    const sizeStyle = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-sm';
    const colorStyle = disabled || loading
        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
        : 'bg-neon-surge text-black hover:bg-neon-surge/80';

    return (
        <button
            type={type}
            className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? 'PROCESSING...' : children}
        </button>
    );
};

// 4. Placeholder Input Component (Handles both input and textarea)
const Input: React.FC<any> = ({ as = 'input', className, ...props }) => {
    const baseStyle = "w-full p-3 bg-foundation-light border border-neon-surge/20 rounded-md text-white placeholder-text-tertiary focus:border-neon-surge focus:ring-1 focus:ring-neon-surge transition-colors duration-200 font-jetbrains-mono text-sm";
    
    if (as === 'textarea') {
        return <textarea className={`${baseStyle} ${className}`} {...props} />;
    }
    return <input className={`${baseStyle} ${className}`} {...props} />;
};

// 5. Placeholder Toggle Component
const Toggle: React.FC<any> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
            <span className="text-sm">{label}</span>
            <span className="text-text-secondary mt-1">{description}</span>
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-surge ${checked ? 'bg-neon-surge' : 'bg-gray-600'}`}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

// 6. Mock Toast Context
// In a real app, this would be defined in a separate file and wrapped around the app.
const ToastContext = React.createContext<{ showToast: (message: string, type: 'success' | 'error' | 'info') => void } | null>(null);

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

// New component for the pillars in Phase One
const PillarCard = ({ icon: Icon, number, title, children }: { icon: React.FC<any>, number: string, title: string, children: React.ReactNode }) => (
    <Card className="p-6 bg-foundation-light/20 border-neon-surge/20 hover:border-neon-surge transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-neon-surge/10 p-3 rounded-lg border border-neon-surge/30">
                <Icon className="h-6 w-6 text-neon-surge" />
            </div>
            <span className="font-jetbrains-mono text-3xl text-neon-surge/50">{number}</span>
        </div>
        <h3 className="font-orbitron text-lg text-white uppercase font-bold mb-3">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed font-rajdhani flex-1">{children}</p>
    </Card>
);

const AffiliatePage: React.FC = () => {
    // Mock the toast functionality as the context provider is not available here
    const showToast = (message: string, type: string) => console.log(`[Toast ${type.toUpperCase()}]: ${message}`);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        handle: '',
        country: '',
        channel: '',
        url: '',
        reach: '',
        audience: '',
        strategy: '',
        dataAccuracy: false,
        consent: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isFormVisible) {
            const formElement = document.getElementById('application-form');
            if (formElement) {
                // Scroll the form into view after it becomes visible
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [isFormVisible]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (field: 'dataAccuracy' | 'consent', value: boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dataAccuracy || !formData.consent) {
            showToast("COMPLIANCE GATE: Both security attestations are mandatory.", "error");
            return;
        }

        // --- Mock API Submission Logic ---
        setIsLoading(true);
        // In a real app, this would be an async function sending data to a server/database
        setTimeout(() => {
            setIsLoading(false);
            showToast("DEPLOYMENT REQUEST ACCEPTED. Vetting Protocol initiated.", "success");
            setFormData({
                fullName: '', email: '', handle: '', country: '',
                channel: '', url: '', reach: '', audience: '',
                strategy: '', dataAccuracy: false, consent: false,
            });
            setIsFormVisible(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2500);
        // ---------------------------------
    };


    const tiers = [
        { tier: 'SENTINEL (T1)', tpsv: '$0 - $50,000', revShare: '25%', access: 'Standard' },
        { tier: 'OPERATOR (T2)', tpsv: '$50,001 - $250,000', revShare: '30%', access: 'Elevated' },
        { tier: 'INFILTRATOR (T3)', tpsv: '$250,001 - $1,000,000', revShare: '35%', access: 'Priority' },
        { tier: 'ARCHITECT (T4)', tpsv: '$1,000,001+', revShare: '40% (Custom)', access: 'Direct Protocol Access & Governance' },
    ];

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto py-12 px-4 font-rajdhani bg-foundation-dark text-text-secondary min-h-screen">
            <header className="text-center mb-16">
                <h1 className="font-orbitron text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    ZAPWAY // <span className="text-neon-surge">SENTINEL PARTNER PROTOCOL</span>
                </h1>
                <p className="font-orbitron text-lg text-neon-surge/80 mt-6 max-w-4xl mx-auto uppercase tracking-widest text-glow">
                    Directive: Partner with the Protocol. Monetize integrity.
                </p>
                <p className="mt-8 text-text-secondary text-lg leading-relaxed max-w-4xl mx-auto">
                    The old affiliate model is built on opaque promises and unreliable tracking. We replace the black box with **verifiable data**. Join an elite cadre of partners rewarded for promoting the most secure and transparent infrastructure in iGaming.
                </p>
            </header>

            <section id="phase-one" className="mb-20">
                <h2 className="font-orbitron text-3xl font-bold text-white mb-10 text-center uppercase tracking-wider border-b-2 border-neon-surge/30 pb-4">
                    PHASE ONE: MONETIZATION ARCHITECTURE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PillarCard icon={Icons.Zap} number="01" title="INDUSTRY-LEADING COMMISSIONS">
                        Benefit from a high-yield, transparent revenue share model. Performance is measured using Layer 2 settled volume, eliminating disputes and guaranteeing payouts based on verifiable transactions.
                    </PillarCard>
                    <PillarCard icon={Icons.Database} number="02" title="REAL-TIME OPERATIONS DASHBOARD">
                        Access a dedicated Sentinel Partner Dashboard with live, immutable data on your referrals’ activity and earnings. No opaque reporting. Trust our math, not just our word.
                    </PillarCard>
                    <PillarCard icon={Icons.Lock} number="03" title="HIGH-VALUE TACTICAL ASSETS">
                        Utilize our high-conversion Tactical Asset Library. Professionally designed banners, deep links, and compliant marketing copy engineered specifically to convert high-value crypto clientele.
                    </PillarCard>
                </div>
            </section>

            <section id="phase-two" className="mb-20">
                <div className="text-center mb-10">
                    <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-wider border-b-2 border-neon-surge/30 pb-4">
                        PHASE TWO: THE REWARD MATRIX
                    </h2>
                    <h3 className="font-jetbrains-mono text-md text-text-tertiary uppercase tracking-[0.2em] mt-2">// PROTOCOL SECURED VOLUME (TPSV)</h3>
                </div>
                <p className="text-center text-text-secondary mb-8 max-w-3xl mx-auto">
                    We are rewarded for the security and integrity we provide. Therefore, our partners are rewarded based on the **Total Protocol Secured Volume (TPSV)** generated by their network—the aggregate value of assets processed and secured by the ZAP Stack.
                </p>
                 <div className="overflow-x-auto bg-foundation-light/20 border border-neon-surge/30 rounded-lg p-2 shadow-lg">
                    <table className="w-full min-w-[600px] text-left font-jetbrains-mono">
                        <thead>
                            <tr className="border-b-2 border-neon-surge/50 text-xs text-text-tertiary uppercase tracking-wider">
                                <th className="p-4">Tier Level</th>
                                <th className="p-4">Monthly TPSV</th>
                                <th className="p-4">Net Revenue Share</th>
                                <th className="p-4">Access Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {tiers.map(tier => (
                                <tr key={tier.tier} className="hover:bg-foundation-light/30 transition-colors">
                                    <td className="p-4 font-bold text-white">{tier.tier}</td>
                                    <td className="p-4 text-text-secondary">{tier.tpsv}</td>
                                    <td className={`p-4 font-bold ${tier.revShare.includes('Custom') ? 'text-yellow-400' : 'text-neon-surge'}`}>{tier.revShare}</td>
                                    <td className="p-4 text-text-secondary">{tier.access}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-center text-xs text-neon-surge font-jetbrains-mono mt-6 uppercase tracking-wider bg-neon-surge/5 border border-neon-surge/20 p-4 rounded-lg">
                    PROTOCOL VERIFICATION: Volume is calculated from Layer 2 settlement data. Your reward is tied to **immutable, on-chain proofs**, not centralized reports. Payouts are settled instantly via smart contract.
                </p>
            </section>

             <section id="phase-three" className="mb-20 text-center bg-foundation-light/20 border border-neon-surge/30 rounded-xl p-10">
                <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-wider">
                    PHASE THREE: ACTIVATION & DEPLOYMENT
                </h2>
                <p className="mt-4 text-lg text-white max-w-xl mx-auto">
                    Ready to plug into the network?
                </p>
                <div className="my-8 text-left max-w-lg mx-auto space-y-4">
                    <p className="flex items-start gap-3"><Icons.ArrowRight className="h-4 w-4 text-neon-surge mt-1 shrink-0" /><span><strong className="text-white">ACCESS THE SENTINEL APPLICATION:</strong> Fill out the initial deployment request form.</span></p>
                    <p className="flex items-start gap-3"><Icons.ArrowRight className="h-4 w-4 text-neon-surge mt-1 shrink-0" /><span><strong className="text-white">VERIFICATION & COMPLIANCE:</strong> Our compliance AI runs a rapid check to ensure VASP readiness.</span></p>
                    <p className="flex items-start gap-3"><Icons.ArrowRight className="h-4 w-4 text-neon-surge mt-1 shrink-0" /><span><strong className="text-white">PROTOCOL ACTIVATION:</strong> Receive your unique tracking code and gain immediate access to the Operations Dashboard and Tactical Asset Library.</span></p>
                </div>
                 <p className="text-sm font-bold text-yellow-400 font-jetbrains-mono uppercase tracking-widest mb-8">We're not looking for volume at all costs. We're looking for quality partners.</p>
                <Button size="lg" className="shadow-neon-glow-md uppercase tracking-widest px-12" onClick={() => setIsFormVisible(true)}>
                    APPLY NOW // INITIATE DEPLOYMENT
                </Button>
            </section>

            {isFormVisible && (
                <section id="application-form" className="py-12">
                    <Card className="p-6 md:p-10 border-neon-surge/50 shadow-2xl bg-foundation-light/30">
                        <div className="text-center mb-10">
                            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                                SENTINEL PARTNER DEPLOYMENT REQUEST
                            </h2>
                            <p className="mt-3 text-sm font-jetbrains-mono text-text-tertiary max-w-2xl mx-auto uppercase">
                                Protocol Status: Active. This is the vetting pipeline for high-value operators. Integrity and proven reach are mandatory.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* Section 1 */}
                            <div>
                                <h3 className="font-orbitron text-xl text-neon-surge mb-6 pb-3 border-b border-[#333] uppercase">
                                    SECTION 1: OPERATOR PROFILE // IDENTIFICATION
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">01. Full Legal Name</label>
                                        <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">For VASP/Compliance records only.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">02. Primary Contact Email</label>
                                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">Secure, actively monitored address.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">03. Preferred Handle</label>
                                        <Input name="handle" value={formData.handle} onChange={handleInputChange} placeholder="Telegram/X" required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">For rapid security alerts.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">04. Country of Operation</label>
                                        <Input name="country" value={formData.country} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">For regulatory profiling.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h3 className="font-orbitron text-xl text-neon-surge mb-6 pb-3 border-b border-[#333] uppercase">
                                    SECTION 2: NETWORK PROFILE // DEPLOYMENT INTELLIGENCE
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">05. Primary Channel</label>
                                        <Input name="channel" value={formData.channel} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">Website, Discord, Media Platform, etc.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">06. Primary URL/Link</label>
                                        <Input name="url" type="url" value={formData.url} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">Public-facing platform.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">07. Monthly Reach</label>
                                        <Input name="reach" type="number" value={formData.reach} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">Unique Visitors / Active Users.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="text-sm font-bold text-white pt-2 self-center">08. Audience Profile</label>
                                        <Input name="audience" value={formData.audience} onChange={handleInputChange} required className="md:col-span-2" />
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono md:col-start-3 md:row-start-1 hidden md:block">Define your core demographic.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h3 className="font-orbitron text-xl text-neon-surge mb-6 pb-3 border-b border-[#333] uppercase">
                                    SECTION 3: PROTOCOL ALIGNMENT // THE MISSION
                                </h3>
                                <label className="text-sm font-bold text-white block mb-2">MANDATORY STRATEGY STATEMENT (MAX 500 CHARS)</label>
                                <p className="text-sm text-text-secondary mb-4">Outline your tactical strategy for promoting ZapWay's Total Protocol Secured Volume (TPSV) value proposition. Focus on how you will leverage our Verifiable Math advantage against opaque traditional systems. Why are you an Architect (T4) partner?</p>
                                <Input as="textarea" name="strategy" value={formData.strategy} onChange={handleInputChange} rows={5} maxLength={500} required className="max-w-full" />
                                <p className="text-right text-xs font-jetbrains-mono text-text-tertiary mt-1">{formData.strategy.length} / 500 chars</p>
                            </div>

                            {/* Confirmation */}
                            <div>
                                <h3 className="font-orbitron text-xl text-neon-surge mb-6 pb-3 border-b border-[#333] uppercase">
                                    DEPLOYMENT CONFIRMATION
                                </h3>
                                <div className="space-y-5 bg-foundation-light/50 p-6 rounded-lg border border-neon-surge/30 shadow-md">
                                    <Toggle
                                        checked={formData.dataAccuracy}
                                        onChange={(val: boolean) => handleToggleChange('dataAccuracy', val)}
                                        label={<span className="font-bold uppercase text-white">DATA ACCURACY ATTESTATION</span>}
                                        description={<span className="font-jetbrains-mono text-xs text-text-secondary">I confirm that all provided data is accurate and verifiable, subjecting it to compliance AI screening.</span>}
                                    />
                                    <div className="h-px bg-[#333]/50 w-full"></div>
                                    <Toggle
                                        checked={formData.consent}
                                        onChange={(val: boolean) => handleToggleChange('consent', val)}
                                        label={<span className="font-bold uppercase text-white">CONSENT & COMPLIANCE AGREEMENT</span>}
                                        description={<span className="font-jetbrains-mono text-xs text-text-secondary">I align with ZapWay's zero-tolerance policy on illicit activity and our commitment to VASP regulatory compliance.</span>}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6">
                                <Button type="submit" size="lg" className="w-full shadow-neon-glow-lg uppercase tracking-widest" loading={isLoading} disabled={isLoading || !formData.dataAccuracy || !formData.consent}>
                                    SUBMIT & AWAIT PROTOCOL VERIFICATION
                                </Button>
                            </div>
                        </form>
                    </Card>
                </section>
            )}

             <footer className="text-center font-jetbrains-mono mt-16 space-y-2 border-t border-white/10 pt-6">
                <p className="text-text-tertiary text-sm uppercase tracking-widest">{'>'} END OF TRANSMISSION.</p>
            </footer>
        </div>
    );
};

export default AffiliatePage;

