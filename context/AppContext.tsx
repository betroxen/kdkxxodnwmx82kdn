// context/AppContext.tsx
// ZAPCORE APP CONTEXT v4.0 - ELECTRIC WARFARE EDITION
// Single source of truth. Zero bullshit. Maximum performance.

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
  memo,
} from 'react';
import { useAppwriteAuth } from './AppwriteAuthContext.tsx';

// ===================================================================
// TYPES - FULLY TYPED, NO 'any' BULLSHIT
// ===================================================================
export interface AppContextType {
  // Navigation & Layout
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Auth State (Live from Appwrite)
  user: any; // We keep 'any' here ONCE — because Appwrite Models are huge and circular
  isLoading: boolean;
  isAuthenticated: boolean;

  // UI Auth Triggers (with post-action side effects)
  login: () => void;
  logout: () => Promise<void>;

  // Layout States
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Review Modal
  isReviewModalOpen: boolean;
  initialReviewCasinoId: string | null;
  openReviewModal: (casinoId?: string) => void;
  closeReviewModal: () => void;

  // Casino Detail View
  viewingCasinoId: string | null;
  setViewingCasinoId: (id: string | null) => void;

  // Utility
  isDashboardAccessible: boolean;
}

// ===================================================================
// CONTEXT CREATION
// ===================================================================
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
  throw new Error('useAppContext must be used within AppProvider — deploy or die');
  }
  return context;
};

// ===================================================================
// PROVIDER - MEMOIZED, OPTIMAL RE-RENDERS, GPU-READY
// ===================================================================
export const AppProvider: React.FC<{ children: ReactNode }> = memo(({ children }) => {
  // Live Appwrite State
  const { user, isLoading, isAuthenticated, logout: appwriteLogout } = useAppwriteAuth();

  // Core UI States
  const [currentPage, _setCurrentPage] = useState('Home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [initialReviewCasinoId, setInitialReviewCasinoId] = useState<string | null>(null);

  const [viewingCasinoId, setViewingCasinoId] = useState<string | null>(null);

  // =================================================================
  // CALLBACKS - FULLY MEMOIZED, ZERO RECREATIONS
  // =================================================================
  const setCurrentPage = useCallback((page: string) => {
    _setCurrentPage(page);
    setViewingCasinoId(null);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const login = useCallback(() => {
    closeAuthModal();
    setCurrentPage('Dashboard');
  }, []);

  const logout = useCallback(async () => {
    try {
      await appwriteLogout();
      setCurrentPage('Home');
      setIsCollapsed(false);
      setIsMobileOpen(false);
      setViewingCasinoId(null);
      console.log('%cZAP PROTOCOL: Session terminated. Swarm disconnected.', 'color: #00ffff; font-weight: bold;');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [appwriteLogout]);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  });

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openReviewModal = useCallback((casinoId?: string) => {
    setInitialReviewCasinoId(casinoId || null);
    setIsReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    setInitialReviewCasinoId(null);
  }, []);

  // =================================================================
  // DERIVED STATE - MEMOIZED
  // =================================================================
  const isDashboardAccessible = useMemo(
    () => isAuthenticated && !isLoading,
    [isAuthenticated, isLoading]
  );

  // =================================================================
  // LOADING SCREEN - ELECTRIC VIOLENCE
  // =================================================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-void z-[9999]">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black text-surge glitch mb-8" data-text="ZAP">
            ZAP
          </h1>
          <p className="text-2xl text-surge glow-surge-lg animate-pulse font-bold uppercase tracking-widest">
            Establishing Critical Connection
          </p>
          <div className="mt-12 h-1 w-96 bg-surge/20 overflow-hidden rounded-full">
            <div className="h-full bg-surge glow-surge-md animate-[surge-pulse_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // FINAL CONTEXT VALUE - STABLE REFERENCES
  // =================================================================
  const value = useMemo<AppContextType>(
    () => ({
      currentPage,
      setCurrentPage,

      user,
      isLoading,
      isAuthenticated,

      login,
      logout,

      isCollapsed,
      toggleSidebar,
      isMobileOpen,
      setIsMobileOpen,

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

      isDashboardAccessible,
    }),
    [
      currentPage,
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      isCollapsed,
      toggleSidebar,
      isMobileOpen,
      isAuthModalOpen,
      authModalInitialTab,
      openAuthModal,
      closeAuthModal,
      isReviewModalOpen,
      initialReviewCasinoId,
      openReviewModal,
      closeReviewModal,
      viewingCasinoId,
      isDashboardAccessible,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
});

AppProvider.displayName = 'AppProvider';