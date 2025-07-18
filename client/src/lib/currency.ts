export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Add default rate (e.g., relative to USD)
}

export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'Fr',
  CNY: '¥',
  SGD: '$',
  HKD: '$',
  NZD: '$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  ZAR: 'R',
  MXN: '$',
  BRL: 'R$',
  INR: '₹',
  KRW: '₩',
  TRY: '₺',
  RUB: '₽',
  PLN: 'zł',
  THB: '฿',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  AED: 'د.إ',
  SAR: 'ر.س',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  BHD: '.د.ب',
  OMR: 'ر.ع',
  JOD: 'د.ا',
  EGP: '£',
  ILS: '₪',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  ISK: 'kr',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
  ARS: '$',
  VND: '₫',
  UAH: '₴',
  PKR: '₨',
  NGN: '₦',
  GHS: '₵',
};

export const defaultCurrencyRates: Record<string, number> = {
  USD: 1.0, // Base currency
  EUR: 0.92, // Approx rate as of July 2025
  GBP: 0.78,
  JPY: 157.50,
  CAD: 1.36,
  AUD: 1.50,
  CHF: 0.89,
  CNY: 7.25,
  SGD: 1.34,
  HKD: 7.80,
  NZD: 1.65,
  SEK: 10.50,
  NOK: 10.70,
  DKK: 6.90,
  ZAR: 18.20,
  MXN: 20.00,
  BRL: 5.50,
  INR: 83.50,
  KRW: 1375.00,
  TRY: 33.00,
  RUB: 90.00,
  PLN: 4.00,
  THB: 36.50,
  IDR: 16000.00,
  MYR: 4.70,
  PHP: 58.00,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.39,
  JOD: 0.71,
  EGP: 48.00,
  ILS: 3.70,
  CZK: 23.50,
  HUF: 360.00,
  RON: 4.60,
  BGN: 1.80,
  HRK: 6.90,
  ISK: 138.00,
  CLP: 950.00,
  COP: 4200.00,
  PEN: 3.80,
  ARS: 930.00,
  VND: 25000.00,
  UAH: 41.00,
  PKR: 278.00,
  NGN: 1600.00,
  GHS: 15.50,
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbol = currencySymbols[currencyCode] || '$';
  
  if (currencyCode === 'JPY' || currencyCode === 'KRW' || currencyCode === 'IDR' || currencyCode === 'VND') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
};

export const convertCurrency = (amount: number, fromCode: string, toCode: string): number => {
  const fromRate = defaultCurrencyRates[fromCode] || 1.0;
  const toRate = defaultCurrencyRates[toCode] || 1.0;
  return (amount / fromRate) * toRate;
};

export const calculateEarnings = (
  views: number,
  rpm: number,
  period: 'daily' | 'monthly' | 'yearly',
  baseCurrency: string = 'USD'
): { min: number; max: number; current: number } => {
  const minRPM = 0.25;
  const maxRPM = 4.00;
  
  const multipliers = {
    daily: 1,
    monthly: 30,
    yearly: 365,
  };
  
  const multiplier = multipliers[period];
  const dailyEarningsUSD = (views / 1000) * rpm; // Base earnings in USD
  
  return {
    min: convertCurrency(dailyEarningsUSD * minRPM * multiplier, 'USD', baseCurrency),
    max: convertCurrency(dailyEarningsUSD * maxRPM * multiplier, 'USD', baseCurrency),
    current: convertCurrency(dailyEarningsUSD * multiplier, 'USD', baseCurrency),
  };
};