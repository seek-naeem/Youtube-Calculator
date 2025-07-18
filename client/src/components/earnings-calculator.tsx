import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { CurrencyData, formatCurrency, calculateEarnings } from '@/lib/currency';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Eye, DollarSign, Globe, Youtube, Search } from 'lucide-react';
import { EarningsDisplay } from './earnings-display';
import { TrendingNiches } from '../components/trending-niches';

interface VideoData {
  title: string;
  views: number;
  duration: string;
  publishedAt: string;
  channelName?: string;
  thumbnail?: string;
}

export default function EarningsCalculator() {
  const [dailyViews, setDailyViews] = useState(2000);
  const [rpm, setRpm] = useState(1.5);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [channelUrl, setChannelUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const currencies: CurrencyData[] = [
    { code: 'USD', name: 'United States Dollar', symbol: '$', rate: 1.0 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.50 },
    // Add other currencies as needed
  ];

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/earnings-calculation', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/earnings-calculations'] });
      toast({ title: 'Calculation Saved', description: 'Your earnings calculation has been saved successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Save Failed', description: `Error: ${error.message}`, variant: 'destructive' });
    },
  });

  const youtubeImportMutation = useMutation({
    mutationFn: async (channelUrl: string) => {
      const videoIdMatch = channelUrl.match(/[?&]v=([^&]+)/) || channelUrl.match(/\/shorts\/([^/?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : channelUrl.split('/').pop();
      if (!videoId) throw new Error('Invalid video URL: No video ID extracted');
      await fetchVideoData(videoId);
      return { success: true, type: 'video' };
    },
    onSuccess: (data) => {
      if (data.success) toast({ title: 'Video Imported', description: `Successfully imported data for the video` });
    },
    onError: (error) => {
      toast({ title: 'Import Failed', description: error.message || 'Failed to import video data.', variant: 'destructive' });
    },
  });

  const API_KEY = 'AIzaSyAPTfYn76MsbWJ59chqIvZCYYtbNhyWrds'; // Replace with valid API key
  const API_URL = 'https://www.googleapis.com/youtube/v3/videos';

  const fetchVideoData = async (videoId: string | undefined) => {
    setLoading(true);
    setError(null);
    const safeVideoId = videoId || '';
    try {
      const response = await fetch(`${API_URL}?part=snippet,statistics,contentDetails&id=${encodeURIComponent(safeVideoId)}&key=${API_KEY}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        setVideoData({
          title: video.snippet.title,
          views: parseInt(video.statistics.viewCount) || 0,
          duration: video.contentDetails.duration.replace('PT', '').replace('S', '') || 'N/A',
          publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
          channelName: video.snippet.channelTitle || 'Unknown',
          thumbnail: video.snippet.thumbnails?.default?.url || '',
        });
        setDailyViews(parseInt(video.statistics.viewCount) / 30 || 0);
        setRpm(1.5);
      } else {
        throw new Error('No video data found for this ID');
      }
    } catch (err) {
      setError(`Failed to fetch video data: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calculatorRef.current) {
      gsap.from(calculatorRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
    }
  }, []);

  const handleSaveCalculation = () => {
    const currency = currencies.find((c) => c.code === selectedCurrency);
    if (!currency) return;
    const { min, max, current } = calculateEarnings(dailyViews, rpm, 'daily', selectedCurrency);
    const monthly = calculateEarnings(dailyViews, rpm, 'monthly', selectedCurrency);
    const yearly = calculateEarnings(dailyViews, rpm, 'yearly', selectedCurrency);
    saveCalculationMutation.mutate({
      dailyViews, rpm, currency: selectedCurrency, dailyEarnings: current, monthlyEarnings: monthly.current, yearlyEarnings: yearly.current, createdAt: new Date().toISOString(),
    });
  };

  const handleYoutubeImport = () => {
    if (channelUrl.trim()) youtubeImportMutation.mutate(channelUrl);
  };

  const earnings = {
    daily: calculateEarnings(dailyViews, rpm, 'daily', selectedCurrency),
    monthly: calculateEarnings(dailyViews, rpm, 'monthly', selectedCurrency),
    yearly: calculateEarnings(dailyViews, rpm, 'yearly', selectedCurrency),
  };

  return (
    <div className="container mx-auto py-8">
      <Card ref={calculatorRef} className="glass-morphism backdrop-blur-lg bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            <Calculator className="text-indigo-600" /> YouTube Earnings Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Calculator Settings</h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" /> Import YouTube Video/Channel (Optional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter video URL or channel URL"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                  <Button
                    onClick={handleYoutubeImport}
                    disabled={youtubeImportMutation.isPending || loading}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                {videoData && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex gap-4">
                      {videoData.thumbnail && (
                        <img
                          src={videoData.thumbnail}
                          alt={videoData.title}
                          className="w-32 h-18 object-cover rounded-lg shadow-md"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/320x180')}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 line-clamp-2">{videoData.title}</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <p><span className="font-medium">Channel:</span> {videoData.channelName}</p>
                          <p><span className="font-medium">Views:</span> {videoData.views.toLocaleString()}</p>
                          <p><span className="font-medium">Duration:</span> {videoData.duration}s</p>
                          <p><span className="font-medium">Published:</span> {videoData.publishedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" /> Daily Views
                </Label>
                <Input
                  type="number"
                  value={dailyViews}
                  onChange={(e) => setDailyViews(Number(e.target.value))}
                  min="0"
                  className="text-lg font-semibold bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" /> Estimated RPM (Revenue Per 1000)
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">${rpm.toFixed(2)}</span>
                  <span>$4.00</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">RPM varies based on content niche, audience location, and ad engagement rates.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" /> Currency
                </Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSaveCalculation}
                disabled={saveCalculationMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
              >
                {saveCalculationMutation.isPending ? 'Saving...' : 'Save Calculation'}
              </Button>
            </div>
            <EarningsDisplay earnings={earnings} currency={selectedCurrency} dailyViews={dailyViews} rpm={rpm} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-12">
        <TrendingNiches />
      </div>
    </div>
  );
}