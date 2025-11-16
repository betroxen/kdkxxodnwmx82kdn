import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
// --- 1. REAL APPWRITE IMPORTS ---
import { Client, Account, ID, AppwriteException } from 'appwrite';

// =====================================================================
// --- APPWRITE CONFIGURATION ---
// PROJECT ZAPWAY INITIALIZED.
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('zapway'); 

const account = new Account(client);

// IMPORTANT: This URL must be configured in Appwrite's Console (General Settings).
// Appwrite redirects here after the user clicks the verification link in the email.
const VERIFY_REDIRECT_URL = `${window.location.origin}/verify-email`; 

// =====================================================================
// --- CONTEXT & ROUTING SETUP ---
// =====================================================================

const AuthContext = createContext(null);
const RouterContext = createContext(null);

// Custom hook to manage navigation (simulates react-router-dom)
const useRouter = () => useContext(RouterContext);

// Custom hook for authentication state and methods
const useAuth = () => useContext(AuthContext);

// Mock utility functions for the AuthModal to interface with the global context
const useAppContext = () => {
    const { user } = useAuth(); // Global login function
    const { navigate } = useRouter(); // Global navigation

    const localLogin = (userData) => {
        // Since the login function in AuthProvider handles context update and navigation,
        // we just need a confirmation wrapper here.
        navigate('/dashboard'); 
    };

    return {
        globalLogin: localLogin, 
        // This function will be provided by the LoginScreen component controlling the modal
        closeAuthModal: () => console.log("Placeholder: closeAuthModal"), 
    };
};

// =====================================================================
// --- UI COMPONENTS & MOCKS ---
// =====================================================================

// Mock Icons
const Icons = {
    X: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    User: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Mail: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    Lock: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Check: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    AlertTriangle: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.8 18.01A2 2 0 0 0 3.56 21h16.88a2 2 0 0 0 1.76-3.86L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
    Shield: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

const Input = ({ className, onChange, as, ...props }) => {
    const Component = as || 'input';
    const baseStyle = "w-full p-3 bg-foundation border border-[#333] text-white rounded-lg transition-all focus:border-neon-surge focus:ring-1 focus:ring-neon-surge font-jetbrains-mono text-sm";
    return (
        <Component
            className={`${baseStyle} ${className || ''}`}
            onChange={onChange}
            {...props}
        />
    );
};

const Button = ({ children, variant = 'primary', size = 'md', className, loading, ...props }) => {
    let base = "rounded-lg font-orbitron uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    let sizeClass = size === 'lg' ? 'h-12 text-sm px-6' : 'h-10 text-xs px-4';
    let variantClass = '';

    if (variant === 'primary') {
        variantClass = 'bg-neon-surge text-black hover:bg-white hover:shadow-neon-card-hover';
    } else if (variant === 'ghost') {
        variantClass = 'bg-transparent text-text-tertiary hover:text-white';
    }

    return (
        <button className={`${base} ${sizeClass} ${variantClass} ${className || ''}`} {...props}>
            {loading ? <Icons.AlertTriangle className="h-4 w-4 animate-spin" /> : children}
        </button>
    );
};

const ZapLogo = ({ className, iconClassName }) => (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Icons.Check className={`text-neon-surge ${iconClassName}`} />
        <span className="font-orbitron text-xl font-bold text-white tracking-widest">ZAPCORE</span>
    </div>
);

// =====================================================================
// --- 2. AUTH PROVIDER (SESSION PERSISTENCE & STATE) ---
// =====================================================================

const AuthProvider = ({ children }) => {
    const { navigate } = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;

    // 1. Check for persistent session on mount
    const fetchUser = async () => {
        try {
            // Appwrite's get() attempts to restore the session from cookies/storage
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            // Appwrite uses createEmailSession for login
            await account.createEmailSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Failed:', error);
            throw error; // Propagate error for UI feedback
        }
    };

    const register = async (email, password, name) => {
        try {
            // 1. Create user
            const newUser = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // 2. Trigger email verification AFTER user is created
            // IMPORTANT: The redirect URL must be configured in Appwrite Console
            await account.createVerification(VERIFY_REDIRECT_URL); 

            // 3. Log in immediately after successful registration
            await login(email, password);

        } catch (error) {
            console.error('Registration Failed:', error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            // Delete current session
            await account.deleteSession('current');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    };

    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        // Expose account for verification handler
        account
    }), [user, isAuthenticated, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// =====================================================================
// --- 3. PROTECTED ROUTE COMPONENT ---
// =====================================================================

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const { navigate } = useRouter();

    if (isLoading) {
        return <LoadingSpinner message="Authenticating Session..." />;
    }

    if (!isAuthenticated) {
        // Redirect non-authenticated users to login
        useEffect(() => {
            navigate('/login');
        }, [navigate]);
        return null;
    }

    return <>{children}</>;
};

// =====================================================================
// --- 4. AUTH MODAL (ADAPTED TO USE REAL CONTEXT) ---
// =====================================================================

const AuthModal = ({ isOpen, onClose, initialTab }) => {
    // This context call is adapted to the AuthProvider structure
    const { login: globalLoginFn, register: globalRegisterFn } = useAuth();
    const { closeAuthModal } = useAppContext(); // Gets the close function from LoginScreen

    const modalRef = useRef(null);

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [handleAvailable, setHandleAvailable] = useState(true); // Assuming available until checked
    const [isCheckingHandle, setIsCheckingHandle] = useState(false);

    // --- Utility Functions ---

    const calculatePasswordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 12) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()]/.test(password)) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        return score;
    }, [password]);

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength);
    }, [calculatePasswordStrength]);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
        setConfirmPassword('');
        setTermsAccepted(false);
        setPasswordStrength(0);
        setHandleAvailable(true); // Reset to assumed available
        setError('');
        setIsLoading(false);
    }

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            resetForm();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, initialTab, onClose]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const checkHandle = () => {
        if (username.length < 3) {
            setError('');
            setHandleAvailable(true);
            return;
        }
        if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
            setHandleAvailable(false);
            setError('AUTH_ERR: ALIAS FORMAT INVALID (A-Z, 0-9, _)');
        } else {
            setError('');
            setHandleAvailable(true);
        }
    };


    // --- Appwrite Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // --- CLIENT-SIDE VALIDATION PROTOCOL ---
        if (activeTab === 'register') {
            if (!username || !email || !password || !confirmPassword) { setError('AUTH_ERR: ALL FIELDS MANDATORY'); return; }
            if (password !== confirmPassword) { setError('AUTH_ERR: PASSKEY MISMATCH'); return; }
            if (passwordStrength < 3) { setError('AUTH_ERR: PASSKEY STRENGTH INSUFFICIENT (MIN 3/4)'); return; }
            if (!termsAccepted) { setError('AUTH_ERR: AFFIRMATION PROTOCOL REQUIRED'); return; }
            if (handleAvailable === false) { setError('AUTH_ERR: ALIAS FORMAT ERROR'); return; }
        } else if (!email || !password) { setError('AUTH_ERR: CREDENTIALS MISSING'); return; }
        // ------------------------------------

        setIsLoading(true);

        try {
            if (activeTab === 'login') {
                await globalLoginFn(email, password);
            } else {
                await globalRegisterFn(email, password, username);
            }

            // For registration, we only close the modal after success, 
            // but the user is already logged in (pending verification) and redirected to /dashboard.
            closeAuthModal(); 

        } catch (err) {
            // --- REAL FAILURE PROTOCOL ---
            let errorType = 'SYSTEM';
            let message = 'UNKNOWN CRITICAL FAILURE.';

            if (err instanceof AppwriteException) {
                errorType = err.type || 'SDK';
                // Customize Appwrite messages for better UX
                if (err.type === 'user_already_exists') {
                    message = 'ALIAS OR EMAIL TAKEN. Try logging in.';
                } else if (err.type === 'user_unauthorized' || err.type === 'user_not_found') {
                    message = 'PASSKEY OR EMAIL REFUSED. Check credentials.';
                } else {
                    message = err.message.toUpperCase();
                }
            } else {
                 message = err.message || 'UNKNOWN CRITICAL FAILURE.';
            }

            setError(`AUTH_ERR: ${errorType}: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const isLoginValid = email.length > 0 && password.length > 0;
    const isRegisterValid = username.length > 2 && email.length > 0 && password.length >= 12 && password === confirmPassword && termsAccepted && passwordStrength >= 3 && handleAvailable === true;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:py-8 bg-black/80 backdrop-blur-md animate-modal-enter" onClick={handleOutsideClick}>
            <div 
                ref={modalRef} 
                className="relative w-full sm:max-w-md max-h-[95vh] flex flex-col bg-foundation border border-neon-surge/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8),_0_0_20px_rgba(0,255,192,0.2)] overflow-hidden transition-transform duration-300 ease-in-out transform scale-100"
                onClick={e => e.stopPropagation()}
            >
                <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 text-text-tertiary hover:text-neon-surge h-auto p-2 z-20">
                    <Icons.X className="h-5 w-5" />
                </Button>

                <div className="flex-shrink-0 p-6 pt-8 text-center relative z-10 bg-foundation border-b border-[#333]">
                    <ZapLogo className="mx-auto mb-4 inline-block" iconClassName="h-10 w-10 text-glow drop-shadow-[0_0_8px_#00FFC0]" />
                    <h2 className="font-orbitron font-bold text-xl text-white uppercase tracking-widest text-glow">
                        {activeTab === 'login' ? 'WELCOME BACK, OPERATOR' : 'INITIATE NEW PROFILE'}
                    </h2>
                    <p className="text-xs font-jetbrains-mono text-neon-surge mt-2 tracking-wider opacity-80">
                        {activeTab === 'login' ? '// AUTHENTICATION REQUIRED' : '// SECURE YOUR SPOT ON THE GRID'}
                    </p>
                </div>

                <div className="flex border-b border-[#333] sticky top-0 bg-foundation z-10">
                    <button
                        className={`flex-1 py-3 font-orbitron text-xs uppercase tracking-widest transition-colors ${activeTab === 'login' ? 'text-neon-surge border-b-2 border-neon-surge' : 'text-text-secondary hover:text-white'}`}
                        onClick={() => { setActiveTab('login'); resetForm(); }}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-3 font-orbitron text-xs uppercase tracking-widest transition-colors ${activeTab === 'register' ? 'text-neon-surge border-b-2 border-neon-surge' : 'text-text-secondary hover:text-white'}`}
                        onClick={() => { setActiveTab('register'); resetForm(); }}
                    >
                        Register
                    </button>
                </div>

                <div className="p-6 pt-5 overflow-y-auto custom-scrollbar flex-1 bg-foundation-light">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {activeTab === 'register' && (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Alias (Handle)</label>
                                    {!isCheckingHandle && username.length > 0 && (
                                        <span className={`text-xs font-jetbrains-mono uppercase ${handleAvailable ? 'text-neon-surge text-glow' : 'text-warning-high'}`}>
                                            {handleAvailable ? '// FORMAT OK' : '// FORMAT ERROR'}
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Icons.User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${handleAvailable === false ? 'text-warning-high' : 'text-text-tertiary'}`} />
                                    <Input 
                                        placeholder="UNIQUE_ID (A-Z, 0-9, _)" 
                                        value={username} 
                                        onChange={(e) => { 
                                            setUsername(e.target.value); 
                                            setHandleAvailable(true);
                                        }} 
                                        onBlur={checkHandle}
                                        className={`pl-10 ${handleAvailable === false ? '!border-warning-high focus:!ring-warning-high' : ''}`} 
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Email Protocol</label>
                            <div className="relative">
                                <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                <Input type="email" placeholder="OPERATOR@ZAP.GG" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} />
                            </div>
                        </div>

                        <div className="space-y-1">
                             <div className="flex justify-between">
                                <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Passkey</label>
                                {activeTab === 'register' && (
                                    <span className={`text-xs font-jetbrains-mono uppercase transition-colors ${passwordStrength >= 3 ? 'text-neon-surge' : passwordStrength >= 2 ? 'text-yellow-500' : 'text-text-tertiary'}`}>
                                        STRENGTH: {passwordStrength}/4
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                <Input 
                                    type="password" 
                                    placeholder={activeTab === 'register' ? "MIN 12 CHARS (A-Z, 0-9, #$@)" : "••••••••"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="pl-10" 
                                    disabled={isLoading} 
                                />
                            </div>
                        </div>

                        {activeTab === 'register' && (
                            <div className="space-y-1">
                                <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Confirm Passkey</label>
                                <div className="relative">
                                    <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                    <Input 
                                        type="password" 
                                        placeholder="RE-ENTER PASSKEY" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        className={`pl-10 ${password !== confirmPassword && confirmPassword.length > 0 ? '!border-warning-high focus:!ring-warning-high' : ''}`} 
                                        disabled={isLoading} 
                                    />
                                </div>
                                {password !== confirmPassword && confirmPassword.length > 0 && (
                                    <p className="text-xs text-warning-high font-jetbrains-mono mt-1">// PASSKEY VERIFICATION FAILED</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'register' && (
                            <div className="flex items-center space-x-3 pt-2">
                                <input
                                    id="terms-check"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="h-4 w-4 text-neon-surge bg-foundation-light border-neon-surge rounded focus:ring-neon-surge cursor-pointer"
                                    disabled={isLoading}
                                    // Custom styling for the checkbox look
                                    style={{ appearance: 'none', WebkitAppearance: 'none', border: '1px solid var(--color-neon-surge)', backgroundColor: 'var(--color-foundation-light)', transition: 'background-color 0.2s', backgroundImage: termsAccepted ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300FFC0\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M20 6 9 17l-5-5\'/%3E%3C/svg%3E")' : 'none', backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
                                />
                                <label htmlFor="terms-check" className="text-xs font-jetbrains-mono text-text-secondary select-none">
                                    I affirm compatibility with the <span className="text-neon-surge hover:underline cursor-pointer">ZAPCORE Protocol Terms</span>.
                                </label>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 text-sm text-warning-high bg-warning-high/10 border border-warning-high rounded-lg font-jetbrains-mono tracking-wide">
                                <div className="flex items-center">
                                    <Icons.AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="break-words">{error}</span>
                                </div>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg"
                            loading={isLoading}
                            disabled={isLoading || (activeTab === 'login' ? !isLoginValid : !isRegisterValid)}
                            className="mt-6"
                        >
                            {activeTab === 'login' ? 'ACCESS DATASTREAM' : 'EXECUTE REGISTRATION'}
                        </Button>
                    </form>
                </div>

                <div className="flex-shrink-0 p-4 border-t border-[#333] text-center bg-foundation">
                    <button 
                        type="button"
                        onClick={() => {
                            setActiveTab(activeTab === 'login' ? 'register' : 'login');
                            resetForm();
                        }}
                        className="text-xs font-jetbrains-mono text-text-tertiary hover:text-neon-surge transition-colors"
                        disabled={isLoading}
                    >
                        {activeTab === 'login' ? '>> NEED OPERATOR PROFILE? INITIATE REGISTRATION' : '<< ALREADY VESTED? ACCESS LOGIN'}
                    </button>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes modal-enter {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-modal-enter { animation: modal-enter 0.2s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: var(--color-foundation-light); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-neon-surge); border-radius: 3px; }
                .text-glow { text-shadow: 0 0 5px rgba(0, 255, 192, 0.5); }
            `}</style>
        </div>
    );
};

// =====================================================================
// --- 5. PAGE COMPONENTS (DASHBOARD, LOGIN, & VERIFICATION) ---
// =====================================================================

const LoadingSpinner = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <svg className="animate-spin h-8 w-8 text-neon-surge" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-sm font-jetbrains-mono font-medium text-neon-surge animate-pulse">{message}</p>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const isVerified = user?.emailVerification || false;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-foundation p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-neon-surge/30">
                <h1 className="text-3xl font-orbitron font-extrabold text-neon-surge mb-6 text-center text-glow uppercase tracking-widest">
                    DATACENTER ACCESS
                </h1>
                
                {!isVerified && (
                    <div className="p-4 mb-6 bg-warning-high/10 border border-warning-high rounded-lg font-jetbrains-mono text-sm text-warning-high flex items-center gap-3">
                        <Icons.AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold">SECURITY ALERT: EMAIL UNVERIFIED.</span>
                    </div>
                )}

                <p className="text-lg text-white mb-2 font-jetbrains-mono">
                    Status: <span className="font-semibold text-neon-surge">{user?.name || 'Operator'} Logged In.</span>
                </p>
                <div className="bg-gray-700 p-4 rounded-xl text-sm text-gray-300 break-all mb-8 font-jetbrains-mono space-y-2">
                    <p><span className="font-bold text-gray-200">ID:</span> {user?.$id || 'N/A'}</p>
                    <p><span className="font-bold text-gray-200">EMAIL:</span> {user?.email || 'N/A'}</p>
                    <p className="flex items-center gap-2"><span className="font-bold text-gray-200">VERIFICATION:</span> 
                        {isVerified 
                            ? <span className="text-neon-surge flex items-center gap-1"><Icons.Shield className="h-4 w-4" /> SECURE</span>
                            : <span className="text-warning-high flex items-center gap-1"><Icons.AlertTriangle className="h-4 w-4" /> PENDING</span>
                        }
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">// ROUTE PROTECTION CONFIRMED</p>
                </div>
                <Button onClick={logout} size="lg" variant="primary">
                    TERMINATE SESSION
                </Button>
            </div>
        </div>
    );
};

const LoginScreen = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { navigate } = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('login');

    // Redirect authenticated users to dashboard immediately
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return <LoadingSpinner message="Checking Session Status..." />;
    }

    const openModal = (tab) => {
        setInitialTab(tab);
        setIsModalOpen(true);
    }

    // Provide a close function for the modal to use
    const modalContextValue = useMemo(() => ({
        // This is a mock provided to satisfy the AuthModal component's call to useAppContext
        globalLogin: () => {}, 
        closeAuthModal: () => setIsModalOpen(false), 
    }), []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-foundation p-4">
            <div className="w-full max-w-md text-center">
                 <ZapLogo className="mx-auto mb-8 inline-block" iconClassName="h-12 w-12 text-glow drop-shadow-[0_0_8px_#00FFC0]" />
                <h1 className="text-3xl font-orbitron font-extrabold text-white mb-4 tracking-wider">
                    ZAPCORE SECURITY PROTOCOL
                </h1>
                <p className="text-sm font-jetbrains-mono text-text-secondary mb-10">
                    ACCESS TO DATACENTER REQUIRES AUTHENTICATION.
                </p>

                <div className="space-y-4">
                    <Button onClick={() => openModal('login')} size="lg" variant="primary">
                        OPERATOR LOGIN
                    </Button>
                    <Button onClick={() => openModal('register')} size="lg" variant="ghost" className="border border-neon-surge text-neon-surge hover:text-black hover:bg-neon-surge">
                        INITIATE NEW PROFILE
                    </Button>
                </div>
            </div>

            <AuthContext.Provider value={useAuth()}> {/* Pass the real Auth context */}
                <RouterContext.Provider value={{ navigate }}> {/* Pass the router */}
                    <div style={{ visibility: isModalOpen ? 'visible' : 'hidden' }}>
                        <AuthModal 
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            initialTab={initialTab}
                        />
                    </div>
                </RouterContext.Provider>
            </AuthContext.Provider>
        </div>
    );
};

const EmailVerificationHandler = () => {
    const { account, user, isAuthenticated, isLoading } = useAuth();
    const { navigate } = useRouter();

    const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
    const [message, setMessage] = useState('INITIATING VERIFICATION PROTOCOL...');

    useEffect(() => {
        // Only run if account is available (AuthContext is loaded)
        if (!account) return;

        // Function to extract URL params (userId and secret)
        const verifySession = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const secret = urlParams.get('secret');

            if (!userId || !secret) {
                setStatus('failure');
                setMessage('VERIFICATION FAILED: MISSING PROTOCOL KEYS (USERID/SECRET).');
                return;
            }

            try {
                // Call Appwrite to update verification status
                await account.updateVerification(userId, secret);
                
                setStatus('success');
                setMessage('VERIFICATION COMPLETE. DATASTREAM SECURED.');

                // Force a quick session refresh to update the user object's emailVerification status
                await account.get(); 

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);

            } catch (error: any) {
                let errMessage = error.message || 'UNKNOWN VERIFICATION ERROR.';
                if (errMessage.includes('Invalid key')) {
                    errMessage = 'VERIFICATION KEY EXPIRED OR INVALID.';
                }
                setStatus('failure');
                setMessage(`VERIFICATION FAILED: ${errMessage.toUpperCase()}`);
            }
        };

        verifySession();
    }, [account, navigate]);


    const statusClasses = {
        loading: 'text-neon-surge animate-pulse border-neon-surge',
        success: 'text-neon-surge border-neon-surge shadow-neon-card-hover',
        failure: 'text-warning-high border-warning-high shadow-[0_0_20px_rgba(248,113,121,0.5)]',
    };
    
    const icon = {
        loading: <Icons.AlertTriangle className="h-6 w-6 animate-spin" />,
        success: <Icons.Shield className="h-8 w-8" />,
        failure: <Icons.AlertTriangle className="h-8 w-8" />,
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-foundation p-4">
            <div className={`w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border-2 ${statusClasses[status]}`}>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6">{icon[status]}</div>
                    <h1 className="text-2xl font-orbitron font-extrabold text-white mb-3 tracking-wider">
                        EMAIL VERIFICATION
                    </h1>
                    <p className={`text-sm font-jetbrains-mono ${statusClasses[status]}`}>
                        {message}
                    </p>
                    {status === 'success' && (
                        <p className="mt-4 text-xs font-jetbrains-mono text-text-secondary">// REDIRECTING TO DASHBOARD...</p>
                    )}
                    {status === 'failure' && (
                         <Button onClick={() => navigate('/login')} size="md" variant="primary" className="mt-6 bg-warning-high hover:bg-red-700">
                            RE-INITIATE LOGIN
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// --- 6. MAIN APPLICATION ROUTER ---
// =====================================================================

const AppRouter = () => {
    // Simple state-based routing
    const [path, setPath] = useState(window.location.pathname);

    const navigate = (newPath) => {
        if (newPath === path) return;
        window.history.pushState(null, '', newPath);
        setPath(newPath);
    };

    // Listen for browser back/forward events
    useEffect(() => {
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Initial path check on load
    useEffect(() => {
        // Handle URL parameters for verification on load
        const fullPath = window.location.pathname + window.location.search;
        if (fullPath.startsWith('/verify-email')) {
            setPath(fullPath);
        } else {
            // Ensure path starts clean
            const cleanPath = window.location.pathname.endsWith('/') && window.location.pathname.length > 1 
                ? window.location.pathname.slice(0, -1) 
                : window.location.pathname;
            if (cleanPath === '/') {
                navigate('/login');
            } else {
                setPath(cleanPath);
            }
        }
    }, []);

    // Provide the navigator to children
    const routerValue = useMemo(() => ({ path, navigate }), [path, navigate]);

    // Parse the path to check for verification route while preserving query params
    const basePath = path.split('?')[0];

    // Use the AuthProvider wrapper to give context to all routes
    const RoutedContent = () => {
        if (basePath === '/dashboard') {
            return (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            );
        } else if (basePath === '/verify-email') {
            return <EmailVerificationHandler />;
        } else if (basePath === '/login' || basePath === '/') {
            return <LoginScreen />;
        } else {
            return <LoginScreen />; // Fallback to login
        }
    }

    return (
        <RouterContext.Provider value={routerValue}>
            <AuthProvider>
                <RoutedContent />
            </AuthProvider>
        </RouterContext.Provider>
    );
}

// Main App component for global styling and execution
const App = () => (
    <>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
                --color-foundation: #111827;
                --color-foundation-light: #1f2937;
                --color-neon-surge: #00FFC0;
                --color-text-secondary: #9CA3AF;
                --color-text-tertiary: #6B7280;
                --color-warning-high: #F87171;
                background-color: var(--color-foundation);
                font-family: 'JetBrains Mono', monospace;
                margin: 0;
                min-height: 100vh;
            }
            .font-orbitron { font-family: 'Orbitron', sans-serif; }
            .font-jetbrains-mono { font-family: 'JetBrains Mono', monospace; }
            .bg-foundation { background-color: var(--color-foundation); }
            .bg-foundation-light { background-color: var(--color-foundation-light); }
            .border-neon-surge { border-color: var(--color-neon-surge); }
            .text-neon-surge { color: var(--color-neon-surge); }
            .text-text-secondary { color: var(--color-text-secondary); }
            .text-text-tertiary { color: var(--color-text-tertiary); }
            .text-warning-high { color: var(--color-warning-high); }
            .shadow-neon-card-hover { box-shadow: 0 0 20px rgba(0, 255, 192, 0.5); }
        `}</style>
        <AppRouter />
    </>
);

export default App;

