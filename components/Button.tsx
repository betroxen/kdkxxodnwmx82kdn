import React from 'react';
import { Icons } from './icons'; // Assumes Icons includes Loader2

// A simplified cva-like function
// Note: This function is simplified and assumes that classes defined in the global index.css (like bg-neon-surge, bg-foundation-light, etc.) are available.
const cva = (base: string, variants: Record<string, Record<string, string>>) => {
  return (props: { variant?: string, size?: string }) => {
    let variantClasses = '';
    if (props.variant && variants.variant[props.variant]) {
      variantClasses += variants.variant[props.variant] + ' ';
    }
    if (props.size && variants.size[props.size]) {
      variantClasses += variants.size[props.size] + ' ';
    }
    return [base, variantClasses].join(' ').trim();
  };
};

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-foundation focus:ring-neon-surge disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] font-orbitron tracking-wider uppercase',
  {
    variant: {
      // Primary: Neon Gradient, strong shadow, slight lift on hover
      primary: 'bg-gradient-to-br from-neon-surge/90 to-neon-surge text-foundation-dark shadow-lg shadow-neon-surge/30 hover:shadow-neon-surge/60 hover:-translate-y-px text-sm sm:text-base',
      
      // Secondary: Dark Matte Base, Glowing Border effect on hover
      secondary: 'bg-foundation-light border border-foundation-light text-text-secondary hover:text-white hover:border-neon-surge/50 hover:shadow-[0_0_15px_rgba(0,255,192,0.4)] active:bg-foundation active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] text-sm sm:text-base',
      
      // Ghost: Transparent base, neon text, subtle dark hover background
      ghost: 'bg-transparent text-neon-surge/80 hover:bg-foundation-light/50 hover:text-neon-surge text-sm',
      
      // Destructive: High-impact warning color
      destructive: 'bg-warning-high text-white shadow-md shadow-warning-high/40 hover:bg-warning-high/90 hover:shadow-warning-high/60 text-sm sm:text-base',
    },
    size: {
      // Responsive sizing: default h-10, slightly wider on small screens
      default: 'h-10 py-2 px-4 sm:px-5 text-sm',
      sm: 'h-9 px-3 rounded-md text-xs',
      lg: 'h-12 px-6 sm:px-8 rounded-lg text-base',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, loading = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size }) + ` ${className}`}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          // Use font-jetbrains-mono for loading text for a clean, technical look
          <span className="flex items-center justify-center gap-2 font-jetbrains-mono">
            <Icons.Loader2 className="h-5 w-5 animate-spin" />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };