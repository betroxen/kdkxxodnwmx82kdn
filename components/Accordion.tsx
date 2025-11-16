'use client';

import React, { 
  createContext, 
  useContext, 
  useRef, 
  useLayoutEffect, 
  useState, 
  ReactNode, 
  useCallback, 
  useId,
  useEffect,
  ButtonHTMLAttributes,
  HTMLAttributes
} from 'react';
import { cn } from '@/lib/utils'; // Assume you have this util, or replace with clsx

// -------------------------------------------------------------------
// ZAPCORE AGGRESSIVE ACCORDION v3.0 - ELECTRIC CYAN WARFARE EDITION
// Mobile-first, accessible, controlled/uncontrolled, compound contexts, GPU-accelerated
// Zero bullshit. Maximum impact.
// -------------------------------------------------------------------

// 1. Icons - Violent Cyan Surge
const Icons = {
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

// 2. Contexts
interface AccordionContextType {
  type: 'single' | 'multiple';
  collapsible: boolean;
  openValues: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

interface ItemContextType {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const ItemContext = createContext<ItemContextType | null>(null);

// 3. Main Accordion (Provider) - Now Fully Controlled + Accessible
interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string[];
  onValueChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const Accordion = ({
  children,
  type = 'single',
  collapsible = type === 'single',
  value: controlledValue,
  onValueChange,
  defaultValue = [],
  className,
  ...props
}: AccordionProps) => {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );

  const openValues = isControlled ? (controlledValue ?? []) : uncontrolledValue;

  const toggleItem = useCallback(
    (value: string) => {
      let newValues: string[] = [];

      if (type === 'multiple') {
        newValues = openValues.includes(value)
          ? openValues.filter((v) => v !== value)
          : [...openValues, value];
      } else {
        if (openValues.includes(value)) {
          newValues = collapsible ? [] : openValues;
        } else {
          newValues = [value];
        }
      }

      if (isControlled) {
        onValueChange?.(newValues);
      } else {
        setUncontrolledValue(newValues);
      }
    },
    [type, collapsible, openValues, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ type, collapsible, openValues, toggleItem }}>
      <div
        className={cn(
          "rounded-2xl overflow-hidden border border-surge/30 bg-void-deep/90 backdrop-blur-xl glow-surge-sm divide-y divide-surge/10 shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// 4. AccordionItem - Compound Context Provider + Hover Glow
interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = ({ children, value, className, ...props }: AccordionItemProps) => {
  const accordionContext = useContext(AccordionContext);
  if (!accordionContext) throw new Error('AccordionItem must be used within an <Accordion />');

  const { openValues } = accordionContext;
  const isOpen = openValues.includes(value);

  const triggerId = useId();
  const contentId = useId();

  return (
    <ItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          "group transition-all duration-500 ease-out hover:glow-surge-lg hover:bg-void-raise/70",
          isOpen && "glow-surge-md bg-void-raise/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
};

// 5. AccordionTrigger - Electric Hover + Pulse When Open
interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = ({ children, className, ...props }: AccordionTriggerProps) => {
  const itemContext = useContext(ItemContext);
  const accordionContext = useContext(AccordionContext);

  if (!itemContext || !accordionContext) {
    throw new Error('AccordionTrigger must be used within an AccordionItem');
  }

  const { value, isOpen, triggerId, contentId } = itemContext;
  const { toggleItem } = accordionContext;

  return (
    <button
      id={triggerId}
      aria-controls={contentId}
      aria-expanded={isOpen}
      onClick={() => toggleItem(value)}
      className={cn(
        "flex w-full items-center justify-between px-8 py-7 text-left uppercase tracking-widest transition-all duration-400 group-hover:text-surge focus-visible:glow-surge-lg",
        isOpen ? "text-surge" : "text-white",
        "font-bold text-xl lg:text-2xl",
        className
      )}
      {...props}
    >
      <span className="flex-1 transition-all duration-400 group-hover:text-glow-surge group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">
        {children}
      </span>

      <Icons.ChevronDown
        className={cn(
          "h-8 w-8 shrink-0 text-surge transition-all duration-500 group-hover:scale-125",
          isOpen && "rotate-180 glow-surge-lg animate-pulse"
        )}
      />
    </button>
  );
};

// 6. AccordionContent - Smooth Height + Fade + Responsive Auto Height
interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = ({ children, className, ...props }: AccordionContentProps) => {
  const itemContext = useContext(ItemContext);
  if (!itemContext) throw new Error('AccordionContent must be used within an AccordionItem');

  const { isOpen, contentId, triggerId } = itemContext;

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(0);

  // Set correct height instantly on open/close (prevents flash + smooth close)
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const scrollH = el.scrollHeight;

    if (isOpen) {
      setHeight(scrollH); // immediate open to correct height
    } else {
      setHeight(scrollH);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [isOpen, children]);

  // Switch to auto after open animation for dynamic content support
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'height' && isOpen) {
        setHeight('auto');
      }
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [isOpen]);

  return (
    <div
      id={contentId}
      aria-labelledby={triggerId}
      className="overflow-hidden"
      style={{
        height: height === 'auto' ? 'auto' : `${height}px`,
        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      ref={contentRef}
      {...props}
    >
      <div
        className={cn(
          "px-8 pb-10 pt-2 transition-all duration-500 ease-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3",
          className
        )}
      >
        <div className="text-text-secondary/90 text-lg leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// EXAMPLE USAGE - PURE DEGEN FAQ
// -------------------------------------------------------------------
const FAQ_DATA = [
  { value: 'zk', title: 'WHAT THE FUCK IS ZK-ROLLUP FINALITY?', content: 'Every spin, crash, plinko drop is batched off-chain and sealed with a zero-knowledge proof that gets slammed onto Ethereum L1. Instant, immutable, unbreakable. No rollbacks. No bullshit. If you can’t prove it, you don’t play here.' },
  { value: 'vrf', title: 'HOW DOES DECENTRALIZED VRF WORK?', content: 'Chainlink VRF oracles feed truly random seeds. Server seed + client seed + nonce = verifiable outcome before the round even starts. No house manipulation. No black-box RNG. We don’t trust — we verify.' },
  { value: 'rewards', title: 'WHO GETS PAID IN SSP?', content: 'You do. Every month 30% of affiliate revenue gets dumped straight into the top 100 intel contributors. One veto that kills a casino can pay six figures. This isn’t engagement farming. This is mercenary warfare.' },
  { value: 'veto', title: 'WHAT HAPPENS WHEN COMMUNITY VETO HITS?', content: '100+ verified reports → score freeze → flash audit → confirmed fraud = permanent 0.0 tombstone. Revenue feed cut. Casino starves in public. We’ve executed 27 platforms in 2025. Your favorite might be next.' },
];

export default function AccordionShowcase() {
  return (
    <div className="min-h-screen bg-void p-8">
      <h1 className="font-orbitron text-5xl md:text-7xl font-black text-center mb-16 text-surge glow-surge-lg glitch" data-text="ZAP FAQ">
        ZAP FAQ
      </h1>

      <div className="max-w-5xl mx-auto">
        <Accordion type="multiple" defaultValue={['zk']}>
          {FAQ_DATA.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}