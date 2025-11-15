import React from 'react';
import ReactDOM from 'react-dom/client';
// CRITICAL FIX: Must explicitly name the extension when importing from the same root directory.
import App from './App.tsx'; 
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Good error handling, keep this.
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </React.StrictMode>
);