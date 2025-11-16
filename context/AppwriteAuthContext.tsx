import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Client, Account, Models } from 'appwrite';

// --- CONFIGURATION ---
// IMPORTANT: These are assumed to be defined in your .env file and exposed via Vite
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'http://localhost/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// --- INITIALIZE APPWRITE CLIENT ---
// The client will be initialized outside the component, then exposed via context
const appwriteClient = new Client();

if (appwriteProjectId) {
  appwriteClient
    .setEndpoint(appwriteEndpoint) 
    .setProject(appwriteProjectId);
} else {
    console.error("APPWRITE ERROR: VITE_APPWRITE_PROJECT_ID is not set.");
}

const accountService = new Account(appwriteClient);

// --- 1. DEFINE CONTEXT TYPES ---
interface AuthContextType {
  // Models.User is the type for a successful Appwrite user object
  user: Models.User | null; 
  isLoading: boolean;
  isAuthenticated: boolean;
  // Expose the core Appwrite services
  client: Client;
  account: Account;
  // Core auth actions (actual Appwrite API calls happen here)
  login: (email: string, password: string) => Promise<Models.User | null>; 
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
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
  const [user, setUser] = useState<Models.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // --- INITIAL CHECK: Get the current user session ---
  const checkUserStatus = useCallback(async () => {
    try {
      // Check if a session is active and get the user data
      const currentUser = await accountService.get(); 
      setUser(currentUser);
      console.log("Appwrite: Active session found for user:", currentUser.$id);
    } catch (error) {
      // No active session or API error
      setUser(null);
      console.log("Appwrite: No active session.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!appwriteProjectId) {
        setIsLoading(false);
        return; // Don't run check if project ID is missing
    }
    // Run the check on initial component mount
    checkUserStatus(); 
  }, [checkUserStatus]);

  // --- AUTH ACTIONS ---

  const login = useCallback(async (email: string, password: string): Promise<Models.User | null> => {
    try {
      setIsLoading(true);
      // Create a session for the user
      await accountService.createEmailSession(email, password);
      
      // Fetch the detailed user object after session is created
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
    try {
      setIsLoading(true);
      // Delete the active session
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
    client: appwriteClient,
    account: accountService,
    login,
    logout,
  };

  // Render the loading screen from AppContext while auth is determining the state
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-foundation-dark text-neon-surge font-jetbrains-mono text-xl animate-pulse">
            ESTABLISHING CRITICAL CONNECTION...
        </div>
    );
  }

  return (
    <AppwriteAuthContext.Provider value={value}>
      {children}
    </AppwriteAuthContext.Provider>
  );
};

