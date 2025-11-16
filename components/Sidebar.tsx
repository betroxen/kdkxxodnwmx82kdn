import React, { useState, useMemo, useEffect, useContext, createContext, useCallback } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES (MOCKS & DEFINITIONS) ---

// 1. Mock Icons (Using lucide-react equivalents)
const Icons = {
    // Utility
    X: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
    ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
    Search: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
    Shield: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
    // Nav Icons (Mocked for context)
    Activity: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
    LayoutDashboard: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>),
    DollarSign: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
    Users: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    MessageSquare: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
};

// 2. Mock Constants
const sidebarNavItems = [
    {
        group: 'DAS',
        items: [
            { title: 'Dashboard', href: '#dashboard', icon: Icons.LayoutDashboard },
            { title: 'Activity Stream', href: '#activity', icon: Icons.Activity },
        ],
    },
    {
        group: 'CAS',
        items: [
            { title: 'Operator Grid', href: '#grid', icon: Icons.DollarSign },
            { title: 'VPR Submissions', href: '#vpr', icon: Icons.Zap },
        ],
    },
    {
        group: 'SUP',
        items: [
            { title: 'Support Chat', href: '#chat', icon: Icons.MessageSquare },
        ],
    },
    {
        group: 'USER',
        items: [
            { title: 'Profile', href: '#profile', icon: Icons.Users },
        ],
    },
];

const groupLabels: { [key: string]: string } = {
    DAS: 'Dashboard',
    CAS: 'Operations',
    SUP: 'Support & Intel',
    USER: 'Operator'
};

// 3. Mock Contexts
interface AppContextType {
    isLoggedIn: boolean;
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

// Mocking the context hook structure
const AppContext = createContext<AppContextType | undefined>(undefined);
const useApp = () => useContext(AppContext) || {
    isLoggedIn: true,
    currentPage: 'Dashboard',
    setCurrentPage: (page: string) => console.log(`Navigating to: ${page}`)
};

// 4. Mock Components (reusing common patterns)
const ZapLogo: React.FC<{ iconClassName: string, className: string }> = ({ iconClassName, className }) => (
    <div className={className}>
        <Icons.Zap className={iconClassName + " text-neon-surge fill-neon-surge/20"} />
    </div>
);

const Button: React.FC<any> = ({ children, className, onClick, variant, disabled, title }) => {
    const baseStyle = "font-bold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 h-10 flex items-center justify-center";
    let colorStyle = 'bg-neon-surge text-black hover:bg-neon-surge/80 shadow-[0_0_10px_rgba(0,255,192,0.3)]';

    if (variant === 'ghost') {
        colorStyle = 'bg-transparent text-text-tertiary hover:text-white hover:bg-[#333]/50 border border-transparent';
    }

    return (
        <button
            type="button"
            className={`${baseStyle} px-4 text-sm font-orbitron uppercase tracking-wider ${colorStyle} ${className}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
};

const Input: React.FC<any> = ({ as, children, className, ...props }) => {
    const baseStyle = "w-full p-3 rounded-lg bg-[#0c0c0e] border border-[#3a3846] text-white focus:border-neon-surge focus:ring-1 focus:ring-neon-surge transition-all placeholder:text-text-tertiary/50 disabled:opacity-50";

    if (as === 'textarea') {
        return <textarea className={`${baseStyle} ${className}`} {...props}>{children}</textarea>;
    }
    if (as === 'select') {
        return <select className={`${baseStyle} appearance-none ${className}`} {...props}>{children}</select>;
    }

    return <input className={`${baseStyle} ${className}`} {...props} />;
};

const ProgressBar: React.FC<{ progress: number, className?: string }> = ({ progress, className }) => (
    <div className={`w-full h-2 rounded-full overflow-hidden ${className}`}>
        <div 
            className="h-full bg-neon-surge transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
        />
    </div>
);

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

interface SidebarContextType {
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  isActive: false,
  isCollapsed: false,
});

// SidebarLink component is critical for navigation styling
const SidebarLink: React.FC<{ 
    href: string; 
    icon: React.FC<any>; 
    children: React.ReactNode; 
    isMobile?: boolean; 
    onClick?: (e: React.MouseEvent) => void 
}> = React.memo(({ href, icon: Icon, children, isMobile, onClick, ...props }) => {
  const { isActive, isCollapsed } = useContext(SidebarContext);
  
  // Use useMemo for complex class string generation
  const linkClasses = useMemo(() => {
    const base = `group flex items-center gap-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] font-medium relative overflow-hidden rounded-md`;
    const layout = isCollapsed 
        ? 'justify-center mx-2 px-2 py-3' 
        : isMobile 
            ? 'px-5 py-4 text-sm font-orbitron uppercase tracking-wider' 
            : 'mx-4 px-4 py-3 text-sm';
    const state = isActive 
        ? 'text-white bg-neon-surge/10' 
        : 'text-text-secondary hover:bg-foundation-light hover:text-white';
    
    return `${base} ${layout} ${state}`;
  }, [isActive, isCollapsed, isMobile]);


  return (
    <a
      href={href}
      onClick={onClick}
      className={linkClasses}
      role="link"
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
       {/* Active Indicator Bar */}
       <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ease-out ${isActive ? 'bg-neon-surge shadow-[0_0_12px_#00FFC0]' : 'bg-transparent'}`} />

      <Icon 
        className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-neon-surge' : 'group-hover:text-white'}`} 
        aria-hidden="true" 
      />
      
      {/* Text Label, hidden when collapsed */}
      <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>
          {children}
      </span>
    </a>
  );
});

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

/**
 * ZAP Protocol Sidebar: Handles navigation for desktop (collapsed/expanded) and mobile (drawer).
 */
export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const appContext = useApp();
    const { isLoggedIn, currentPage } = appContext;

    // Use useCallback for handler functions
    const handleNavClick = useCallback((e: React.MouseEvent, page: string) => {
        e.preventDefault();
        appContext.setCurrentPage(page);
        setIsMobileOpen(false);
    }, [appContext, setIsMobileOpen]);
    
    // MobilePilotSummary is only rendered once per render cycle, but extracted for clarity.
    const MobilePilotSummary = useMemo(() => (
        <div className="p-5 bg-foundation-light/50 border-b border-[#333]">
             <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <img
                    src="https://placehold.co/56x56/00FFC0/000000?text=DG"
                    alt="Pilot Profile"
                    className="h-14 w-14 rounded-xl border border-[#333]"
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-neon-surge rounded-full border-4 border-foundation-light"></div>
                </div>
                <div>
                    <div className="font-orbitron text-white uppercase text-sm tracking-wider">DegenGambler</div>
                    <div className="text-[10px] font-jetbrains-mono text-neon-surge flex items-center gap-2 mt-1">
                        <Icons.Shield className="h-3 w-3" /> LVL 42 OPERATOR
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-jetbrains-mono text-text-tertiary uppercase">
                    <span>XP TO NEXT LEVEL</span>
                    <span className="text-white">4,250 / 5,000</span>
                </div>
                <ProgressBar progress={85} className="h-1.5 bg-foundation" />
            </div>
        </div>
    ), []);


    return (
    <>
      {/* === MOBILE DRAWER OVERLAY (z-index 80) === */}
      <div 
        className={`fixed inset-0 top-16 z-[80] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileOpen(false)} 
        aria-hidden="true" 
      />

      {/* === MOBILE DRAWER CONTAINER (z-index 90) === */}
      <div className={`fixed left-0 top-0 bottom-0 z-[90] w-[85vw] max-w-[300px] md:hidden transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="h-full pt-16 flex flex-col bg-foundation border-r border-[#333] shadow-2xl">
             
             {/* Profile Summary - Mobile */}
             <div className="shrink-0">
                 {isLoggedIn && MobilePilotSummary}
             </div>

             {/* Navigation Links - Mobile */}
             <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
                <nav className="flex flex-col gap-6">
                    {sidebarNavItems.map((group) => (
                    <div key={group.group}>
                        <h3 className="font-jetbrains-mono text-[10px] uppercase tracking-widest text-text-tertiary mb-2 ml-5">
                             // {groupLabels[group.group] || group.group}
                        </h3>
                        <div className="flex flex-col gap-px">
                        {group.items.map((item) => (
                            <SidebarContext.Provider key={item.title} value={{ isActive: currentPage === item.title, isCollapsed: false }}>
                                <SidebarLink
                                    href={item.href}
                                    icon={item.icon}
                                    isMobile={true}
                                    onClick={(e) => handleNavClick(e, item.title)}
                                >
                                    {item.title}
                                </SidebarLink>
                            </SidebarContext.Provider>
                        ))}
                        </div>
                    </div>
                    ))}
                </nav>
             </div>

             {/* Footer Button - Mobile */}
             <div className="shrink-0 p-4 border-t border-[#333] bg-foundation pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <Button
                    variant="ghost"
                    className="w-full font-orbitron uppercase text-xs tracking-wider text-text-secondary hover:text-white border border-[#333] hover:bg-foundation-light h-11"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <Icons.X className="h-4 w-4 mr-2" /> CLOSE TERMINAL
                </Button>
             </div>
         </div>
      </div>

      {/* === DESKTOP SIDEBAR (z-index 40) === */}
      <aside 
        className={`hidden md:flex fixed left-0 top-0 bottom-0 flex-col flex-shrink-0 border-r border-[#333] bg-foundation transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-40
        ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
      >
        {/* Header/Logo */}
        <div className="flex items-center h-16 shrink-0 px-4 border-b border-[#333]">
          <button onClick={() => appContext.setCurrentPage('Dashboard')} className="flex items-center gap-3 group w-full" aria-label="Go to Dashboard">
            <ZapLogo iconClassName="h-6 w-6" className="p-2"/>
            {!isCollapsed && <span className="font-orbitron text-xl font-bold text-white tracking-wider group-hover:text-neon-surge transition-colors">ZAP</span>}
          </button>
        </div>

        {/* Search & Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
            
            {/* Search Input */}
            <div className={`mb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <div className="relative group">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary h-4 w-4 group-focus-within:text-neon-surge transition-colors" />
                    <Input 
                        placeholder={isCollapsed ? "" : "SEARCH INTEL..."} 
                        className={`bg-foundation-light border-[#333] text-xs font-jetbrains-mono h-9 focus:border-neon-surge transition-all ${isCollapsed ? 'pl-3 pr-3 text-center' : 'pl-9'}`} 
                        aria-label={isCollapsed ? "Search Intel" : "Search Intel"}
                    />
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="flex flex-col gap-4">
                {sidebarNavItems.map((group) => (
                <div key={group.group}>
                    {!isCollapsed && (
                    <h3 className="font-jetbrains-mono text-[10px] uppercase tracking-widest text-text-tertiary px-6 mb-2">
                        // {groupLabels[group.group] || group.group}
                    </h3>
                    )}
                    <div className="flex flex-col gap-px">
                    {group.items.map((item) => (
                        <SidebarContext.Provider key={item.title} value={{ isActive: currentPage === item.title, isCollapsed }}>
                        <SidebarLink
                            href={item.href}
                            icon={item.icon}
                            onClick={(e) => handleNavClick(e, item.title)}
                        >
                            {item.title}
                        </SidebarLink>
                        </SidebarContext.Provider>
                    ))}
                    </div>
                </div>
                ))}
            </nav>
        </div>

        {/* Collapse Button */}
        <div className={`shrink-0 border-t border-[#333] bg-foundation p-2 flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center`}>
             <Button
                variant="ghost"
                className={`text-text-secondary hover:text-white border border-transparent hover:border-[#333] transition-all ${isCollapsed ? 'px-0 w-12 h-12 flex items-center justify-center' : 'w-full flex items-center justify-start gap-2 h-12'}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                aria-expanded={!isCollapsed}
            >
                {isCollapsed ? (
                    <Icons.ChevronRight className="h-5 w-5" />
                ) : (
                    <>
                        <Icons.ChevronLeft className="h-5 w-5" />
                        <span className="font-orbitron uppercase text-xs tracking-wider">COLLAPSE</span>
                    </>
                )}
            </Button>
        </div>
      </aside>
    </>
  );
};

