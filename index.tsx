import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: Now using the path alias '@' for context imports. 
// This resolves the 'Could not resolve' error from the build log.
import { AppContext } from '@/context/AppContext'; 
import { AppwriteAuthProvider } from '@/context/AppwriteAuthContext'; 
import './index.css'; 

// Note: Replace the 'value' placeholder below with your actual AppContext values
const mockAppContextValue = { 
    // ... all your existing AppContext state and handlers (isCollapsed, currentPage, etc.)
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* STEP 1: AppwriteAuthProvider must wrap everything to provide the 
      live 'user' and 'account' services globally. 
    */}
    <AppwriteAuthProvider>
      {/* STEP 2: Your main AppContext provides UI/Local state and 
        can now consume the 'user' data from the Appwrite context. 
      */}
      <AppContext.Provider value={mockAppContextValue as any}>
        <App />
      </AppContext.Provider>
    </AppwriteAuthProvider>
  </React.StrictMode>,
);