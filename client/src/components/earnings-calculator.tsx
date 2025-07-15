import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Currency } from "@shared/schema";
import { formatCurrency, calculateEarnings } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Eye, DollarSign, Globe, Youtube, Search } from "lucide-react";
import { EarningsDisplay } from "./earnings-display";

export function EarningsCalculator() {
  const [dailyViews, setDailyViews] = useState(2000);
  const [rpm, setRpm] = useState(1.5);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [channelUrl, setChannelUrl] = useState("");
  
  const calculatorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currencies, isLoading: currenciesLoading } = useQuery<Currency[]>({
    queryKey: ["/api/currencies"],
  });

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/earnings-calculation", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/earnings-calculations"] });
      toast({
        title: "Calculation Saved",
        description: "Your earnings calculation has been saved successfully.",
      });
    },
  });

  const youtubeImportMutation = useMutation({
    mutationFn: async (channelUrl: string) => {
      const response = await apiRequest("POST", "/api/youtube-import", { channelUrl });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setDailyViews(data.avgDailyViews);
        setRpm(data.estimatedRpm);
        toast({
          title: "Channel Imported",
          description: `Successfully imported data for ${data.channelName}`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Import Failed",
        description: "Failed to import channel data. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (calculatorRef.current) {
      gsap.from(calculatorRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.4
      });
    }
  }, []);

  const handleSaveCalculation = () => {
    const currency = currencies?.find(c => c.code === selectedCurrency);
    if (!currency) return;

    const { current: dailyEarnings } = calculateEarnings(dailyViews, rpm, 'daily');
    const { current: monthlyEarnings } = calculateEarnings(dailyViews, rpm, 'monthly');
    const { current: yearlyEarnings } = calculateEarnings(dailyViews, rpm, 'yearly');

    saveCalculationMutation.mutate({
      dailyViews,
      rpm,
      currency: selectedCurrency,
      dailyEarnings,
      monthlyEarnings,
      yearlyEarnings,
      createdAt: new Date().toISOString(),
    });
  };

  const handleYoutubeImport = () => {
    if (channelUrl.trim()) {
      youtubeImportMutation.mutate(channelUrl);
    }
  };

  const earnings = {
    daily: calculateEarnings(dailyViews, rpm, 'daily'),
    monthly: calculateEarnings(dailyViews, rpm, 'monthly'),
    yearly: calculateEarnings(dailyViews, rpm, 'yearly'),
  };

  return (
    <section id="calculator" className="max-w-6xl mx-auto">
      <Card 
        ref={calculatorRef}
        className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-2xl"
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            <Calculator className="text-indigo-600" />
            YouTube Earnings Calculator
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Inputs */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Calculator Settings
              </h3>

              {/* YouTube Import */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  Import YouTube Channel (Optional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter channel URL or @handle"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                  <Button
                    onClick={handleYoutubeImport}
                    disabled={youtubeImportMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Daily Views */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Daily Views
                </Label>
                <Input
                  type="number"
                  value={dailyViews}
                  onChange={(e) => setDailyViews(Number(e.target.value))}
                  min="0"
                  className="text-lg font-semibold bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                />
              </div>

              {/* RPM Slider */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Estimated RPM (Revenue Per Mille)
                </Label>
                <div className="px-2">
                  <Slider
                    value={[rpm]}
                    onValueChange={(value) => setRpm(value[0])}
                    max={4}
                    min={0.25}
                    step={0.05}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>$0.25</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ${rpm.toFixed(2)}
                  </span>
                  <span>$4.00</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  RPM varies based on content niche, audience location, and ad engagement rates.
                </p>
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  Currency
                </Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies?.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveCalculation}
                disabled={saveCalculationMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
              >
                {saveCalculationMutation.isPending ? "Saving..." : "Save Calculation"}
              </Button>
            </div>

            {/* Right side - Results */}
            <EarningsDisplay 
              earnings={earnings} 
              currency={selectedCurrency}
              dailyViews={dailyViews}
              rpm={rpm}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
