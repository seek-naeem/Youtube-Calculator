import { users, type User, type InsertUser, currencies, trendingNiches, earningsCalculations, type Currency, type TrendingNiche, type EarningsCalculation, type InsertCurrency, type InsertTrendingNiche, type InsertEarningsCalculation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Currency operations
  getCurrencies(): Promise<Currency[]>;
  getCurrency(code: string): Promise<Currency | undefined>;
  createCurrency(currency: InsertCurrency): Promise<Currency>;
  
  // Trending niches operations
  getTrendingNiches(): Promise<TrendingNiche[]>;
  getTrendingNiche(id: number): Promise<TrendingNiche | undefined>;
  createTrendingNiche(niche: InsertTrendingNiche): Promise<TrendingNiche>;
  
  // Earnings calculations
  saveEarningsCalculation(calculation: InsertEarningsCalculation): Promise<EarningsCalculation>;
  getEarningsCalculations(): Promise<EarningsCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currencies: Map<string, Currency>;
  private trendingNiches: Map<number, TrendingNiche>;
  private earningsCalculations: Map<number, EarningsCalculation>;
  private currentUserId: number;
  private currentNicheId: number;
  private currentCalculationId: number;

  constructor() {
    this.users = new Map();
    this.currencies = new Map();
    this.trendingNiches = new Map();
    this.earningsCalculations = new Map();
    this.currentUserId = 1;
    this.currentNicheId = 1;
    this.currentCalculationId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize currencies
    const defaultCurrencies: Currency[] = [
      { id: 1, code: "USD", name: "US Dollar", symbol: "$", rate: 1.0 },
      { id: 2, code: "EUR", name: "Euro", symbol: "€", rate: 0.85 },
      { id: 3, code: "GBP", name: "British Pound", symbol: "£", rate: 0.75 },
      { id: 4, code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25 },
      { id: 5, code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.35 },
      { id: 6, code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 110.0 },
    ];

    defaultCurrencies.forEach(currency => {
      this.currencies.set(currency.code, currency);
    });

    // Initialize trending niches
    const defaultNiches: TrendingNiche[] = [
      {
        id: 1,
        name: "Gaming",
        description: "RPM: $1.5-$3.2",
        minRpm: 1.5,
        maxRpm: 3.2,
        status: "High Growth",
        statusColor: "green",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        growthRate: "85%"
      },
      {
        id: 2,
        name: "Tech Reviews",
        description: "RPM: $2.1-$4.0",
        minRpm: 2.1,
        maxRpm: 4.0,
        status: "Premium CPM",
        statusColor: "blue",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        growthRate: "72%"
      },
      {
        id: 3,
        name: "Education",
        description: "RPM: $0.8-$2.5",
        minRpm: 0.8,
        maxRpm: 2.5,
        status: "Stable",
        statusColor: "purple",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        growthRate: "45%"
      },
      {
        id: 4,
        name: "Finance",
        description: "RPM: $3.0-$8.0",
        minRpm: 3.0,
        maxRpm: 8.0,
        status: "High Value",
        statusColor: "amber",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        growthRate: "94%"
      },
    ];

    defaultNiches.forEach(niche => {
      this.trendingNiches.set(niche.id, niche);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCurrencies(): Promise<Currency[]> {
    return Array.from(this.currencies.values());
  }

  async getCurrency(code: string): Promise<Currency | undefined> {
    return this.currencies.get(code);
  }

  async createCurrency(insertCurrency: InsertCurrency): Promise<Currency> {
    const currency: Currency = { ...insertCurrency, id: this.currencies.size + 1 };
    this.currencies.set(currency.code, currency);
    return currency;
  }

  async getTrendingNiches(): Promise<TrendingNiche[]> {
    return Array.from(this.trendingNiches.values());
  }

  async getTrendingNiche(id: number): Promise<TrendingNiche | undefined> {
    return this.trendingNiches.get(id);
  }

  async createTrendingNiche(insertNiche: InsertTrendingNiche): Promise<TrendingNiche> {
    const id = this.currentNicheId++;
    const niche: TrendingNiche = { ...insertNiche, id };
    this.trendingNiches.set(id, niche);
    return niche;
  }

  async saveEarningsCalculation(insertCalculation: InsertEarningsCalculation): Promise<EarningsCalculation> {
    const id = this.currentCalculationId++;
    const calculation: EarningsCalculation = { ...insertCalculation, id };
    this.earningsCalculations.set(id, calculation);
    return calculation;
  }

  async getEarningsCalculations(): Promise<EarningsCalculation[]> {
    return Array.from(this.earningsCalculations.values());
  }
}

export const storage = new MemStorage();
