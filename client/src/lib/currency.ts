export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbol = currencySymbols[currencyCode] || '$';
  
  if (currencyCode === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
};

export const convertCurrency = (amount: number, fromRate: number, toRate: number): number => {
  return (amount / fromRate) * toRate;
};

export const calculateEarnings = (
  views: number,
  rpm: number,
  period: 'daily' | 'monthly' | 'yearly'
): { min: number; max: number; current: number } => {
  const minRPM = 0.25;
  const maxRPM = 4.00;
  
  const multipliers = {
    daily: 1,
    monthly: 30,
    yearly: 365
  };
  
  const multiplier = multipliers[period];
  const dailyEarnings = views / 1000; // RPM is per 1000 views
  
  return {
    min: dailyEarnings * minRPM * multiplier,
    max: dailyEarnings * maxRPM * multiplier,
    current: dailyEarnings * rpm * multiplier
  };
};
