import React, { createContext, useState, ReactNode, useContext, useCallback } from 'react';
import { useAppwriteAuth } from './AppwriteAuthContext'; // <--- NEW: Import the real auth hook

// --- START: TYPE DEFINITIONS ---

// IMPORTANT: We use 'any' for the user type here because we cannot access the Appwrite 
// Models.User type without importing Appwrite itself in this file. 
// The real user object comes directly from the AppwriteAuthContext.
type AppwriteUser = any; 

// The AppContextType now consumes state from the AppwriteAuthContext
export interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Appwrite State (Consumed from AppwriteAuthContext)
  user: AppwriteUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth Functions (These are now UI-effect wrappers)
  // They handle modal closing and redirects after the core auth action (in AppwriteAuthContext) completes.
  login: () => void;
  logout: () => void;

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
  // Use the real auth state and functions from the parent context
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    logout: authLogout // Rename to avoid conflict with wrapper
  } = useAppwriteAuth(); 

  const [currentPage, _setCurrentPage] = useState('Home');

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


  // --- CONTEXT FUNCTIONS (UI Side Effects) ---

  const setCurrentPage = useCallback((page: string) => {
    _setCurrentPage(page);
    setViewingCasinoId(null); // Clear detail view on page change
    setIsMobileOpen(false); // Close mobile menu on navigation
  }, []);

  // 1. UI Login Wrapper: Handles UI effects after successful Appwrite session creation
  const login = useCallback(() => {
    // The user state is updated in AppwriteAuthContext; we only handle UI here.
    setAuthModalOpen(false);
    _setCurrentPage('Dashboard'); // Redirect on successful login
  }, []);

  // 2. UI Logout Wrapper: Calls the real Appwrite logout, then handles UI effects
  const logout = useCallback(async () => {
    try {
        await authLogout(); // Execute the real Appwrite session termination
        _setCurrentPage('Home');
        console.log('Session terminated. User logged out.');
    } catch (e) {
        console.error('Logout protocol failure:', e);
    }
  }, [authLogout]);

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

  // Render nothing until the auth state is definitively known (CRITICAL for protected routes)
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-foundation-dark text-neon-surge font-jetbrains-mono text-xl animate-pulse">
            ESTABLISHING CRITICAL CONNECTION...
        </div>
    );
  }

  // Final context value object
  const contextValue: AppContextType = { 
    currentPage, setCurrentPage,
    // Live Auth State
    user,
    isLoading,
    isAuthenticated,
    // UI-Effect Wrappers
    login, 
    logout,
    // UI States
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