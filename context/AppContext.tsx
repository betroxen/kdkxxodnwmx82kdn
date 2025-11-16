import React, { createContext, useState, ReactNode, useEffect, useContext, useCallback } from 'react';

// --- START: APPWRITE MOCK & DEPENDENCIES ---

// 1. Mock Appwrite Types
// In a real app, these would come from 'appwrite'
const Models = {
    Preferences: {},
};

// Define the required User Model structure for TypeScript safety
type AppwriteUser = {
    $id: string;
    email: string;
    name: string;
    status: boolean;
};

// Mock User Data (Simulates a logged-in user)
const mockUser: AppwriteUser = {
    $id: 'operator_420_zap',
    email: 'zap.operator@terminal.net',
    name: 'Zap Operator',
    status: true,
};

// 2. Mock Appwrite Account Object (Simulates '../lib/appwriteConfig')
const account = {
    /** Simulates fetching the current user session */
    get: async (): Promise<AppwriteUser> => {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            // Set mock to resolve after 300ms, simulating a successful session check.
            setTimeout(() => resolve(mockUser), 300);
            // Use reject(new Error('No active session')) to test the logout/unauthenticated path.
        });
    },
    /** Simulates deleting the current session (logout) */
    deleteSession: async (sessionId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
        });
    }
};

// --- END: APPWRITE MOCK & DEPENDENCIES ---


// --- CONTEXT TYPE DEFINITIONS ---
export interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Appwrite State
  user: AppwriteUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth Functions
  login: (user: AppwriteUser) => void;
  logout: () => Promise<void>;

  // UI State
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;

  // Modal State: Auth
  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register';
  openAuthModal: (tab: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Modal State: Review
  isReviewModalOpen: boolean;
  initialReviewCasinoId: string | null;
  openReviewModal: (id?: string) => void;
  closeReviewModal: () => void;

  // Navigation State
  viewingCasinoId: string | null;
  setViewingCasinoId: (id: string | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Optional: Custom Hook for easy access to context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};


// --- APP PROVIDER COMPONENT ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, _setCurrentPage] = useState('Home');

  // Core Appwrite/Auth State
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auth Modal States
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  // Review Modal States
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [initialReviewCasinoId, setInitialReviewCasinoId] = useState<string | null>(null);

  // Navigation/Detail State
  const [viewingCasinoId, setViewingCasinoId] = useState<string | null>(null);


  // 1. Initial Appwrite Session Check (Effect runs once on load)
  useEffect(() => {
    const checkUserSession = async () => {
        try {
            // Attempt to get the current account using the mock
            const currentAccount = await account.get();
            setUser(currentAccount);
        } catch (error) {
            // User is not logged in or session expired
            setUser(null);
            console.warn('Authentication Check: No active user session found.');
        } finally {
            setIsLoading(false);
        }
    };
    checkUserSession();
  }, []); // Empty dependency array ensures it only runs on mount


  // 2. Context Functions (Memoized using useCallback)

  const setCurrentPage = useCallback((page: string) => {
    _setCurrentPage(page);
    setViewingCasinoId(null); // Clear detail view on page change
    setIsMobileOpen(false); // Close mobile menu on navigation
  }, []);

  const login = useCallback((userData: AppwriteUser) => {
    setUser(userData);
    setAuthModalOpen(false);
    _setCurrentPage('Dashboard'); // Redirect on successful login
  }, []);

  const logout = useCallback(async () => {
    try {
        await account.deleteSession('current');
        setUser(null);
        _setCurrentPage('Home');
        console.log('Session terminated. User logged out.');
    } catch (e) {
        console.error('Logout protocol failure:', e);
    }
  }, []);

  const openAuthModal = useCallback((tab: 'login' | 'register') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const openReviewModal = useCallback((id?: string) => {
    setInitialReviewCasinoId(id || null);
    setReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setReviewModalOpen(false);
    setInitialReviewCasinoId(null);
  }, []);

  // Derived State
  const isAuthenticated = !!user;

  // Render nothing until the auth state is definitively known (CRITICAL for protected routes)
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-foundation-dark text-neon-surge font-jetbrains-mono text-xl animate-pulse">
            // ESTABLISHING CRITICAL CONNECTION...
        </div>
    );
  }

  // Final context value object
  const contextValue = { 
    currentPage, setCurrentPage,
    user,
    isLoading,
    isAuthenticated,
    login, 
    logout,
    isCollapsed, setIsCollapsed,
    isMobileOpen, setIsMobileOpen,
    isAuthModalOpen,
    authModalInitialTab,
    openAuthModal,
    closeAuthModal,
    isReviewModalOpen,
    initialReviewCasinoId,
    openReviewModal,
    closeReviewModal,
    viewingCasinoId,
    setViewingCasinoId,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

