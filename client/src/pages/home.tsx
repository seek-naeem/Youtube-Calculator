import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Header } from "@/components/header";
import { TrendingNiches } from "@/components/trending-niches";
import { EarningsCalculator } from "@/components/earnings-calculator";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Search, ChartLine } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (heroRef.current) {
      tl.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
      });
    }

    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 transition-all duration-500">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section ref={heroRef} className="text-center mb-12">
          <h2 className="hero-title text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 animate-float">
            YouTube Earnings Calculator
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Estimate your YouTube earnings potential with our advanced calculator. Get insights into daily, monthly, and yearly revenue based on your channel's performance.
          </p>
          
          <TrendingNiches />
        </section>

        {/* Calculator Section */}
        <EarningsCalculator />

        {/* Additional Features */}
        <section id="analytics" className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Advanced Analytics
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Get deeper insights into your YouTube channel performance
            </p>
          </div>
          
          <div 
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <ChartLine className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Revenue Optimization
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI-powered recommendations to maximize your earnings potential
                </p>
              </CardContent>
            </Card>

            <Card className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Audience Analytics
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deep dive into your audience demographics and behavior patterns
                </p>
              </CardContent>
            </Card>

            <Card className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Competitor Analysis
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compare your performance against similar channels in your niche
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
