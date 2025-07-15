import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEarningsCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all currencies
  app.get("/api/currencies", async (req, res) => {
    try {
      const currencies = await storage.getCurrencies();
      res.json(currencies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch currencies" });
    }
  });

  // Get trending niches
  app.get("/api/trending-niches", async (req, res) => {
    try {
      const niches = await storage.getTrendingNiches();
      res.json(niches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending niches" });
    }
  });

  // Save earnings calculation
  app.post("/api/earnings-calculation", async (req, res) => {
    try {
      const validatedData = insertEarningsCalculationSchema.parse(req.body);
      const calculation = await storage.saveEarningsCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save calculation" });
      }
    }
  });

  // Get earnings calculations history
  app.get("/api/earnings-calculations", async (req, res) => {
    try {
      const calculations = await storage.getEarningsCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  // Mock YouTube channel import endpoint
  app.post("/api/youtube-import", async (req, res) => {
    try {
      const { channelUrl } = req.body;
      
      // Mock response - in real implementation this would call YouTube API
      const mockChannelData = {
        channelName: "Sample Creator",
        subscriberCount: 125000,
        avgDailyViews: 5500,
        estimatedRpm: 2.45,
        niche: "Tech Reviews",
        success: true
      };

      res.json(mockChannelData);
    } catch (error) {
      res.status(500).json({ error: "Failed to import YouTube channel data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
