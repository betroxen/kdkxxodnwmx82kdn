import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { account } from '../lib/appwriteConfig'; // Crucial Appwrite Import
import { Models } from 'appwrite'; // Appwrite Types

// --- Type Definitions (Updated to use Appwrite Model) ---

// Define the Appwrite User Model for clean TypeScript
type AppwriteUser = Models.User<Models.Preferences>;

export interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Appwrite State
  user: AppwriteUser | null;
  isLoading: boolean;
  isAuthenticated: boolean; // Derived from user
  
  // Updated Auth Functions
  login: (user: AppwriteUser) => void;
  logout: () => Promise<void>;
  
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;

  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register';
  openAuthModal: (tab: 'login' | 'register') => void;
  closeAuthModal: () => void;

  isReviewModalOpen: boolean;
  initialReviewCasinoId: string | null;
  openReviewModal: (id?: string) => void;
  closeReviewModal: () => void;

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, _setCurrentPage] = useState('Home');
  
  // --- CORE APPWRITE STATE ---
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // ---------------------------

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [initialReviewCasinoId, setInitialReviewCasinoId] = useState<string | null>(null);

  const [viewingCasinoId, setViewingCasinoId] = useState<string | null>(null);

  // --- APPWRITE SESSION CHECK (Run once on load) ---
  useEffect(() => {
    const checkUserSession = async () => {
        try {
            const currentAccount = await account.get();
            setUser(currentAccount);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    checkUserSession();
  }, []);
  // ------------------------------------------------

  const setCurrentPage = (page: string) => {
    _setCurrentPage(page);
    setViewingCasinoId(null);
  }

  // --- UPDATED LOGIN/LOGOUT LOGIC ---
  const login = (userData: AppwriteUser) => {
    setUser(userData);
    setAuthModalOpen(false);
    _setCurrentPage('Dashboard');
  };

  const logout = async () => {
    try {
        await account.deleteSession('current');
        setUser(null);
        _setCurrentPage('Home');
    } catch (e) {
        console.error('Logout failed:', e);
    }
  };
  // ------------------------------------

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openReviewModal = (id?: string) => {
    setInitialReviewCasinoId(id || null);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setInitialReviewCasinoId(null);
  };

  // Check if user is logged in
  const isAuthenticated = !!user;

  // Render nothing until the auth state is known (crucial for protecting routes)
  if (isLoading) {
    return <div>// ESTABLISHING CRITICAL CONNECTION...</div>;
  }

  return (
    <AppContext.Provider 
      value={{ 
        currentPage, setCurrentPage,
        user,
        isLoading,
        isAuthenticated, // Expose derived state
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
