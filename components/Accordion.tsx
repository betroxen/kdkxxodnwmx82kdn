import React, { createContext, useContext, useRef, useLayoutEffect, useState, ReactNode, useCallback } from 'react';

// --- START: SINGLE-FILE COMPONENT DEPENDENCIES ---

// 1. Mock Icons (lucide-react equivalent for 'ChevronDown')
const Icons = {
    ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
};

// 2. Context Types
interface AccordionContextType {
  openValues: string[];
  toggleItem: (value: string) => void;
}

// 3. Context Creation
const AccordionContext = createContext<AccordionContextType | null>(null);

// --- END: SINGLE-FILE COMPONENT DEPENDENCIES ---


// 4. Main Accordion Component (Provider)
interface AccordionProps {
    children: ReactNode;
    multiple?: boolean;
    defaultOpen?: string[];
}
export const Accordion: React.FC<AccordionProps> = ({ children, multiple = false, defaultOpen = [] }) => {
  const [openValues, setOpenValues] = useState(defaultOpen);

  const toggleItem = useCallback((value: string) => {
    setOpenValues(prev => {
      if (multiple) {
        // Toggle item: add if closed, remove if open
        return prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      } else {
        // Single open item: close if same, open new one if different
        return prev.includes(value) ? [] : [value];
      }
    });
  }, [multiple]);

  return (
    <AccordionContext.Provider value={{ openValues, toggleItem }}>
      <div className="rounded-xl border border-neon-surge/20 bg-foundation-dark/70 shadow-lg">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// 5. AccordionItem Component (Container for Trigger and Content)
interface AccordionItemProps {
    children: ReactNode;
    value: string; // Unique identifier for the item
}
export const AccordionItem: React.FC<AccordionItemProps> = ({ children, value }) => {
  const context = useContext(AccordionContext);
  if (!context) {
    // Crucial check for proper component usage
    console.error('AccordionItem must be used within an Accordion');
    return null;
  }
  const isOpen = context.openValues.includes(value);

  // Clone children to inject props (value, isOpen) to Trigger and Content
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { value, isOpen } as any);
    }
    return child;
  });

  return (
    <div className="border-b border-[#333333] last:border-b-0 px-4">
      {childrenWithProps}
    </div>
  );
};

// 6. AccordionTrigger Component (Button to toggle open state)
interface AccordionTriggerProps {
    children: ReactNode;
    value?: string;
    isOpen?: boolean;
}
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, value, isOpen }) => {
  const context = useContext(AccordionContext);
  
  if (!context || value === undefined) {
    // Crucial check
    console.error('AccordionTrigger must be used within an AccordionItem and receive a "value" prop.');
    return null;
  }

  return (
    <button
      className="flex w-full items-center justify-between py-4 text-left group transition-colors focus:outline-none hover:text-white/80"
      onClick={() => context.toggleItem(value)}
      aria-expanded={isOpen}
    >
      <span className="flex-1 font-orbitron text-sm font-bold uppercase text-white group-hover:text-neon-surge transition-colors">
        {children}
      </span>
      {/* Rotation indicates open state */}
      <Icons.ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} text-neon-surge`} />
    </button>
  );
};

// 7. AccordionContent Component (Content panel with height transition)
interface AccordionContentProps {
    children: ReactNode;
    isOpen?: boolean;
}
export const AccordionContent: React.FC<AccordionContentProps> = ({ children, isOpen }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(isOpen ? 'auto' : '0px');

  // useLayoutEffect is critical here to calculate height before paint, preventing flashes.
  useLayoutEffect(() => {
    if (contentRef.current) {
      // Calculate height dynamically. If open, set to scrollHeight, otherwise 0.
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen, children]); // Re-calculate if open state or content changes

  return (
    <div
      ref={contentRef}
      style={{ height, transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
      className="overflow-hidden pb-0" // pb-0 allows the content padding to control final spacing
    >
      <div className="pb-4 text-text-secondary font-jetbrains-mono text-sm">
        {children}
      </div>
    </div>
  );
};


// Example Usage (for demonstration)
const FAQ_DATA = [
    { value: 'protocol-a', title: 'What is ZK-Rollup Security?', content: 'The Zero-Knowledge Rollup (ZK-R) protocol batch-processes thousands of transactions off-chain and generates a cryptographic proof of validity. This proof is then posted back to the main chain, significantly boosting throughput and security while minimizing gas costs.' },
    { value: 'protocol-b', title: 'How do Degen Rewards work?', content: 'Zap Points are distributed based on verifiable network participation, including successful transaction validation, governance voting, and completing quarterly "Syndicate Missions." Loyalty is tracked on-chain, and rewards unlock progressive tiers.' },
    { value: 'protocol-c', title: 'Can I open multiple items at once?', content: 'Yes, if the "multiple" prop is set to true on the main Accordion component, users can expand any number of items simultaneously. By default, only one item can be open.' },
];

const App: React.FC = () => (
    <div className="p-8 max-w-2xl mx-auto">
        <h1 className="font-orbitron text-2xl font-bold text-white mb-6 uppercase">System FAQ v2.1</h1>
        
        <Accordion multiple defaultOpen={['protocol-a']}>
            {FAQ_DATA.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
);

export default App;

