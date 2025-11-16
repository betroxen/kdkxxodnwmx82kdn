import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: We now import AppProvider, which handles all the state logic.
import { AppProvider } from '@/context/AppContext'; 
import { AppwriteAuthProvider } from '@/context/AppwriteAuthContext'; 
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