import React, { useState, useId } from 'react';

// Define the shape of the props
interface TabsProps {
    /** An array of string titles for the tabs. */
    tabs: string[];
    /** An array of React nodes, where each child corresponds to a tab panel. */
    children: React.ReactNode[];
    /** Optional class name for the outer container. */
    className?: string;
}

/**
 * A responsive, accessible Tabs component styled for the ZapCore interface.
 * Uses ARIA roles for proper keyboard navigation and screen reader support.
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, children, className = '' }) => {
    const [activeTab, setActiveTab] = useState(0);
    // Use React's useId hook to ensure unique IDs across the application, crucial for ARIA attributes.
    const uniqueId = useId();

    return (
        <div className={`w-full ${className}`}>
            {/* Tab Navigation List */}
            <div className="border-b border-white/10 mb-6">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto custom-scrollbar-minimal" role="tablist">
                    {tabs.map((tab, index) => {
                        const isSelected = activeTab === index;
                        const tabId = `tab-${uniqueId}-${index}`;
                        const panelId = `panel-${uniqueId}-${index}`;

                        return (
                            <button
                                key={tabId}
                                id={tabId}
                                role="tab"
                                aria-controls={panelId}
                                aria-selected={isSelected}
                                onClick={() => setActiveTab(index)}
                                // High-impact active state styling
                                className={`
                                    whitespace-nowrap py-3 px-1 border-b-2 
                                    font-orbitron text-sm transition-all duration-200 
                                    uppercase tracking-wider focus:outline-none 
                                    ${
                                        isSelected
                                            ? 'border-neon-surge text-neon-surge font-bold text-glow shadow-[0_2px_15px_rgba(0,255,192,0.4)]'
                                            : 'border-transparent text-text-tertiary hover:text-white hover:border-[#666] focus:text-white'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Panels (Content) */}
            <div>
                {children.map((child, index) => {
                    const isVisible = activeTab === index;
                    const panelId = `panel-${uniqueId}-${index}`;
                    const tabId = `tab-${uniqueId}-${index}`;

                    return (
                        <div 
                            key={panelId} 
                            id={panelId}
                            role="tabpanel"
                            aria-labelledby={tabId}
                            // Use absolute positioning and opacity for smooth transitions if needed, 
                            // but for simplicity and performance with large content, 'hidden' is safer.
                            className={isVisible ? 'block animate-fadeIn' : 'hidden'}
                            tabIndex={isVisible ? 0 : -1} // Ensure only visible panel is focusable
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

