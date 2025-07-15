import { MorphingLogo } from "./morphing-logo";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    // Theme transition animation
    gsap.fromTo(document.body, 
      { opacity: 0.8 }, 
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };

  return (
    <header 
      ref={headerRef}
      className="glass-morphism sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/20 dark:border-slate-700/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <MorphingLogo />

          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#calculator" 
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Calculator
            </a>
            <a 
              href="#trends" 
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Trends
            </a>
            <a 
              href="#analytics" 
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Analytics
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="relative w-12 h-7 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}>
                <Sun className={`w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-500 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
                <Moon className={`w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-400 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
