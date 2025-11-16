import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Client, Account, Models } from 'appwrite';

// --- CONFIGURATION ---
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Define services outside, but ONLY initialize them if config is present
let appwriteClient: Client | null = null;
let accountService: Account | null = null;
let isConfigured = false;

// CRITICAL FIX: Only initialize the client and account services if the Project ID is present.
if (appwriteProjectId) {
  appwriteClient = new Client()
    .setEndpoint(appwriteEndpoint) 
    .setProject(appwriteProjectId);
  accountService = new Account(appwriteClient);
  isConfigured = true;
  console.log("Appwrite: Client configured successfully.");
} else {
    // If config fails, we log the error and ensure 'isConfigured' remains false.
    console.error("APPWRITE CONFIG ERROR: VITE_APPWRITE_PROJECT_ID is missing. Appwrite services will be disabled.");
}

// --- 1. DEFINE CONTEXT TYPES ---
interface AuthContextType {
  user: Models.User | null; 
  isLoading: boolean;
  isAuthenticated: boolean;
  isAppwriteConfigured: boolean;
  client: Client | null;
  account: Account | null;
  // Note: These functions will guard against calls if the service is not configured.
  login: (email: string, password: string) => Promise<Models.User | null>; 
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAppwriteConfigured: isConfigured, 
  client: appwriteClient,
  account: accountService,
  login: async () => null,
  logout: async () => {},
};

// --- 2. CREATE CONTEXT & HOOK ---
export const AppwriteAuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAppwriteAuth = () => {
  return useContext(AppwriteAuthContext);
};

// --- 3. PROVIDER COMPONENT ---
interface AppwriteAuthProviderProps {
  children: ReactNode;
}

export const AppwriteAuthProvider: React.FC<AppwriteAuthProviderProps> = ({ children }) => {
  // Only start loading if Appwrite was configured successfully
  const [user, setUser] = useState<Models.User | null>(null);
  const [isLoading, setIsLoading] = useState(isConfigured); 
  const isAuthenticated = !!user;

  // --- INITIAL CHECK: Get the current user session ---
  const checkUserStatus = useCallback(async () => {
    // Guard against running API calls if Appwrite client failed to initialize
    if (!isConfigured || !accountService) {
        setIsLoading(false);
        return;
    }
    
    try {
      const currentUser = await accountService.get(); 
      setUser(currentUser);
      console.log("Appwrite: Active session found for user:", currentUser.$id);
    } catch (error) {
      setUser(null);
      // Log expected "no session" errors quietly
      if (error instanceof Error && error.message.includes('User (session) not found')) {
        console.log("Appwrite: No active session.");
      } else {
        console.error("Appwrite: Error checking user status:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only proceed if configuration was successful
    if (isConfigured) {
        checkUserStatus(); 
    } else {
        setIsLoading(false); // If not configured, immediately stop loading
    }
  }, [checkUserStatus]);

  // --- AUTH ACTIONS ---

  const login = useCallback(async (email: string, password: string): Promise<Models.User | null> => {
    if (!accountService) {
        console.error("Appwrite service is not available. Cannot log in.");
        return null;
    }
    try {
      setIsLoading(true);
      await accountService.createEmailSession(email, password);
      
      const currentUser = await accountService.get(); 
      setUser(currentUser);
      setIsLoading(false);
      return currentUser;
    } catch (error) {
      console.error("Appwrite Login Error:", error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (!accountService) {
        console.error("Appwrite service is not available. Cannot log out.");
        return;
    }
    try {
      setIsLoading(true);
      await accountService.deleteSession('current');
      setUser(null);
      setIsLoading(false);
      console.log("Appwrite: User session terminated.");
    } catch (error) {
      console.error("Appwrite Logout Error:", error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  // --- CONTEXT VALUE ---
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAppwriteConfigured: isConfigured,
    client: appwriteClient,
    account: accountService,
    login,
    logout,
  };

  // 1. Show loading screen while auth is checking state
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-foundation-dark text-neon-surge font-jetbrains-mono text-xl animate-pulse">
            ESTABLISHING CRITICAL CONNECTION...
        </div>
    );
  }
  
  // 2. Renders a specific error if the client was never configured (e.g., missing ENV vars)
  if (!isConfigured) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-900/50 text-red-300 p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">FATAL APPWRITE CONFIG ERROR</h1>
            <p className="text-lg text-center">
                Appwrite Project ID is missing. Check your environment variables (`VITE_APPWRITE_PROJECT_ID`).
            </p>
        </div>
    );
  }

  // 3. Render the application
  return (
    <AppwriteAuthContext.Provider value={value}>
      {children}
    </AppwriteAuthContext.Provider>
  );
};

