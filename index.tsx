import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// HARD FIX: Using explicit relative paths with .tsx extension to bypass resolution failures.
import { AppProvider } from './context/AppContext.tsx'; 
import { AppwriteAuthProvider } from './context/AppwriteAuthContext.tsx'; 
import './index.css'; 


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* STEP 1: AppwriteAuthProvider must wrap everything to provide the 
      live 'user' and 'account' services globally. 
    */}
    <AppwriteAuthProvider>
      {/* STEP 2: We use the dedicated AppProvider component to inject the 
        real, live UI state into the application, consuming the Appwrite context. 
      */}
      <AppProvider>
        <App />
      </AppProvider>
    </AppwriteAuthProvider>
  </React.StrictMode>,
);