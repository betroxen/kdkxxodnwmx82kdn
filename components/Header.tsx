import React, { useContext, useState } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Mock AppContext (Simulating the global state provider)
interface AppContextType {
  isCollapsed: boolean;
  setCurrentPage: (page: string) => void;
  // Add other properties if needed for context use in the Header
}
// We initialize it with an undefined type for safety, and provide default mock values
const AppContext = React.createContext<AppContextType | undefined>({
    isCollapsed: false,
    setCurrentPage: (page: string) => console.log(`[Context Mock]: Navigating to ${page}`),
});

// 2. Placeholder Icons (lucide-react equivalents)
const Icons = {
    Menu: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>),
    Edit: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>),
    Mail: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>),
    Gift: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 12 12 12 21"/><path d="M20 12c.98-1.52 1-3.6-1-6.19C17 3 13.5 2 12 2 10.5 2 7 3 5 5.81c-2 2.59-1.98 4.67-1 6.19"/><path d="M12 21v-9"/><path d="M7.5 7.5l.75-3.375"/><path d="M16.5 7.5l-.75-3.375"/><path d="M15 12h5"/><path d="M4 12h5"/></svg>),
    Zap: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    Users: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 17v-2a4 4 0 0 0-4-4h-2"/><path d="M20 7h-2"/></svg>),
    Settings: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>),
    LogOut: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
};

// 3. Placeholder Button Component (Functional minimum)
const Button: React.FC<any> = ({ children, className, onClick, variant, size = 'md' }) => {
    const baseStyle = "font-bold rounded-lg transition-all duration-300 active:scale-[0.98]";
    const sizeStyle = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    
    let colorStyle = 'bg-neon-surge text-black hover:bg-neon-surge/80';
    if (variant === 'ghost') {
        colorStyle = 'bg-transparent text-text-secondary hover:text-white hover:bg-foundation-light/50';
    }

    return (
        <button
            type="button"
            className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// 4. Placeholder ZapLogo Component (Custom SVG)
const ZapLogo: React.FC<{ className?: string, iconClassName?: string }> = ({ className, iconClassName }) => (
    <div className={`flex items-center justify-center bg-neon-surge ${className}`}>
        <Icons.Zap className={`text-black ${iconClassName}`} aria-hidden="true" />
    </div>
);

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

// --- Header Component Definition ---

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenReview?: () => void;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenRegister, isLoggedIn, onLogout, onOpenReview, onToggleMobileNav }) => {
  // Use the mocked context with a safe fallback
  const appContext = useContext(AppContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Determine sidebar width for header alignment
  const sidebarWidth = appContext?.isCollapsed ? '72px' : '256px';

  return (
    <header 
        className={`fixed top-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#333333] bg-foundation-light/80 backdrop-blur-xl px-4 py-3 md:px-6 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${isLoggedIn ? 'md:left-[var(--sidebar-width)] md:w-[calc(100%_-_var(--sidebar-width))]' : 'left-0'}`}
        // Using React.CSSProperties is necessary for injecting CSS variables via style prop
        style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
    >

      {/* Pulsing Neon Glow Line at the top for aesthetic */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-surge/50 to-transparent animate-[pulse-glow_4s_ease-in-out_infinite]"></div>

      <div className="flex items-center gap-4">
         {/* Mobile Menu Toggle for Logged In Users */}
         {isLoggedIn && (
             <button 
                 className="text-text-tertiary hover:text-neon-surge transition-colors md:hidden focus:outline-none" 
                 onClick={onToggleMobileNav} 
                 aria-label="Open Menu"
             >
                 <Icons.Menu className="h-6 w-6" aria-hidden="true" />
             </button>
         )}

         {/* ZAP Logo and Title */}
         <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => appContext?.setCurrentPage(isLoggedIn ? 'Dashboard' : 'Home')}
            role="button" 
            tabIndex={0} 
            aria-label="ZAP Home"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') appContext?.setCurrentPage(isLoggedIn ? 'Dashboard' : 'Home'); }}
        >
             <ZapLogo className="p-1.5 rounded-lg" iconClassName="h-5 w-5" />
             <span className={`font-orbitron text-xl font-bold text-white tracking-wider group-hover:text-neon-surge transition-all ${isLoggedIn ? 'hidden sm:block' : 'block'}`}>ZAP</span>
         </div>
      </div>

      <div className="flex items-center gap-3">
        
        {/* Write VPR Button (Visible only when logged in and on desktop) */}
        {isLoggedIn && onOpenReview && (
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 text-neon-surge hover:text-white hover:bg-neon-surge/10 font-orbitron uppercase" onClick={onOpenReview}>
                <Icons.Edit className="h-4 w-4" aria-hidden="true" /> Write VPR
            </Button>
        )}

        {!isLoggedIn ? (
          /* Authentication Buttons (Logged Out State) */
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={onOpenLogin} className="hidden sm:flex font-orbitron uppercase text-white hover:text-neon-surge">
              LOG IN
            </Button>
            <Button size="sm" onClick={onOpenRegister} className="shadow-[0_0_15px_rgba(0,255,192,0.3)] font-orbitron uppercase tracking-wider">
              JOIN CIRCUIT
            </Button>
          </div>
        ) : (
          /* User Controls (Logged In State) */
          <div className="flex items-center gap-4">
            
            {/* Messages Icon */}
            <button 
                className="text-text-tertiary hover:text-white transition-colors relative hover:scale-110 transform duration-200 focus:outline-none" 
                onClick={() => appContext?.setCurrentPage('Messages')}
                aria-label="Messages"
            >
               <Icons.Mail className="h-5 w-5" aria-hidden="true" />
               <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-neon-surge rounded-full border-2 border-foundation-light"></span> {/* Notification dot */}
            </button>
            
            {/* Rewards Icon */}
            <button 
                className="text-text-tertiary hover:text-white transition-colors hover:scale-110 transform duration-200 focus:outline-none" 
                onClick={() => appContext?.setCurrentPage('Rewards')}
                aria-label="Rewards"
            >
               <Icons.Gift className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Zap Point Balance (Desktop only) */}
            <div className="hidden md:flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5 border border-neon-surge/30 hover:border-neon-surge transition-colors cursor-default" aria-label="Zap Point Balance: 1240">
                <Icons.Zap className="h-3.5 w-3.5 text-neon-surge" aria-hidden="true" />
                <span className="text-xs font-bold text-white font-jetbrains-mono">1,240 ZP</span>
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User Menu"
              >
                <img
                  src="https://placehold.co/32x32/00FFC0/000000?text=DG"
                  alt="Profile"
                  className="h-8 w-8 rounded-md ring-1 ring-neon-surge/50"
                  // Added a better placeholder image for the theme
                  onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src="https://placehold.co/32x32/1E293B/00FFC0?text=DG" }} 
                />
              </button>

              {isProfileDropdownOpen && (
                <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)} aria-hidden="true"></div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-3 w-60 rounded-lg bg-foundation-dark border border-neon-surge/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] py-1 z-40 animate-[fadeIn_0.2s_ease-out] origin-top-right" role="menu">
                        
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-[#333333] bg-foundation-light/20">
                            <p className="text-sm font-bold text-white font-orbitron uppercase">DegenGambler</p>
                            <p className="text-[10px] text-neon-surge font-jetbrains-mono flex items-center gap-1 mt-1">
                                <img src="https://files.catbox.moe/gi909v.webp" alt="VIP Host" className="h-4 w-4" /> LVL 42 OPERATOR
                            </p>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="p-1">
                            <button onClick={() => { appContext?.setCurrentPage('Profile'); setIsProfileDropdownOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-xs text-text-secondary hover:bg-neon-surge/10 hover:text-white transition-colors font-orbitron uppercase rounded-md" role="menuitem">
                                <Icons.Users className="h-4 w-4 text-neon-surge/80" aria-hidden="true" /> Profile Blueprint
                            </button>
                            <button onClick={() => { appContext?.setCurrentPage('Settings'); setIsProfileDropdownOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-xs text-text-secondary hover:bg-neon-surge/10 hover:text-white transition-colors font-orbitron uppercase rounded-md" role="menuitem">
                                <Icons.Settings className="h-4 w-4 text-neon-surge/80" aria-hidden="true" /> Command Console
                            </button>
                        </div>
                        
                        {/* Logout */}
                        <div className="border-t border-[#333333] p-1">
                             <button onClick={() => { onLogout(); setIsProfileDropdownOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 hover:text-white transition-colors font-orbitron uppercase rounded-md" role="menuitem">
                                <Icons.LogOut className="h-4 w-4 text-red-500" aria-hidden="true" /> Terminate Session
                            </button>
                        </div>
                    </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

