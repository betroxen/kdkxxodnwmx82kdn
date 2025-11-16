import React from 'react';

/**
 * SkeletonCard component for displaying a shimmering loading state.
 * Uses inline CSS to define the custom 'shimmer' keyframe animation.
 */
export const SkeletonCard: React.FC = () => {
  return (
    <>
      {/* Injecting custom keyframes for the shimmering effect.
        The animation translates a semi-transparent gradient across the component. 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
      `}} />

      <div className="bg-[#1e293b] border border-[#333333] rounded-xl p-0 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <div className="relative w-full h-full p-5 space-y-4 overflow-hidden bg-[#1e293b] ">
          
          {/* Shimmer Overlay: Applied to the inner container */}
          <div className="absolute inset-0 z-10 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent pointer-events-none">
            {/* The actual skeleton structure below this overlay */}
            
            {/* Header section (Icon + Title/Subtitle) */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#0f172a] flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 rounded bg-[#0f172a]"></div>
                    <div className="h-3 w-1/2 rounded bg-[#0f172a]"></div>
                </div>
            </div>

            {/* Body section (Text lines) */}
            <div className="space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-[#0f172a]"></div>
                <div className="h-4 w-5/6 rounded bg-[#0f172a]"></div>
                <div className="h-4 w-3/4 rounded bg-[#0f172a]"></div>
            </div>

            {/* Footer section (Action button placeholder) */}
            <div className="pt-6">
                <div className="h-10 w-1/3 rounded-lg bg-[#0f172a]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

