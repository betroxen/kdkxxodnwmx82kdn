import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

function Root() {
  const [basename, setBasename] = useState('/');

  useEffect(() => {
    // Extract first non-empty path segment as dynamic basename
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    setBasename(pathSegments.length > 0 ? `/${pathSegments[0]}` : '/');
  }, []);

  return (
    <BrowserRouter basename={basename} key={basename}>
      <AppProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);