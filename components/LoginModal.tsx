import React, { useState, useEffect, useRef, useMemo } from 'react';

// =====================================================================
// --- SINGLE-FILE MANDATE MOCKS & INTERFACES ---
// In a production environment, these would be imported from external files.
// For the single-file immersive, we define them here.
// =====================================================================

// Mock Appwrite Dependencies
class AppwriteException extends Error {
    type: string;
    constructor(message: string, type: string) {
        super(message);
        this.name = 'AppwriteException';
        this.type = type;
    }
}

// Mock Appwrite Account Service
const MOCKED_USERS = [
    { email: 'taken@zap.gg', username: 'taken' },
    { email: 'admin@zap.gg', username: 'admin' },
];

const mockAccount = {
    // Simulate Appwrite's create method
    create: async (id: string, email: string, password: string, name: string) => {
        if (MOCKED_USERS.some(u => u.email === email)) {
            throw new AppwriteException('User with the requested ID already exists.', 'user_already_exists');
        }
        if (MOCKED_USERS.some(u => u.username.toLowerCase() === name.toLowerCase())) {
            throw new AppwriteException('User with the requested name already exists.', 'user_already_exists');
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
        // Add new user to mock list (in-memory only)
        MOCKED_USERS.push({ email, username: name });
        return { $id: id, email, name, status: true };
    },
    // Simulate Appwrite's createEmailPasswordSession method
    createEmailPasswordSession: async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
        if (email === 'fail@zap.gg' || password === 'fail') {
             throw new AppwriteException('Invalid credentials. Please try again.', 'user_unauthorized');
        }
        if (!MOCKED_USERS.some(u => u.email === email)) {
            throw new AppwriteException('User not found.', 'user_not_found');
        }
        return { token: 'mock-token', userId: 'mock-user-123' };
    },
    // Simulate Appwrite's get method
    get: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { $id: 'mock-user-123', email: 'test@zap.gg', name: 'ZAP_OPERATOR' };
    }
};
const account = mockAccount;

// Mock Context Hook
const useAppContext = () => ({
    // Mock global login state update
    login: (user: any) => console.log('Global Context: User logged in:', user.name),
    // Mock modal control
    closeAuthModal: () => console.log('Global Context: Modal Closed'),
});

// Mock Icons
const Icons = {
    X: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    User: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Mail: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    Lock: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Check: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    AlertTriangle: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.8 18.01A2 2 0 0 0 3.56 21h16.88a2 2 0 0 0 1.76-3.86L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
};

// Mock Input Component
const Input: React.FC<any> = ({ className, onChange, as, ...props }) => {
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

// Mock Button Component
const Button: React.FC<any> = ({ children, variant = 'primary', size = 'md', className, loading, ...props }) => {
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

// Mock ZapLogo Component
const ZapLogo: React.FC<any> = ({ className, iconClassName }) => (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Icons.Check className={`text-neon-surge ${iconClassName}`} />
        <span className="font-orbitron text-xl font-bold text-white tracking-widest">ZAPCORE</span>
    </div>
);

// =====================================================================

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: 'login' | 'register';
    // Removed onLoginSuccess - context handles state
}

/**
 * Cybernetic Authentication Modal for ZapCore.
 * Handles Login and Registration forms and interacts with Appwrite.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab }) => {
    const { login: globalLogin, closeAuthModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
    const [isCheckingHandle, setIsCheckingHandle] = useState(false);
    const handleTimeoutRef = useRef<number | null>(null);

    // --- Utility Functions ---

    // Password strength calculation logic (Memoized)
    const calculatePasswordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 12) score++; // Length check
        if (/[0-9]/.test(password)) score++; // Number check
        if (/[!@#$%^&*()]/.test(password)) score++; // Symbol check
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++; // Mixed case check
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
        setHandleAvailable(null);
        setError('');
        setIsLoading(false);
    }

    // Effect to manage open/close state and body scroll
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            resetForm();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = ''; // Cleanup on unmount
        };
    }, [isOpen, initialTab, onClose]);

    // Handle click outside modal
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };


    // --- SECURITY NOTE: This check should be server-side (Appwrite Function/Database Query) ---
    // Simulating a username availability check with a debounce timer
    const checkHandle = () => {
        if (handleTimeoutRef.current !== null) {
            clearTimeout(handleTimeoutRef.current);
        }
        if (username.length < 3) {
            setHandleAvailable(null);
            return;
        }
        
        // Basic formatting validation (only letters, numbers, and underscore)
        if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
            setHandleAvailable(false);
            setError('AUTH_ERR: ALIAS FORMAT INVALID (A-Z, 0-9, _)');
            return;
        } else {
            setError('');
        }

        setIsCheckingHandle(true);
        handleTimeoutRef.current = window.setTimeout(async () => {
            try {
                // MOCKED: Check against mock user list
                const isAvailable = !MOCKED_USERS.some(u => u.username.toLowerCase() === username.toLowerCase());

                setHandleAvailable(isAvailable);
            } catch (e) {
                console.error('Handle check failed:', e);
                setHandleAvailable(false);
            } finally {
                setIsCheckingHandle(false);
            }
        }, 600);
    };
    // ------------------------------------------------------------------------------------------

    // --- Appwrite Submission Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // --- VALIDATION PROTOCOL ---
        if (activeTab === 'login') {
            if (!email || !password) { setError('AUTH_ERR: CREDENTIALS MISSING'); return; }
        } else {
            if (!username || !email || !password || !confirmPassword) { setError('AUTH_ERR: ALL FIELDS MANDATORY'); return; }
            if (password !== confirmPassword) { setError('AUTH_ERR: PASSKEY MISMATCH'); return; }
            if (passwordStrength < 3) { setError('AUTH_ERR: PASSKEY STRENGTH INSUFFICIENT (MIN 3/4)'); return; }
            if (!termsAccepted) { setError('AUTH_ERR: AFFIRMATION PROTOCOL REQUIRED'); return; }
            if (handleAvailable === false) { setError('AUTH_ERR: ALIAS UNAVAILABLE'); return; }
            if (handleAvailable === null) { setError('AUTH_ERR: ALIAS CHECK PENDING'); return; }
        }
        // ---------------------------

        setIsLoading(true);

        try {
            if (activeTab === 'login') {
                // 1. LOGIN
                await account.createEmailPasswordSession(email, password);

            } else {
                // 1. REGISTER
                // Note: 'unique()' is used for ID, and username is passed as name
                await account.create(
                    'unique()',
                    email,
                    password,
                    username
                );
                // 2. LOG IN immediately after registration
                await account.createEmailPasswordSession(email, password);
            }

            // --- SUCCESS PROTOCOL: UPDATE GLOBAL STATE ---
            const user = await account.get(); // Fetch the authenticated user object
            globalLogin(user); // Send user object to AppProvider
            closeAuthModal(); // Close the modal via global context function
            // ---------------------------------------------

        } catch (err) {
            // --- FAILURE PROTOCOL ---
            if (err instanceof AppwriteException) {
                // Clean up Appwrite error messages for UX
                const message = err.message.toUpperCase()
                    .replace('USER WITH THE REQUESTED ID ALREADY EXISTS.', 'ALIAS OR EMAIL TAKEN')
                    .replace('INVALID CREDENTIALS. PLEASE TRY AGAIN.', 'PASSKEY OR EMAIL REFUSED');
                setError(`AUTH_ERR: ${err.type || 'SYSTEM'}: ${message}`);
            } else {
                setError('AUTH_ERR: UNKNOWN CRITICAL FAILURE.');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };
    // ------------------------------------

    if (!isOpen) return null;

    const isLoginValid = email.length > 0 && password.length > 0;
    const isRegisterValid = username.length > 2 && email.length > 0 && password.length >= 12 && password === confirmPassword && termsAccepted && passwordStrength >= 3 && handleAvailable === true;

    return (
        // Use handleOutsideClick on the backdrop for dismissal
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:py-8 bg-black/80 backdrop-blur-md animate-modal-enter" onClick={handleOutsideClick}>
            <div 
                ref={modalRef} 
                className="relative w-full sm:max-w-md max-h-[95vh] flex flex-col bg-foundation border border-neon-surge/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8),_0_0_20px_rgba(0,255,192,0.2)] overflow-hidden transition-transform duration-300 ease-in-out transform scale-100"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Close Button */}
                <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 text-text-tertiary hover:text-neon-surge h-auto p-2 z-20">
                    <Icons.X className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="flex-shrink-0 p-6 pt-8 text-center relative z-10 bg-foundation border-b border-[#333]">
                    <ZapLogo className="mx-auto mb-4 inline-block" iconClassName="h-10 w-10 text-glow drop-shadow-[0_0_8px_#00FFC0]" />
                    <h2 className="font-orbitron font-bold text-xl text-white uppercase tracking-widest text-glow">
                        {activeTab === 'login' ? 'WELCOME BACK, OPERATOR' : 'INITIATE NEW PROFILE'}
                    </h2>
                    <p className="text-xs font-jetbrains-mono text-neon-surge mt-2 tracking-wider opacity-80">
                        {activeTab === 'login' ? '// AUTHENTICATION REQUIRED' : '// SECURE YOUR SPOT ON THE GRID'}
                    </p>
                </div>

                {/* Content Area */}
                <div className="p-6 pt-5 overflow-y-auto custom-scrollbar flex-1 bg-foundation-light">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Username/Handle (Register Only) */}
                        {activeTab === 'register' && (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Alias (Handle)</label>
                                    {!isCheckingHandle && handleAvailable !== null && (
                                        <span className={`text-xs font-jetbrains-mono uppercase ${handleAvailable ? 'text-neon-surge text-glow' : 'text-warning-high'}`}>
                                            {handleAvailable ? '// VPR AVAILABLE' : '// ALIAS TAKEN'}
                                        </span>
                                    )}
                                     {isCheckingHandle && <span className="text-xs font-jetbrains-mono text-text-secondary animate-pulse">// SCANNING...</span>}
                                </div>
                                <div className="relative">
                                    <Icons.User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${handleAvailable === false ? 'text-warning-high' : 'text-text-tertiary'}`} />
                                    <Input 
                                        placeholder="UNIQUE_ID (A-Z, 0-9, _)" 
                                        value={username} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
                                            setUsername(e.target.value); 
                                            setHandleAvailable(null); // Reset availability on change
                                        }} 
                                        onBlur={checkHandle} // Trigger check on focus loss
                                        className={`pl-10 ${handleAvailable === false ? '!border-warning-high focus:!ring-warning-high' : ''}`} 
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Email Protocol</label>
                            <div className="relative">
                                <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                                <Input type="email" placeholder="OPERATOR@ZAP.GG" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} />
                            </div>
                        </div>

                        {/* 3. Passkey */}
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
                                <Input type="password" placeholder={activeTab === 'register' ? "MIN 12 CHARS (A-Z, 0-9, #$@)" : "••••••••"} value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="pl-10" disabled={isLoading} />
                            </div>
                            {activeTab === 'register' && (
                                <div className="flex gap-1 h-1.5 mt-1.5 rounded overflow-hidden">
                                    {/* Password strength bars */}
                                    {[1, 2, 3, 4].map(level => (
                                        <div key={level} className={`flex-1 transition-all duration-300 ${passwordStrength >= level ? (passwordStrength >= 3 ? 'bg-neon-surge shadow-[0_0_5px_#00FFC0]' : 'bg-yellow-500 shadow-[0_0_5px_#FFC000]') : 'bg-[#333]'}`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 4. Confirm Passkey (Register Only) */}
                        {activeTab === 'register' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-jetbrains-mono text-text-secondary uppercase ml-1">Confirm Passkey</label>
                                    <Input 
                                        type="password" 
                                        placeholder="RE-ENTER PASSKEY" 
                                        value={confirmPassword} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
                                        className={confirmPassword && password !== confirmPassword ? '!border-warning-high focus:!ring-warning-high' : ''} 
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* 5. Terms Acceptance */}
                                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg border-2 border-transparent hover:border-neon-surge/30 bg-foundation transition-all">
                                    <div className="relative flex items-center mt-0.5">
                                        <input type="checkbox" className="peer sr-only" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} disabled={isLoading} />
                                        <div className="h-5 w-5 border-2 border-[#333] rounded-md bg-foundation-light peer-checked:bg-neon-surge peer-checked:border-neon-surge transition-all flex items-center justify-center shadow-inner shadow-black/50">
                                            <Icons.Check className={`h-3 w-3 text-black transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-secondary leading-snug font-jetbrains-mono uppercase">
                                        I AFFIRM I AM 18+ AND ACCEPT THE <button type="button" className="text-neon-surge hover:underline transition-colors focus:outline-none">TERMS</button> AND <button type="button" className="text-neon-surge hover:underline transition-colors focus:outline-none">PRIVACY POLICY</button> PROTOCOLS.
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Error Message Display */}
                        {error && (
                            <div className="p-3 bg-warning-high/10 border border-warning-high/50 rounded-lg text-warning-high text-xs font-jetbrains-mono flex items-start gap-2 animate-fadeIn shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                                <Icons.AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span className="uppercase">{error}</span>
                            </div>
                        )}

                        {/* Submission Button */}
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="w-full" 
                            loading={isLoading} 
                            disabled={isLoading || (activeTab === 'login' ? !isLoginValid : !isRegisterValid)} 
                        >
                            {activeTab === 'login' ? 'ESTABLISH CONNECTION' : 'CREATE OPERATOR PROFILE'}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-5 text-center space-y-3">
                        {activeTab === 'login' ? (
                            <>
                                <button className="text-xs font-jetbrains-mono text-text-secondary hover:text-neon-surge transition-colors uppercase tracking-wider block mx-auto focus:outline-none">
                                    [ DECRYPT PASSKEY ]
                                </button>
                                <p className="text-xs text-text-tertiary font-jetbrains-mono uppercase">
                                    NEW TO THE GRID?
                                    <button onClick={() => { resetForm(); setActiveTab('register'); }} className="text-white hover:text-neon-surge ml-1 font-bold transition-colors focus:outline-none">
                                        INITIATE NEW PROFILE
                                    </button>
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-text-tertiary font-jetbrains-mono uppercase">
                                ALREADY OPERATIVE?
                                <button onClick={() => { resetForm(); setActiveTab('login'); }} className="text-white hover:text-neon-surge ml-1 font-bold transition-colors focus:outline-none">
                                    ESTABLISH CONNECTION
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

