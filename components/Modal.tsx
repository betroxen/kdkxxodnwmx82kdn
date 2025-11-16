import React, { useEffect } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Mock Icons (lucide-react equivalent for 'X')
const Icons = {
    X: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

/**
 * Modal component with keyboard escape support and background scroll lock.
 * Features a high-contrast, cyberpunk aesthetic.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  
  // Effect to handle Escape key press and body scroll locking
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleEsc);

    // Toggle body class to prevent background scrolling
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]); // Dependencies ensure cleanup/re-run when state changes

  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Clickable Overlay to close the modal */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div className="relative bg-[#1e293b] border border-neon-surge/30 rounded-xl shadow-[0_0_25px_rgba(0,255,192,0.3)] w-full max-w-lg m-4 transform transition-all duration-300 ease-in-out animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neon-surge/50">
          <h2 id="modal-title" className="font-orbitron text-xl font-bold text-white uppercase tracking-wider text-shadow-neon">
            {title}
          </h2>
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-neon-surge transition-colors p-1 rounded-full hover:bg-[#333]"
            aria-label={`Close ${title} modal`}
          >
            <Icons.X className="h-6 w-6" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 text-text-secondary font-jetbrains-mono">
          {children}
        </div>
      </div>
    </div>
  );
};

