import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function MorphingLogo() {
  const logoRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    const icon = iconRef.current;
    
    if (!logo || !icon) return;

    // Create morphing animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(logo, {
      duration: 3,
      background: "linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)",
      ease: "power2.inOut"
    })
    .to(icon, {
      duration: 3,
      rotation: 360,
      scale: 1.1,
      ease: "power2.inOut"
    }, "<")
    .to(logo, {
      duration: 3,
      background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
      ease: "power2.inOut"
    })
    .to(icon, {
      duration: 3,
      rotation: 0,
      scale: 1,
      ease: "power2.inOut"
    }, "<");

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(logo, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      gsap.to(icon, { rotation: 180, duration: 0.3, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });
    };

    logo.addEventListener("mouseenter", handleMouseEnter);
    logo.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tl.kill();
      logo.removeEventListener("mouseenter", handleMouseEnter);
      logo.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div 
          ref={logoRef}
          className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center cursor-pointer"
        >
          <div ref={iconRef} className="text-white text-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7.5 9H9V9h2.5v3zm3.5 0h-2.5V9H15v3zm-3.5 3H9v-2h2.5v2zm3.5 0h-2.5v-2H15v2z"/>
            </svg>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-red-500 rounded-full animate-pulse"></div>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
        CreatorCalc
      </h1>
    </div>
  );
}
