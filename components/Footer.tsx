import React, { useContext, createContext, useCallback, useMemo } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES (MOCKS & DEFINITIONS) ---

// 1. Mock Icons (Using lucide-react equivalents)
const Icons = {
    // Utility
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    // Social Media Icons
    TwitterX: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.834L14.185 13.62 24 22.846h-7.464l-5.694-6.494L6.903 22.846H3L12.553 11.03 2.14 1.154h8.508l4.757 5.922L18.9 1.153zM16.945 20.32L18.47 18.2H5.083l-1.558 2.12H1.18l8.3-9.58 8.643 9.58h-1.188z"/></svg>),
    Instagram: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4.1 0 0 1 12 16.12a4 4.1 0 0 1-4.12-4.75A4 4.1 0 0 1 12 7.25a4 4.1 0 0 1 4.12 4.12z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>),
    Discord: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.25 0H3.75C1.678 0 0 1.678 0 3.75v16.5C0 22.322 1.678 24 3.75 24h16.5c2.072 0 3.75-1.678 3.75-3.75V3.75C24 1.678 22.322 0 20.25 0zM7.22 18.59c-1.397 0-2.535-1.138-2.535-2.535s1.138-2.535 2.535-2.535 2.535 1.138 2.535 2.535-1.138 2.535-2.535 2.535zm9.56 0c-1.397 0-2.535-1.138-2.535-2.535s1.138-2.535 2.535-2.535 2.535 1.138 2.535 2.535-1.138 2.535-2.535 2.535zm-2.186-6.47c-2.316-1.545-3.882-1.545-6.198 0-.462.308-1.118-.154-1.04-.693.078-.539.734-1.001 1.118-1.233 2.535-1.616 4.708-1.616 7.243 0 .384.232 1.04.694 1.118 1.233.078.539-.578 1.001-1.04.693z"/></svg>),
    Telegram: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.94 13.91l-4.59 4.39c-.58.55-1.07.41-1.28-.48L4.35 10.9c-.31-1.16.89-1.63 1.69-1.32L21 4.79c1.07-.41 1.83.33 1.42 1.41L13.25 12.5c-.38.38-.85.39-1.31.39zM12.92 14.86l2.12 6.54c.2.62.61.64.92.21l1.83-1.67c.3-.27.56-.56.88-.85l-4.04-3.83z"/></svg>),
};

// 2. Mock Contexts
interface AppContextType {
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

// Mocking the context hook structure for reliable access
const AppContext = createContext<AppContextType | undefined>(undefined);
const useApp = (): AppContextType => useContext(AppContext) || {
    // Default values if the context provider is missing (should only happen in dev/test)
    currentPage: 'Dashboard',
    setCurrentPage: (page: string) => console.warn(`App Context not provided. Navigating to: ${page}`)
};

// 3. FooterLink Component Definition
interface FooterLinkProps {
    page: string;
    children: React.ReactNode;
    onClick: (page: string) => void;
}

const FooterLink: React.FC<FooterLinkProps> = React.memo(({ page, children, onClick }) => (
    <li className="text-text-secondary hover:text-neon-surge transition-all duration-200">
        <button 
            onClick={() => onClick(page)} 
            className="text-left w-full text-sm focus:outline-none focus:ring-2 focus:ring-neon-surge focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded-md"
            aria-label={`Maps to ${page}`}
        >
            {children}
        </button>
    </li>
));

FooterLink.displayName = 'FooterLink';


/**
 * ZAP Protocol Footer Component
 * Provides site navigation links and compliance information.
 */
export const Footer: React.FC = () => {
    const appContext = useApp();

    // Use useCallback to memoize the click handler
    const handleLinkClick = useCallback((page: string) => {
        appContext.setCurrentPage(page);
        // Ensure smooth scrolling only if running in a browser environment
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [appContext]); // Only recreate if appContext changes

    // Memoize the social media links for clarity and performance
    const socialLinks = useMemo(() => [
        { Icon: Icons.TwitterX, title: "Follow us on X/Twitter", href: "#x" },
        { Icon: Icons.Instagram, title: "View our Instagram feed", href: "#instagram" },
        { Icon: Icons.Discord, title: "Join the Discord Grid", href: "#discord" },
        { Icon: Icons.Telegram, title: "Join the Telegram Channel", href: "#telegram" },
    ], []);

    return (
        <footer className="bg-[#0A0A0A] border-t border-neon-surge/30 pt-16 pb-8 font-rajdhani">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    {/* Placeholder for zap-logo-text/text-glow effect */}
                    <h1 className="text-7xl font-extrabold tracking-tight uppercase font-orbitron" style={{ textShadow: '0 0 10px rgba(0, 255, 192, 0.6), 0 0 20px rgba(0, 255, 192, 0.4)' }}>
                        ZAP
                    </h1>
                    <p className="text-xl font-semibold text-white mt-1 uppercase tracking-widest font-orbitron">
                        COMMAND CENTER
                    </p>
                    <p className="text-sm text-text-tertiary mt-4 font-jetbrains-mono max-w-lg mx-auto">
                        Gamble Smarter, Not Harder. Your Edge is Data.
                    </p>
                </div>

                {/* Link Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8 border-t border-b border-[#333]/50 py-10 mb-10">
                    
                    {/* Col 1: Intel Core */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-bold text-neon-surge uppercase tracking-wider mb-4 border-l-2 border-neon-surge pl-2" style={{ textShadow: '0 0 5px rgba(0, 255, 192, 0.4)' }}>
                            Intel Core
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink page="Dashboard" onClick={handleLinkClick}>Dashboard</FooterLink>
                            <FooterLink page="Casino Directory" onClick={handleLinkClick}>Casinos</FooterLink>
                            <FooterLink page="Bonus Offers" onClick={handleLinkClick}>Bonuses</FooterLink>
                            <FooterLink page="Live RTP Tracker" onClick={handleLinkClick}>RTP Tracker</FooterLink>
                            <FooterLink page="Affiliate Program" onClick={handleLinkClick}>Affiliates</FooterLink>
                        </ul>
                    </div>

                     {/* Col 2: Protocols */}
                     <div className="col-span-1">
                        <h3 className="text-sm font-bold text-neon-surge uppercase tracking-wider mb-4 border-l-2 border-neon-surge pl-2" style={{ textShadow: '0 0 5px rgba(0, 255, 192, 0.4)' }}>
                            Protocols
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink page="About Us" onClick={handleLinkClick}>About</FooterLink>
                            <FooterLink page="Review Methodology" onClick={handleLinkClick}>Methodology</FooterLink>
                            <FooterLink page="Provably Fair" onClick={handleLinkClick}>Provably Fair</FooterLink>
                            <FooterLink page="Protocol Deep Dive" onClick={handleLinkClick}>Protocol Deep Dive</FooterLink>
                            <FooterLink page="FAQ" onClick={handleLinkClick}>FAQ</FooterLink>
                            <FooterLink page="Support" onClick={handleLinkClick}>Support</FooterLink>
                        </ul>
                    </div>

                    {/* Col 3: Legal Framework */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                        <h3 className="text-sm font-bold text-neon-surge uppercase tracking-wider mb-4 border-l-2 border-neon-surge pl-2" style={{ textShadow: '0 0 5px rgba(0, 255, 192, 0.4)' }}>
                            Legal Framework
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink page="Terms of Service" onClick={handleLinkClick}>Terms of Service</FooterLink>
                            <FooterLink page="Privacy Policy" onClick={handleLinkClick}>Privacy Policy</FooterLink>
                            <FooterLink page="Cookies Policy" onClick={handleLinkClick}>Cookies Policy</FooterLink>
                            <FooterLink page="Responsible Gaming" onClick={handleLinkClick}>Responsible Gaming</FooterLink>
                             <FooterLink page="AML & CTF Policy" onClick={handleLinkClick}>AML/CTF Policy</FooterLink>
                            <FooterLink page="Commercial Disclosure" onClick={handleLinkClick}>Disclosure</FooterLink>
                            <FooterLink page="Copyright Notice" onClick={handleLinkClick}>Copyright Notice</FooterLink>
                        </ul>
                    </div>

                    {/* Col 4: Operational Status */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-2 flex flex-col justify-start">
                         <h3 className="text-sm font-bold text-neon-surge uppercase tracking-wider mb-4 border-l-2 border-neon-surge pl-2" style={{ textShadow: '0 0 5px rgba(0, 255, 192, 0.4)' }}>
                            Operational Status
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed font-jetbrains-mono">
                            ACCESS CODE: <span className="text-white">ZAPWAY-GRID-ONLINE-2.0.1</span>. All transactions and data streams are secured via zero-knowledge proof protocols.
                        </p>
                    </div>
                </div>

                {/* Social Media & Compliance Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-foundation-light border border-neon-surge/40 p-5 rounded-xl mb-8" style={{ boxShadow: '0 0 20px rgba(0, 255, 192, 0.2)' }}>
                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <p className="text-sm text-text-tertiary uppercase font-jetbrains-mono tracking-wider ml-4 hidden md:block">
                            Connect to the Grid
                        </p>
                        {socialLinks.map(({ Icon, title, href }) => (
                            <a 
                                key={title}
                                href={href} 
                                className="text-neon-surge hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-neon-surge/10" 
                                title={title}
                                style={{ textShadow: '0 0 5px rgba(0, 255, 192, 0.5)' }}
                            >
                                <Icon className="h-6 w-6" />
                            </a>
                        ))}
                </div>

                    <div className="bg-red-900/20 border border-red-500/50 text-red-400 font-bold px-4 py-2 rounded-full text-sm font-jetbrains-mono tracking-widest uppercase shadow-md">
                        VETTING PROTOCOL: 18+ ONLY
                    </div>
                </div>

                {/* Copyright/Timestamp */}
                <div className="text-center pt-4 border-t border-[#333]/50">
                    <p className="text-xs text-text-tertiary/50 uppercase font-jetbrains-mono tracking-wider">
                        &copy; {new Date().getFullYear()} ZAPWAY CORP. All rights reserved. <span className="text-neon-surge font-bold">DATA OWNERSHIP SECURED.</span>
                    </p>
                    <p className="text-xs text-text-tertiary/40 mt-1 font-jetbrains-mono tracking-wide">
                        INITIATION DATE: 01.01.2025 | STATUS: GREEN
                    </p>
                </div>
            </div>
        </footer>
    );
};

