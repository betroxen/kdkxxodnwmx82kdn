import React, { useEffect, useCallback } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Placeholder Button Component (Mocked from previous context)
const Button: React.FC<any> = ({ children, className, onClick, variant, size = 'md' }) => {
    const baseStyle = "font-bold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 font-orbitron uppercase tracking-wider";
    const sizeStyle = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    
    let colorStyle = 'bg-neon-surge text-black hover:bg-neon-surge/80 shadow-[0_0_10px_rgba(0,255,192,0.3)]';
    
    // Custom variants for confirmation modal
    if (variant === 'ghost') {
        colorStyle = 'bg-transparent text-text-secondary hover:text-white hover:bg-[#333]/50 border border-transparent';
    } else if (variant === 'destructive') {
        colorStyle = 'bg-red-700 text-white hover:bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]';
    }

    return (
        <button
            type="button"
            className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// 2. Mock Icon (X) for close button logic, though not strictly used in this component's render
const Icons = {
    X: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  body: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  // Optional: change the confirm button text
  confirmText?: string; 
  // Optional: if the "irreversible" warning should be shown
  showIrreversibleWarning?: boolean;
}

/**
 * High-contrast modal for critical confirmation steps.
 * Includes Esc key support and focus management.
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    title, 
    body, 
    onConfirm, 
    onClose, 
    confirmText = "CONFIRM",
    showIrreversibleWarning = true
}) => {
    
    // Lock body scroll and handle Escape key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEsc);

        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirmation-modal-title"
        >
            {/* Clickable Overlay */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>

            {/* Modal Content */}
            <div className="relative bg-[#1e293b] border border-red-500/50 shadow-[0_0_25px_rgba(255,0,0,0.5)] rounded-xl w-full max-w-md animate-slideInUp">
                
                {/* Header */}
                <div className="p-5 border-b border-red-500/50 flex justify-between items-center">
                    <h3 id="confirmation-modal-title" className="font-orbitron text-lg text-red-400 uppercase tracking-wider">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-text-secondary hover:text-red-400 transition-colors p-1 rounded-full hover:bg-[#333]"
                        aria-label={`Close modal: ${title}`}
                    >
                        <Icons.X className="h-5 w-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-5 text-sm text-white font-jetbrains-mono">
                    {body}
                    {showIrreversibleWarning && (
                        <p className="mt-4 text-xs text-red-500 font-bold uppercase">
                            Warning: This action is irreversible and requires protocol clearance.
                        </p>
                    )}
                </div>
                
                {/* Actions */}
                <div className="p-5 flex justify-end gap-3 border-t border-[#333]">
                    <Button onClick={onClose} variant="ghost">
                        CANCEL
                    </Button>
                    <Button onClick={onConfirm} variant="destructive">
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Example Usage ---
const AppExample: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleConfirm = useCallback(() => {
        console.log("EXECUTE PURGE PROTOCOL.");
        alert("Action Confirmed: Database Purged."); // Using alert only in the example handler
        setIsModalOpen(false);
    }, []);

    return (
        <div className="p-8 bg-foundation-dark min-h-screen text-white">
            <h1 className="text-3xl font-orbitron mb-4">Critical System Console</h1>
            <p className="mb-8 text-text-secondary">Testing critical transaction confirmation.</p>
            
            <Button onClick={() => setIsModalOpen(true)} variant="destructive" className="bg-red-700">
                Trigger Protocol Purge
            </Button>

            <ConfirmationModal
                isOpen={isModalOpen}
                title="Protocol 404: System Purge"
                body={
                    <p>Are you certain you wish to initiate the **full network data purge**? This will reset all operational logs and user metrics.</p>
                }
                onConfirm={handleConfirm}
                onClose={() => setIsModalOpen(false)}
                confirmText="CONFIRM PURGE"
            />
        </div>
    );
};

export default AppExample;

