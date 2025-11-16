import React, { ReactNode } from 'react';
import { ToastProvider, useToast } from './src/components/Toaster'; 
import { AppwriteAuthProvider, useAppwriteAuth } from './src/context/AppwriteAuthContext';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { Models } from 'appwrite'; // Import Models for user type hint

// --- START: STUB COMPONENTS & MODALS (To ensure immediate compilation) ---

// Define Page Key Type for strict routing
type PageKey = 
    | 'home' | 'dashboard' | 'Mines Game' | 'Plinko Game' | 'About Us' | 'Analytics'
    | 'Terms of Service' | 'Privacy Policy' | 'Responsible Gaming' | 'AML & CTF Policy'
    | 'Commercial Disclosure' | 'Profile' | 'Settings' | 'Messages' | 'Rewards'
    | 'Casino Directory' | 'Bonus Offers' | 'Live RTP Tracker' | 'Review Methodology'
    | 'Provably Fair' | 'Support' | 'Cookies Policy' | 'Certified Platforms' | 'Affiliate Program'
    | 'Copyright Notice' | 'FAQ' | 'Protocol Deep Dive' | 'Partner Vetting';


// --- MODALS ---

const AuthModal: React.FC = () => {
    const { isAuthModalOpen, authModalInitialTab, closeAuthModal } = useAppContext();
    const { login } = useAppwriteAuth(); 
    if (!isAuthModalOpen) return null;

    // Mock login/register handlers
    const handleLogin = async () => {
        try {
            // Mock a successful login (using hardcoded credentials for demonstration)
            await login('operator@zapway.io', 'password123'); 
            closeAuthModal();
        } catch (e) {
            console.error("Login Failed:", e);
            // In a real scenario, display an error toast here
        }
    }

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-neon-surge shadow-neon-glow w-full max-w-sm p-6 rounded-lg font-jetbrains-mono">
                <h2 className="text-xl font-bold mb-4 text-neon-surge uppercase">
                    {authModalInitialTab === 'login' ? 'Access Protocol' : 'Register Operator'}
                </h2>
                <div className="space-y-4">
                    <input className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:border-neon-surge focus:ring-1 focus:ring-neon-surge" placeholder="Cypher ID / Email" />
                    <input type="password" className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:border-neon-surge focus:ring-1 focus:ring-neon-surge" placeholder="Passcode" />
                    <button 
                        onClick={handleLogin}
                        className="w-full py-2 bg-neon-surge text-black font-bold rounded hover:bg-neon-surge/80 transition-colors uppercase"
                    >
                        {authModalInitialTab === 'login' ? 'Execute Login' : 'Create Account'}
                    </button>
                    <button 
                        onClick={closeAuthModal} 
                        className="w-full text-sm text-gray-400 hover:text-white mt-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewModal: React.FC = () => {
    const { isReviewModalOpen, initialReviewCasinoId, closeReviewModal } = useAppContext();
    if (!isReviewModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-yellow-500 w-full max-w-md p-6 rounded-lg font-jetbrains-mono text-white">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Review Protocol: Casino {initialReviewCasinoId || '[ID N/A]'}</h2>
                <textarea className="w-full h-24 p-2 bg-gray-800 border border-gray-700 text-white rounded focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500" placeholder="Enter your system evaluation here..."></textarea>
                <div className="flex justify-end space-x-2 mt-4">
                    <button 
                        onClick={closeReviewModal} 
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={closeReviewModal} 
                        className="px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
                    >
                        Transmit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- PAGES ---

const CasinoDetailPage: React.FC<{ casinoId: string, onBack: () => void, onOpenReview: () => void }> = ({ casinoId, onBack, onOpenReview }) => (
    <div className="p-8">
        <button onClick={onBack} className="text-neon-surge mb-4 flex items-center hover:underline">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Directory
        </button>
        <h1 className="text-4xl font-orbitron text-yellow-400 mb-6 uppercase">Casino Protocol: {casinoId}</h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
            Detailed analysis of target platform {casinoId}. Status: LIVE.
        </p>
        <button 
            onClick={onOpenReview}
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition-all uppercase"
        >
            Log Review
        </button>
    </div>
);

const HomePage: React.FC = () => {
    const { openAuthModal } = useAppContext();
    return (
        <div className="p-8">
            <h1 className="text-4xl font-orbitron text-neon-surge mb-6 uppercase">Zapway Intel Grid // Public Access</h1>
            <p className="text-gray-400 mb-8 max-w-2xl">
                This sector provides passive data feeds. Authentication is required to access proprietary analytics and execute terminal commands. Secure your session, Operator.
            </p>
            <div className="flex space-x-4">
                <button 
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-3 bg-neon-surge text-black font-bold rounded-lg shadow-lg hover:bg-neon-surge/80 transition-all uppercase"
                >
                    Login (Secure Access)
                </button>
                <button 
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-3 border border-neon-surge text-neon-surge font-bold rounded-lg hover:bg-neon-surge/20 transition-all uppercase"
                >
                    Register (New Operator)
                </button>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user } = useAppwriteAuth();
    const { navigate } = useAppContext();
    const { addToast } = useToast();

    return (
        <div className="p-8">
            <h1 className="text-4xl font-orbitron text-green-400 mb-6 uppercase">Operator Dashboard // Active</h1>
            <p className="text-gray-400 mb-8 max-w-2xl font-jetbrains-mono">
                Welcome back, {(user as Models.User)?.name || 'Operator'}. Mission status: Green.
            </p>
            
            <button 
                onClick={() => navigate('Casino Directory' as PageKey)}
                className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg shadow-lg hover:bg-green-400 transition-all uppercase mr-4"
            >
                View Casino Directory
            </button>

             <button 
                onClick={() => addToast({ type: 'info', title: 'Data Alert', message: 'Mission Control is requesting updated telemetry.', duration: 4000 })}
                className="px-6 py-3 border border-gray-500 text-gray-400 font-bold rounded-lg hover:bg-gray-500/20 transition-all uppercase"
            >
                Test Alert
            </button>
        </div>
    );
};

// Generic Page Stub Component
const GenericPage: React.FC<{ title: string, requiredAuth: boolean }> = ({ title, requiredAuth }) => (
    <div className="p-8">
        <h1 className={`text-4xl font-orbitron mb-6 uppercase ${requiredAuth ? 'text-blue-400' : 'text-gray-400'}`}>{title}</h1>
        <p className="text-gray-400 max-w-2xl font-jetbrains-mono">
            // This sector is under construction. Data stream placeholder active.
        </p>
    </div>
);

// Map all remaining pages to the Generic Stub for compilation
const MinesGamePage = () => <GenericPage title="Mines Game // Execution" requiredAuth={true} />;
const PlinkoGamePage = () => <GenericPage title="Plinko Game // Execution" requiredAuth={true} />;
const AboutUsPage = () => <GenericPage title="About Us // Manifesto" requiredAuth={false} />;
const AnalyticsPage = () => <GenericPage title="Analytics // Deep Scan" requiredAuth={true} />;
const TermsOfServicePage = () => <GenericPage title="Terms of Service // Legal Code" requiredAuth={false} />;
const PrivacyPolicyPage = () => <GenericPage title="Privacy Policy // Data Segregation" requiredAuth={false} />;
const ResponsibleGamingPage = () => <GenericPage title="Responsible Gaming // Protocol" requiredAuth={false} />;
const AMLPolicyPage = () => <GenericPage title="AML & CTF Policy // Compliance" requiredAuth={false} />;
const CommercialDisclosurePage = () => <GenericPage title="Commercial Disclosure // Transparency" requiredAuth={false} />;
const ProfilePage = () => <GenericPage title="Profile // Operator Identity" requiredAuth={true} />;
const SettingsPage = () => <GenericPage title="Settings // System Config" requiredAuth={true} />;
const MessagesPage = () => <GenericPage title="Messages // Encrypted Comms" requiredAuth={true} />;
const RewardsPage = () => <GenericPage title="Rewards // Incentive Matrix" requiredAuth={true} />;
const CasinoDirectoryPage = () => <GenericPage title="Casino Directory // Target List" requiredAuth={true} />;
const BonusOffersPage = () => <GenericPage title="Bonus Offers // Data Feed" requiredAuth={true} />;
const LiveRTPTrackerPage = () => <GenericPage title="Live RTP Tracker // Realtime Telemetry" requiredAuth={true} />;
const ReviewMethodologyPage = () => <GenericPage title="Review Methodology // Audit Protocol" requiredAuth={false} />;
const ProvablyFairPage = () => <GenericPage title="Provably Fair // Verification Engine" requiredAuth={false} />;
const SupportPage = () => <GenericPage title="Support // Comms Channel" requiredAuth={false} />;
const CookiesPolicyPage = () => <GenericPage title="Cookies Policy // Data Logging" requiredAuth={false} />;
const CertifiedPlatformsPage = () => <GenericPage title="Certified Platforms // Approved Targets" requiredAuth={false} />;
const AffiliatePage = () => <GenericPage title="Affiliate Program // Network Matrix" requiredAuth={false} />;
const CopyrightNoticePage = () => <GenericPage title="Copyright Notice // Legal Assets" requiredAuth={false} />;
const FAQPage = () => <GenericPage title="FAQ // Standard Queries" requiredAuth={false} />;
const ProtocolDeepDivePage = () => <GenericPage title="Protocol Deep Dive // Architecture" requiredAuth={false} />;
const PartnerVettingPage = () => <GenericPage title="Partner Vetting // Security Audit" requiredAuth={false} />;


// --- APPLICATION SHELL COMPONENTS ---

const Header: React.FC = () => {
    const { isCollapsed, setIsCollapsed, setIsMobileOpen, openAuthModal } = useAppContext();
    const { isAuthenticated, logout } = useAppwriteAuth();

    return (
        <header className="fixed top-0 w-full z-30 flex justify-between items-center h-16 bg-gray-950 border-b border-neon-surge/30 px-4 md:px-8 shadow-2xl">
            <div className="flex items-center">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-2 text-neon-surge hover:text-white transition-colors mr-4"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden p-2 text-neon-surge hover:text-white transition-colors"
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <span className="text-2xl font-orbitron text-neon-surge ml-4">ZAPWAY INTEL</span>
            </div>
            
            <nav className="flex space-x-4 font-jetbrains-mono text-sm items-center">
                {isAuthenticated ? (
                    <button 
                        onClick={logout} 
                        className="text-red-400 hover:text-red-300 transition-colors border border-red-700/50 px-3 py-1 rounded"
                    >
                        LOGOUT
                    </button>
                ) : (
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => openAuthModal('login')} 
                            className="text-gray-300 hover:text-neon-surge transition-colors hidden sm:block"
                        >
                            LOGIN
                        </button>
                        <button 
                            onClick={() => openAuthModal('register')} 
                            className="text-gray-300 hover:text-neon-surge transition-colors"
                        >
                            REGISTER
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

const navLinks: { page: PageKey, label: string, requiresAuth: boolean, icon: string }[] = [
    { page: 'home', label: 'Home Sector', requiresAuth: false, icon: '🏠' },
    { page: 'dashboard', label: 'Dashboard // Ops', requiresAuth: true, icon: '📊' },
    { page: 'Profile', label: 'Profile', requiresAuth: true, icon: '👤' },
    { page: 'Settings', label: 'Settings', requiresAuth: true, icon: '⚙️' },
    { page: 'Messages', label: 'Messages', requiresAuth: true, icon: '📧' },
    { page: 'Rewards', label: 'Rewards', requiresAuth: true, icon: '🎁' },
    { page: 'Mines Game', label: 'Mines Game', requiresAuth: true, icon: '💣' },
    { page: 'Plinko Game', label: 'Plinko Game', requiresAuth: true, icon: '🟢' },
    { page: 'Casino Directory', label: 'Casino Directory', requiresAuth: true, icon: '🎰' },
    { page: 'Bonus Offers', label: 'Bonus Offers', requiresAuth: true, icon: '💰' },
    { page: 'Live RTP Tracker', label: 'Live RTP Tracker', requiresAuth: true, icon: '📈' },
    { page: 'Certified Platforms', label: 'Certified Platforms', requiresAuth: false, icon: '✅' },
    { page: 'Review Methodology', label: 'Review Methodology', requiresAuth: false, icon: '🔬' },
    { page: 'Partner Vetting', label: 'Partner Vetting', requiresAuth: false, icon: '🛡️' },
    { page: 'Provably Fair', label: 'Provably Fair', requiresAuth: false, icon: '🧮' },
    { page: 'Protocol Deep Dive', label: 'Protocol Deep Dive', requiresAuth: false, icon: '💻' },
    { page: 'Support', label: 'Support', requiresAuth: false, icon: '💬' },
    { page: 'FAQ', label: 'FAQ', requiresAuth: false, icon: '❓' },
    { page: 'About Us', label: 'About Us', requiresAuth: false, icon: '📝' },
    { page: 'Affiliate Program', label: 'Affiliate Program', requiresAuth: false, icon: '🔗' },
    { page: 'Terms of Service', label: 'Terms of Service', requiresAuth: false, icon: '📜' },
    { page: 'Privacy Policy', label: 'Privacy Policy', requiresAuth: false, icon: '🔒' },
    { page: 'Cookies Policy', label: 'Cookies Policy', requiresAuth: false, icon: '🍪' },
    { page: 'Responsible Gaming', label: 'Responsible Gaming', requiresAuth: false, icon: '⚖️' },
    { page: 'AML & CTF Policy', label: 'AML & CTF Policy', requiresAuth: false, icon: '🏦' },
    { page: 'Commercial Disclosure', label: 'Commercial Disclosure', requiresAuth: false, icon: '🏷️' },
    { page: 'Copyright Notice', label: 'Copyright Notice', requiresAuth: false, icon: '©️' },
];

const Sidebar: React.FC = () => {
    const { currentPage, navigate, isCollapsed, isMobileOpen, setIsMobileOpen } = useAppContext();
    const { isAuthenticated } = useAppwriteAuth();

    const links = navLinks.filter(link => !link.requiresAuth || isAuthenticated);

    const baseClass = "p-3 font-jetbrains-mono text-xs uppercase transition-colors flex items-center";
    const activeClass = "bg-neon-surge/20 text-neon-surge border-r-4 border-neon-surge";
    const inactiveClass = "text-gray-400 hover:bg-gray-800/70 hover:text-white";
    
    // Widths for CSS variable compatibility
    const sidebarWidth = isCollapsed ? '72px' : '256px';

    return (
        <>
            {/* Desktop Sidebar (Fixed) */}
            <div 
                className={`hidden lg:block fixed left-0 top-16 h-[calc(100vh-64px)] bg-gray-900 border-r border-neon-surge/30 transition-all duration-300 flex-shrink-0 z-20 overflow-y-auto custom-scrollbar`}
                style={{ width: sidebarWidth }}
            >
                <nav className="pt-6 space-y-1">
                    {links.map((link) => (
                        <button
                            key={link.page}
                            onClick={() => navigate(link.page)}
                            className={`${baseClass} w-full ${currentPage === link.page ? activeClass : inactiveClass} justify-start`}
                        >
                            <span className="text-lg mr-3">
                                {link.icon}
                            </span>
                            <span className={isCollapsed ? 'hidden' : 'block'}>
                                {link.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile Menu (Overlay) */}
            <div 
                className={`fixed inset-0 z-40 lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
            >
                <div className="w-64 h-full bg-gray-900 border-r border-neon-surge/30 p-4 pt-16 overflow-y-auto">
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 mb-4 text-neon-surge hover:text-white absolute top-4 right-4"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <nav className="space-y-2">
                        {links.map((link) => (
                            <button
                                key={link.page}
                                onClick={() => { navigate(link.page); setIsMobileOpen(false); }}
                                className={`${baseClass} w-full ${currentPage === link.page ? activeClass : inactiveClass}`}
                            >
                                <span className="text-lg mr-3">
                                    {link.icon}
                                </span>
                                {link.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div onClick={() => setIsMobileOpen(false)} className="absolute inset-0 bg-black/50"></div>
            </div>
        </>
    );
};

const Footer: React.FC = () => (
    <footer className="w-full bg-gray-950 border-t border-neon-surge/30 p-4 text-center text-xs text-gray-500 font-jetbrains-mono mt-auto">
        &copy; {new Date().getFullYear()} Zapway Intel. All Protocols Reserved. Access Code: 0xDEADBEEF
    </footer>
);

// --- App Router Component ---
const AppRouter: React.FC = () => {
    const { currentPage, isAuthenticated } = useAppContext();
    const protectedPages = navLinks.filter(l => l.requiresAuth).map(l => l.page);
    
    // Redirect unauthenticated users from protected pages to Home
    const resolvedPage = protectedPages.includes(currentPage as PageKey) && !isAuthenticated 
        ? 'home' 
        : currentPage;

    let PageComponent: React.FC | React.FC<{}>;

    // Use a map for cleaner routing logic
    const PageMap: Record<PageKey, React.FC | React.FC<{}>> = {
        'home': HomePage,
        'dashboard': DashboardPage,
        'Mines Game': MinesGamePage,
        'Plinko Game': PlinkoGamePage,
        'About Us': AboutUsPage,
        'Analytics': AnalyticsPage,
        'Terms of Service': TermsOfServicePage,
        'Privacy Policy': PrivacyPolicyPage,
        'Responsible Gaming': ResponsibleGamingPage,
        'AML & CTF Policy': AMLPolicyPage,
        'Commercial Disclosure': CommercialDisclosurePage,
        'Profile': ProfilePage,
        'Settings': SettingsPage,
        'Messages': MessagesPage,
        'Rewards': RewardsPage,
        'Casino Directory': CasinoDirectoryPage,
        'Bonus Offers': BonusOffersPage,
        'Live RTP Tracker': LiveRTPTrackerPage,
        'Review Methodology': ReviewMethodologyPage,
        'Provably Fair': ProvablyFairPage,
        'Support': SupportPage,
        'Cookies Policy': CookiesPolicyPage,
        'Certified Platforms': CertifiedPlatformsPage,
        'Affiliate Program': AffiliatePage,
        'Copyright Notice': CopyrightNoticePage,
        'FAQ': FAQPage,
        'Protocol Deep Dive': ProtocolDeepDivePage,
        'Partner Vetting': PartnerVettingPage,
    };

    PageComponent = PageMap[resolvedPage as PageKey] || HomePage;

    return <PageComponent />;
};

// --- Main Application Layout ---
const MainLayout: React.FC = () => {
    const { isCollapsed, viewingCasinoId, setViewingCasinoId, openReviewModal } = useAppContext();
    const { isAuthenticated, logout } = useAppwriteAuth();

    // Dynamically calculate the margin based on sidebar state
    const sidebarWidth = isCollapsed ? '72px' : '256px';

    return (
        <div className="bg-gray-950 text-white min-h-screen flex flex-col custom-scrollbar">
            {/* Header (Always Visible, Fixed Top) */}
            <Header />

            {/* Sidebar (Fixed on Desktop, Overlay on Mobile) */}
            <Sidebar />

            {/* Content Area */}
            <div
                className={`relative flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:pl-[var(--sidebar-width)]`}
                style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
            >
                {/* Main Content (Pushed down by fixed header) */}
                <main className="flex-grow pt-16 pb-12">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {/* Conditional Rendering for Casino Detail Page */}
                        {viewingCasinoId ? (
                            <CasinoDetailPage
                                casinoId={viewingCasinoId}
                                onBack={() => setViewingCasinoId(null)}
                                // This ensures the Review Modal gets the correct ID
                                onOpenReview={() => openReviewModal(viewingCasinoId)} 
                            />
                        ) : (
                            <AppRouter />
                        )}
                    </div>
                </main>
                
                {/* Footer */}
                <Footer />
            </div>

            {/* Modals are rendered outside the main layout flow */}
            <AuthModal />
            <ReviewModal />
        </div>
    );
}

// --- Root App Component (Wrapped in Providers) ---
const App: React.FC = () => (
    // NOTE: The AppwriteAuthProvider must be outside AppProvider to provide auth state to it.
    <AppwriteAuthProvider>
        <AppProvider>
            <ToastProvider>
                <MainLayout />
            </ToastProvider>
        </AppProvider>
    </AppwriteAuthProvider>
);

export default App;

