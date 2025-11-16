// lib/utils.ts
// ZAPCORE UTILS v3.0 - ELECTRIC WARFARE EDITION
// The only cn() you'll ever need. Violent, merciless, unstoppable.

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() - ClassName merger on fucking steroids
 * 
 * clsx for conditional classes
 * twMerge for Tailwind conflict resolution (last one wins, duplicates obliterated)
 * 
 * Use this everywhere. Never write className without it again.
 * 
 * Example:
 * cn(
 *   "text-white",
 *   isActive && "text-surge glow-surge-lg",
 *   "transition-all duration-300",
 *   size === "huge" && "text-6xl px-16 py-8"
 * )
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optional bonus utils - because why the fuck not
 */

/**
 * delay() - For when you need to fake suspense or throttle degens
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * truncateWallet() - Because nobody wants to read 42 characters
 */
export const truncateWallet = (address: string, chars = 4) => 
  address ? `${address.slice(0, chars + 2)}...${address.slice(-chars)}` : '';

/**
 * formatNumber() - Turn big degen numbers into readable shit
 */
export const formatNumber = (num: number | string, decimals = 2) => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * capitalize() - Because sometimes you need to scream properly
 */
export const capitalize = (str: string) => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * isMobile() - Detect if the degen is on mobile (for touch targets, etc.)
 */
export const isMobile = () => 
  typeof window !== 'undefined' && window.innerWidth < 768;

export default cn;