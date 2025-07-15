import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TrendingNiche } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingNiches() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const { data: niches, isLoading, error } = useQuery<TrendingNiche[]>({
    queryKey: ["/api/trending-niches"],
  });

  useEffect(() => {
    if (niches && cardsRef.current.length > 0) {
      gsap.from(cardsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    }
  }, [niches]);

  const getStatusColor = (color: string) => {
    const colors = {
      green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
      amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (error) {
    return (
      <div className="mb-12 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load trending niches</p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="mb-12" id="trends">
      <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">
        🔥 Trending YouTube Niches
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10">
              <CardContent className="p-6">
                <Skeleton className="w-full h-32 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          niches?.map((niche, index) => (
            <Card
              key={niche.id}
              ref={(el) => el && (cardsRef.current[index] = el)}
              className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "power2.out" });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
              }}
            >
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img 
                    src={niche.imageUrl} 
                    alt={niche.name}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {niche.name}
                </h4>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {niche.description}
                </p>
                
                <Badge className={getStatusColor(niche.statusColor)}>
                  {niche.status}
                </Badge>
                
                {niche.growthRate && (
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Growth: {niche.growthRate}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
