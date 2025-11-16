import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// --- PRODUCTION READY DEPENDENCIES (MOCK IMPLEMENTATIONS FOR SINGLE-FILE EXECUTION) ---

// 1. Icon Mock
const Icons = {
    Activity: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Wallet: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6c0 1.1.9 2 2 2h8l2 4 4-2V9h-4z" /></svg>,
    FileText: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-5 4h4a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Lock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V9a2 2 0 012-2h0a2 2 0 012 2v2" /></svg>,
    Users: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-1.5a4.5 4.5 0 00-4.5-4.5h-2a4.5 4.5 0 00-4.5 4.5H4a2 2 0 01-2-2v-2a4 4 0 014-4h12a4 4 0 014 4v2a2 2 0 01-2 2zM12 13a4 4 0 100-8 4 4 0 000 8z" /></svg>,
    Database: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m6-10v10m4-10v10m4-10v10M9 7h6" /></svg>,
    X: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
};

// 2. Context Mocks
type AppContextType = { setCurrentPage: (page: string) => void };
const AppContext = createContext<AppContextType | undefined>(undefined);

type ToastType = 'success' | 'error' | 'info';
type ToastContextType = { showToast: (message: string, type: ToastType) => void };
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Simple Toast Provider for visual feedback
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const getToastColors = (type: ToastType) => {
        switch (type) {
            case 'success': return 'bg-neon-surge text-black border-green-700';
            case 'error': return 'bg-warning-high text-white border-red-700';
            default: return 'bg-blue-600 text-white border-blue-700';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-2xl transition-all duration-300 ${getToastColors(toast.type)} animate-slideIn`}>
                    <div className="flex items-center space-x-3">
                        <span className="font-jetbrains-mono text-sm font-bold">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="text-black opacity-70 hover:opacity-100">
                            <Icons.X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

// 3. Component Mocks (Card, Button, Input, Toggle)

// Card Component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`rounded-xl border border-[#333] bg-foundation ${className}`}>
        {children}
    </div>
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
const Button: React.FC<ButtonProps> = ({ children, loading = false, size = 'md', className = '', ...props }) => {
    const sizeClasses = {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`
                ${sizeClasses[size]}
                rounded-lg font-orbitron transition-all duration-200
                bg-neon-surge text-black hover:bg-white
                disabled:bg-[#333] disabled:text-text-tertiary disabled:cursor-not-allowed
                ${loading ? 'cursor-wait opacity-80' : ''}
                ${className}
            `}
        >
            {loading ? 'Processing...' : children}
        </button>
    );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    as?: 'input' | 'textarea' | 'select';
}

const Input: React.FC<InputProps> = ({ as = 'input', className = '', children, ...props }) => {
    const baseClasses = "w-full rounded-[4px] border border-[#333333] bg-foundation p-3 text-sm text-white font-jetbrains-mono focus:border-neon-surge focus:ring-1 focus:ring-neon-surge outline-none transition-colors duration-200";

    if (as === 'textarea') {
        return <textarea className={`${baseClasses} ${className}`} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}>{children}</textarea>;
    }
    if (as === 'select') {
        return <select className={`${baseClasses} appearance-none cursor-pointer ${className}`} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>{children}</select>;
    }
    return <input type="text" className={`${baseClasses} ${className}`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />;
};


// Toggle Component
interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: React.ReactNode;
    description: React.ReactNode;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => (
    <label className="flex items-start cursor-pointer space-x-4">
        <div 
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${checked ? 'bg-neon-surge' : 'bg-[#333]'}`}
            onClick={() => onChange(!checked)}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
        <div className="flex-1">
            <div className="text-white text-sm">{label}</div>
            <div className="text-text-tertiary mt-0.5">{description}</div>
        </div>
    </label>
);


// --- PAGE SPECIFIC COMPONENTS ---

const IntelCard = ({ title, children, imageSrc, onClick }: { title: string, children: React.ReactNode, imageSrc: string, onClick: () => void }) => (
    <Card className="p-0 bg-foundation-light border-[#333] hover:border-neon-surge group flex flex-col transition-all active:scale-[0.99] cursor-pointer card-lift overflow-hidden" onClick={onClick}>
        {/* Placeholder image uses a custom background for thematic consistency */}
        <div className="relative h-32 bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc})` }}>
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-orbitron font-bold text-base text-white mb-2 uppercase">{title}</h3>
            <p className="font-rajdhani text-xs text-text-secondary mb-6 flex-1">{children}</p>
            <div className="font-jetbrains-mono text-xs text-neon-surge uppercase transition-all flex items-center gap-1 group-hover:text-glow">
                ACCESS INTEL &rarr;
            </div>
        </div>
    </Card>
);

// --- MAIN APPLICATION STRUCTURE ---

// Define a placeholder component to satisfy the AppContext requirement
const AppPlaceholder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Mock page state for the IntelCard links to function visually
    const [currentPage, setCurrentPage] = useState('SupportPage'); 
    const appContextValue = { setCurrentPage: (page: string) => {
        // In a real app, this navigates. Here we simulate the change and show a toast.
        setCurrentPage(page);
        (window as any).showToast(`NAVIGATING TO: ${page}`, 'info');
    }};

    return (
        <AppContext.Provider value={appContextValue}>
            {children}
        </AppContext.Provider>
    );
}


const SupportPageContent: React.FC = () => {
    // Context hook logic is retained, relying on the Mocks defined above
    const appContext = useContext(AppContext);
    const toastContext = useContext(ToastContext);

    // Cast the contexts for immediate use if not null
    const { showToast } = toastContext || { showToast: (msg: string, type: ToastType) => console.log(`Toast: [${type}] ${msg}`) };
    const setCurrentPage = appContext?.setCurrentPage || ((page: string) => console.log(`Navigating to: ${page}`));

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        handle: 'DegenGambler', // Should be read from user session in production
        email: 'user@zap.gg', // Should be read from user session in production
        userId: 'UID-459901', // Should be read from user session in production
        category: 'GENERAL',
        priority: 'STANDARD',
        operator: '',
        subject: '',
        message: '',
        evidenceUrl: '',
        attestData: false,
        attestTc: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle input change naturally
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Mandatory Attestations Check
        if (!formData.attestData || !formData.attestTc) {
             showToast("TRANSMISSION FAILED: Mandatory attestations required.", "error");
             return;
        }

        // 2. Critical Signal Check
        if (formData.priority === 'CRITICAL' && !formData.evidenceUrl) {
            showToast("CRITICAL SIGNAL REQUIRES EVIDENCE URL. Fortify your claim.", "error");
            return;
        }

        // 3. Message Detail Check
        if (formData.message.split('\n').filter(line => line.trim() !== '').length < 3) {
            showToast("DETAILED REPORT (3+ lines) is mandatory. Be precise.", "error");
            return;
        }

        setIsLoading(true);

        // --- Production Note: Here you would call your actual backend API to submit the ticket ---
        setTimeout(() => {
            setIsLoading(false);
            showToast("SIGNAL TRANSMITTED. Ticket #9432 created.", "success");
            // Reset form state, retaining fixed user details
            setFormData(prev => ({ 
                ...prev, 
                category: 'GENERAL', 
                priority: 'STANDARD',
                operator: '',
                subject: '', 
                message: '', 
                evidenceUrl: '', 
                attestData: false, 
                attestTc: false 
            }));
        }, 2000);
    };

    const labelClassName = "block text-xs font-jetbrains-mono uppercase text-neon-surge mb-2";

    const FAQ_FIREWALL = [
        { q: "Why is my ZAP Score not updating?", a: "Scores refresh every 6 hours; check decay flags.", next: "Run manual sync in Diagnostics." },
        { q: "SSP rewards missing—where's my ZP?", a: "Accrual logs in Rewards Tab; delays <24h.", next: "Export ledger CSV for audit." },
        { q: "VPR rejected—how to fix?", a: "Needs timestamped proof; common fail: Missing tx IDs.", next: "Resubmit via Portal." },
        { q: "Operator delisted mid-session?", a: "Veto-triggered; migrate via Grid filters.", next: "Contact operator for salvage." },
        { q: "Privacy breach suspected?", a: "Zero-tolerance; initiate Data Archive request.", next: "privacy@zap.gg for forensic trace." },
    ];

  return (
    <div className="container mx-auto max-w-6xl animate-fadeIn p-4 md:p-0">
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                <Icons.Activity className="h-10 w-10 text-neon-surge" />
                <h1 className="font-orbitron text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">
                    SYSTEM DIAGNOSTIC CONSOLE
                </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
                <p className="text-neon-surge font-jetbrains-mono text-sm uppercase tracking-widest">
                    // STATUS: CLEAR SIGNAL // YOUR EDGE DEPENDS ON FAST ANSWERS
                </p>
                <span className="hidden md:block text-[#333]">|</span>
                <p className="text-text-tertiary font-jetbrains-mono text-xs uppercase">
                    EFFECTIVE DATE: NOVEMBER 09, 2025
                </p>
            </div>
            <Card className="p-6 md:p-8 bg-foundation-light/50 border-neon-surge/30 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,192,0.1)]">
                 <div className="relative z-10">
                    <h2 className="font-orbitron text-xl font-bold text-white mb-4 uppercase">LOCK IN THE LINK: YOUR COMMAND CENTER FOR RESOLUTION</h2>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6 font-rajdhani">
                        Operators, the Grid runs on precision—downtime is the enemy. Our Diagnostic Console delivers rapid, fortified support. We're not gatekeepers; we're your tactical relay. Self-serve first for lightning strikes, or transmit a direct signal for heavy ordnance. Stay sharp: Complete intel accelerates orbits. Incomplete signals? They drift to the void.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: Icons.Activity, title: "SCORE GLITCH?", action: "RTP GUIDE" },
                            { icon: Icons.Wallet, title: "PAYOUT DELAY?", action: "CHECK SYNC" },
                            { icon: Icons.FileText, title: "VPR REJECTED?", action: "REVIEW PROTOCOL" },
                            { icon: Icons.Lock, title: "ACCESS LOCKED?", action: "MFA RESET" }
                        ].map((item, i) => (
                            <button key={i} className="p-3 bg-foundation-light border border-[#333] rounded-xl text-left hover:border-neon-surge transition-all group active:scale-[0.98]">
                                <item.icon className="h-5 w-5 text-text-tertiary group-hover:text-neon-surge mb-2" />
                                <div className="font-orbitron font-bold text-xs text-white uppercase mb-1">{item.title}</div>
                                <div className="font-jetbrains-mono text-[10px] text-neon-surge uppercase group-hover:underline">&gt; {item.action}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(0,255,192,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,192,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </Card>
        </div>

        <section className="mb-16">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-[#333] pb-4">
                <span className="text-neon-surge">01 //</span> INTEL CIRCUIT & PROTOCOL ACCESS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <IntelCard imageSrc="https://placehold.co/600x400/003322/00ffc0?text=KNOWLEDGE" title="KNOWLEDGE BASE" onClick={() => setCurrentPage('Review Methodology')}>
                    Raw Data Library on ZAP mechanics, score pillars, and vetting blueprints.
                </IntelCard>
                <IntelCard imageSrc="https://placehold.co/600x400/331100/ffaa77?text=RG+TOOLS" title="RESPONSIBLE GAMING" onClick={() => setCurrentPage('Responsible Gaming')}>
                    Fortified tools for discipline—timers, loss thresholds, and Unplug maneuvers.
                </IntelCard>
                <IntelCard imageSrc="https://placehold.co/600x400/002244/00ccff?text=LEGAL+MANIFESTO" title="LEGAL MANIFESTO" onClick={() => setCurrentPage('Terms of Service')}>
                    Ironclad dossiers: Terms, Privacy, and Commercial Disclosure.
                </IntelCard>
                <IntelCard imageSrc="https://placehold.co/600x400/1a1a1a/cccccc?text=PARTNERSHIP" title="PARTNERSHIP ARCHIVE" onClick={() => setCurrentPage('Affiliate Program')}>
                    Operator synergy docs, referral blueprints, and revenue loop APIs.
                </IntelCard>
            </div>
        </section>

        <section id="ticket-system" className="mb-16">
             <h2 className="font-orbitron text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-[#333] pb-4">
                <span className="text-neon-surge">02 //</span> DIRECT COMMUNICATION: LINE ACTIVATION
            </h2>

            <Card className="p-0 overflow-hidden border-neon-surge/30 bg-foundation shadow-2xl">
                <div className="bg-foundation-light/50 p-4 border-b border-neon-surge/30 flex items-center justify-between">
                    <span className="font-jetbrains-mono text-sm text-neon-surge uppercase tracking-widest flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-surge opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-surge"></span>
                        </span>
                        SIGNAL STATUS: READY TO TRANSMIT
                    </span>
                </div>

                <div className="p-6 md:p-10">
                    <p className="text-text-secondary mb-10 border-l-4 border-neon-surge pl-4 py-3 bg-neon-surge/5 font-jetbrains-mono text-sm leading-relaxed rounded-md">
                        <strong className="text-neon-surge font-bold uppercase">MISSION DIRECTIVE:</strong> Channel your intel with surgical clarity. Our vanguard team prioritizes fortified signals. Vague transmissions queue longer.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div>
                            <h3 className="text-white font-orbitron font-bold uppercase text-sm mb-6 flex items-center gap-2">
                                <Icons.Users className="h-4 w-4 text-text-tertiary" /> SENDER'S INTEL (The Source)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelClassName}>Your Handle (Alias)</label>
                                    <Input name="handle" value={formData.handle} readOnly />
                                </div>
                                <div>
                                    <label className={labelClassName}>Verified Email *</label>
                                    <Input name="email" type="email" required placeholder="Confirmation vector..." value={formData.email} onChange={handleInputChange} />
                                </div>
                                 <div>
                                    <label className={labelClassName}>ZAP User ID</label>
                                    <Input name="userId" value={formData.userId} readOnly />
                                </div>
                            </div>
                        </div>

                         <div>
                            <h3 className="text-white font-orbitron font-bold uppercase text-sm mb-6 flex items-center gap-2">
                                <Icons.Activity className="h-4 w-4 text-text-tertiary" /> THE SIGNAL (Core Issue)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                 <div>
                                    <label className={labelClassName}>Category *</label>
                                    <Input as="select" name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="DATA">DATA/RTP AUDIT</option>
                                        <option value="ACCOUNT">ACCOUNT/REWARDS</option>
                                        <option value="VETTING">OPERATOR VETTING</option>
                                        <option value="PARTNER">PARTNERSHIP QUERY</option>
                                        <option value="GENERAL">GENERAL INQUIRY</option>
                                    </Input>
                                </div>
                                <div>
                                    <label className={labelClassName}>Priority *</label>
                                    <Input 
                                        as="select" 
                                        name="priority" 
                                        value={formData.priority} 
                                        onChange={handleInputChange}
                                        className={formData.priority === 'CRITICAL' ? '!text-warning-high !border-warning-high/50 !bg-warning-high/10 font-bold' : formData.priority === 'ELEVATED' ? '!text-yellow-500 !border-yellow-500/50 !bg-yellow-500/10' : ''}
                                    >
                                        <option value="STANDARD">STANDARD (48-72h)</option>
                                        <option value="ELEVATED">ELEVATED (24h)</option>
                                        <option value="CRITICAL" className="text-warning-high font-bold">CRITICAL (&lt;4h - EVIDENCE MANDATORY)</option>
                                    </Input>
                                </div>
                                <div>
                                    <label className={labelClassName}>Operator Name</label>
                                    <Input name="operator" placeholder="If applicable..." value={formData.operator} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClassName}>Subject (Mission Summary) *</label>
                                <Input name="subject" required maxLength={100} placeholder="CONCISE VECTOR (MAX 100 CHARS)..." value={formData.subject} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-orbitron font-bold uppercase text-sm mb-6 flex items-center gap-2">
                                <Icons.Database className="h-4 w-4 text-text-tertiary" /> THE RAW DATA CONTRACT (Verification Payload)
                            </h3>
                            <div className="space-y-6">
                                 <div>
                                    <label className={labelClassName}>Detailed Report (Min 3 lines) *</label>
                                    <Input 
                                        as="textarea"
                                        name="message"
                                        required
                                        rows={6}
                                        placeholder="> NARRATE THE BREACH...&#10;> WHAT HAPPENED? WHEN? IMPACT?&#10;> STEPS ALREADY TRIED?"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClassName}>Evidence URL (MANDATORY for CRITICAL)</label>
                                        <Input name="evidenceUrl" type="url" placeholder="SECURE VAULT LINK..." value={formData.evidenceUrl} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className={labelClassName}>Attachments (Optional)</label>
                                        <div className="h-10 w-full rounded-[4px] border border-[#333333] bg-foundation px-3 flex items-center text-xs font-jetbrains-mono text-text-tertiary cursor-not-allowed">
                                            [ UPLOAD DISABLED IN SIMULATOR ]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="bg-foundation/50 p-6 rounded-xl border border-neon-surge/30 shadow-inner">
                            <h3 className="text-neon-surge font-orbitron font-bold uppercase text-sm mb-4 flex items-center gap-2">
                                <Icons.Lock className="h-4 w-4" /> DATA ATTESTATION (MANDATORY CHECKPOINT)
                            </h3>
                            <div className="space-y-4 font-rajdhani text-sm">
                                <Toggle 
                                    checked={formData.attestData} 
                                    onChange={(val) => setFormData(prev => ({...prev, attestData: val}))}
                                    label={<span className="font-bold uppercase text-white">DATA INTEGRITY CONFIRMATION</span>}
                                    description={<span className="font-jetbrains-mono text-xs">I confirm this report contains raw, un-fictionalized data, accurate to my records.</span>}
                                />
                                <div className="h-px bg-[#333] w-full"></div>
                                <Toggle 
                                    checked={formData.attestTc} 
                                    onChange={(val) => setFormData(prev => ({...prev, attestTc: val}))}
                                    label={<span className="font-bold uppercase text-white">T&C CONTRACT ACCEPTANCE</span>}
                                    description={<span className="font-jetbrains-mono text-xs">I accept the ZAP Terms of Service and Privacy Protocol governance.</span>}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full h-14 font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,192,0.5)] transition-transform hover:scale-[1.005] active:scale-100"
                                loading={isLoading}
                                disabled={!formData.attestData || !formData.attestTc}
                            >
                                {isLoading ? 'TRANSMITTING SIGNAL...' : 'ACTIVATE SUPPORT LINE & TRANSMIT'}
                            </Button>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#333]">
                            <div className="text-center">
                                <span className="text-text-tertiary font-orbitron font-bold uppercase text-xs block mb-1">STANDARD ORBIT</span>
                                <span className="text-white font-jetbrains-mono font-bold">48-72 HOURS</span>
                            </div>
                            <div className="text-center">
                                <span className="text-yellow-500 font-orbitron font-bold uppercase text-xs block mb-1">ELEVATED ORBIT</span>
                                <span className="text-white font-jetbrains-mono font-bold">24 HOURS</span>
                            </div>
                             <div className="text-center">
                                <span className="text-warning-high font-orbitron font-bold uppercase text-xs block mb-1">CRITICAL ORBIT</span>
                                <span className="text-white font-jetbrains-mono font-bold">&lt; 4 HOURS (EVIDENCE REQ.)</span>
                            </div>
                        </div>

                    </form>
                </div>
            </Card>
        </section>

        <section className="mb-16">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-[#333] pb-4">
                <span className="text-neon-surge">03 //</span> FAQ FIREWALL: PREEMPTIVE STRIKES
            </h2>
            <Card className="p-0 overflow-hidden bg-foundation/50 border-[#333]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-foundation-light text-xs text-text-tertiary font-jetbrains-mono uppercase tracking-wider border-b border-[#333]">
                            <tr>
                                <th className="p-4 pl-6 min-w-[200px]">Query Vector</th>
                                <th className="p-4 min-w-[250px]">Resolution Signal</th>
                                <th className="p-4 pr-6 min-w-[150px]">Next Orbit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333]">
                            {FAQ_FIREWALL.map((item, i) => (
                                <tr key={i} className="hover:bg-foundation-light transition-colors font-rajdhani">
                                    <td className="p-4 pl-6 font-bold text-white">"{item.q}"</td>
                                    <td className="p-4 text-text-secondary">{item.a}</td>
                                    <td className="p-4 pr-6 font-jetbrains-mono text-neon-surge text-xs uppercase">{item.next}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>

        <div className="text-center text-xs text-text-tertiary font-jetbrains-mono uppercase space-y-2">
            <p>
                <strong className="text-warning-high">NOTE: ABUSE COUNTERMEASURES ACTIVE.</strong> Misuse of CRITICAL priority triggers deprioritization and potential handle flag.
            </p>
        </div>
    </div>
  );
};

// Wrap the main content with the necessary mock providers
const SupportPage: React.FC = () => (
    <ToastProvider>
        <AppPlaceholder>
            <SupportPageContent />
        </AppPlaceholder>
    </ToastProvider>
);

export default SupportPage;

