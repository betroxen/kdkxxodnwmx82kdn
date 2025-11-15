import React, { forwardRef } from 'react';

// --- INLINE SVG ICON DEFINITION (REPLACING LUCIDE-REACT) ---
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// --- TYPE DEFINITIONS ---
type InputAsInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  as?: 'input';
};
type TextareaAsTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: 'textarea';
};
type SelectAsSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  as: 'select';
};

export type InputProps = InputAsInputProps | TextareaAsTextareaProps | SelectAsSelectProps;

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>((props, ref) => {
  const baseClassName = `
    flex w-full rounded-lg text-sm text-white font-jetbrains-mono
    border border-foundation-dark/60 bg-foundation-light 
    px-3 py-2 h-10
    placeholder:text-text-tertiary
    transition-all duration-300
    shadow-inner shadow-black/50 /* Carved/Recessed Look */

    /* Hover State */
    hover:border-neon-surge/20

    /* Focus State: Neon Glow Surge */
    focus:outline-none focus:ring-2 focus:ring-neon-surge/80 focus:ring-offset-0 
    focus:border-neon-surge focus:bg-foundation-light/80 
    focus:shadow-[0_0_25px_rgba(74,255,172,0.4)]

    /* Disabled State */
    disabled:cursor-not-allowed disabled:opacity-40
  `;
  
  // --- TEXTAREA RENDER ---
  if (props.as === 'textarea') {
    const { as, className, ...rest } = props;
    return (
      <textarea
        className={`${baseClassName.replace('h-10', 'h-auto')} py-3 ${className}`}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        rows={4} // Default rows for usability
        {...rest}
      />
    );
  }

  // --- SELECT RENDER ---
  if (props.as === 'select') {
    const { as, className, children, ...rest } = props;
    
    // Wrap select to correctly position the custom arrow icon
    return (
      <div className="relative w-full">
        <select
          className={`${baseClassName} h-10 appearance-none pr-8 cursor-pointer ${className}`}
          ref={ref as React.Ref<HTMLSelectElement>}
          {...rest}
        >
          {children}
        </select>
        {/* Custom Arrow Icon */}
        <ChevronDown 
            className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 pointer-events-none text-neon-surge/70"
        />
      </div>
    );
  }

  // --- INPUT RENDER (DEFAULT) ---
  const { as, className, type, ...rest } = props;
  return (
    <input
      type={type}
      className={`${baseClassName} ${className}`}
      ref={ref as React.Ref<HTMLInputElement>}
      {...rest}
    />
  );
});

Input.displayName = 'Input';