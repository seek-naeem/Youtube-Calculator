import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { Calendar, CalendarDays, CalendarRange, TrendingUp, Download, Share2 } from "lucide-react";

interface EarningsData {
  min: number;
  max: number;
  current: number;
}

interface EarningsDisplayProps {
  earnings: {
    daily: EarningsData;
    monthly: EarningsData;
    yearly: EarningsData;
  };
  currency: string;
  dailyViews: number;
  rpm: number;
}

export function EarningsDisplay({ earnings, currency, dailyViews, rpm }: EarningsDisplayProps) {
  const displayRef = useRef<HTMLDivElement>(null);
  const earningsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (displayRef.current) {
      gsap.from(displayRef.current, {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6
      });
    }
  }, []);

  useEffect(() => {
    // Animate earnings numbers when they change
    earningsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.from(ref, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }, [earnings, currency]);

  const handleExportReport = () => {
    const reportData = {
      dailyViews,
      rpm,
      currency,
      earnings: {
        daily: `${formatCurrency(earnings.daily.min, currency)} - ${formatCurrency(earnings.daily.max, currency)}`,
        monthly: `${formatCurrency(earnings.monthly.min, currency)} - ${formatCurrency(earnings.monthly.max, currency)}`,
        yearly: `${formatCurrency(earnings.yearly.min, currency)} - ${formatCurrency(earnings.yearly.max, currency)}`,
      },
      generatedAt: new Date().toLocaleString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-earnings-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    const shareText = `My YouTube earnings potential: Daily: ${formatCurrency(earnings.daily.min, currency)} - ${formatCurrency(earnings.daily.max, currency)} | Monthly: ${formatCurrency(earnings.monthly.min, currency)} - ${formatCurrency(earnings.monthly.max, currency)} | Yearly: ${formatCurrency(earnings.yearly.min, currency)} - ${formatCurrency(earnings.yearly.max, currency)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'YouTube Earnings Calculator Results',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // You could add a toast notification here
    }
  };

  return (
    <div ref={displayRef} className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
        <TrendingUp className="text-green-600" />
        Estimated Earnings
      </h3>

      {/* Earnings Cards */}
      <div className="space-y-4">
        {/* Daily Earnings */}
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Daily</span>
              </div>
              <div 
                ref={(el) => earningsRefs.current[0] = el}
                className="text-right"
              >
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(earnings.daily.min, currency)} - {formatCurrency(earnings.daily.max, currency)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Current: {formatCurrency(earnings.daily.current, currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Monthly</span>
              </div>
              <div 
                ref={(el) => earningsRefs.current[1] = el}
                className="text-right"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(earnings.monthly.min, currency)} - {formatCurrency(earnings.monthly.max, currency)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Current: {formatCurrency(earnings.monthly.current, currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Earnings */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarRange className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Yearly</span>
              </div>
              <div 
                ref={(el) => earningsRefs.current[2] = el}
                className="text-right"
              >
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(earnings.yearly.min, currency)} - {formatCurrency(earnings.yearly.max, currency)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Current: {formatCurrency(earnings.yearly.current, currency)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown Chart */}
      <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Minimum (Low RPM)</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></div>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(earnings.daily.min, currency)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Current RPM</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(earnings.daily.current, currency)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Maximum (High RPM)</span>
            <div className="flex items-center space-x-2">
              <div className="w-40 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(earnings.daily.max, currency)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={handleExportReport}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button
          onClick={handleShareResults}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
