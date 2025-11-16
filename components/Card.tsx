import React, { forwardRef } from 'react';

// Use a cleaner type for props, extending HTML attributes for a standard div element.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * ZAP Card Component
 * A stylized container for content blocks, utilizing forwardRef for external DOM access.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...props }, ref) => {
    // Base styles for the card chassis. Added a subtle shadow and hover effect.
    const baseClasses = 'bg-foundation-light border border-[#333] rounded-xl transition-all duration-300 shadow-md hover:shadow-neon-surge/10';

    return (
      <div
        // Pass the ref to the native DOM element
        ref={ref}
        // Merge base styling with any incoming class names
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Add a display name for better debugging visibility in React DevTools.
Card.displayName = 'Card';

