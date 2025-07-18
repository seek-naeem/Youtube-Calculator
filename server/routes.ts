import type { Express } from "express";
import { createServer, type Server } from "http";

// Mock storage implementation
const mockStorage = {
  getCurrencies: async () => [{ code: "USD", name: "US Dollar" }, { code: "INR", name: "Indian Rupee" }],
  getTrendingNiches: async () => [
    { id: 1, name: "Tech", status: "Hot", statusColor: "blue", imageUrl: "/tech.jpg", description: "Tech tutorials", growthRate: "10%" },
    { id: 2, name: "Gaming", status: "Trending", statusColor: "green", imageUrl: "/gaming.jpg", description: "Gaming reviews", growthRate: "15%" },
  ],
  saveEarningsCalculation: async (data: any) => data,
  getEarningsCalculations: async () => [],
};

import { insertEarningsCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/currencies", async (req, res) => {
    try {
      const currencies = await mockStorage.getCurrencies();
      res.json(currencies || []);
    } catch (error) {
      console.log(`Error in /api/currencies: ${(error as Error).message}`);
      res.status(500).json({ error: "Failed to fetch currencies" });
    }
  });

  app.get("/api/trending-niches", async (req, res) => {
    try {
      const niches = await mockStorage.getTrendingNiches();
      if (!niches || niches.length === 0) {
        const mockNiches = [
          { id: 1, name: "Tech", status: "Hot", statusColor: "blue", imageUrl: "/tech.jpg", description: "Tech tutorials", growthRate: "10%" },
          { id: 2, name: "Gaming", status: "Trending", statusColor: "green", imageUrl: "/gaming.jpg", description: "Gaming reviews", growthRate: "15%" },
        ];
        res.json(mockNiches);
      } else {
        res.json(niches);
      }
    } catch (error) {
      console.log(`Error in /api/trending-niches: ${(error as Error).message}`);
      res.status(500).json({ error: "Failed to fetch trending niches" });
    }
  });

  app.post("/api/earnings-calculation", async (req, res) => {
    try {
      const validatedData = insertEarningsCalculationSchema.parse(req.body);
      const calculation = await mockStorage.saveEarningsCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        console.log(`Error in /api/earnings-calculation: ${(error as Error).message}`);
        res.status(500).json({ error: "Failed to save calculation" });
      }
    }
  });

  app.get("/api/earnings-calculations", async (req, res) => {
    try {
      const calculations = await mockStorage.getEarningsCalculations();
      res.json(calculations || []);
    } catch (error) {
      console.log(`Error in /api/earnings-calculations: ${(error as Error).message}`);
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  app.post("/api/youtube-import", async (req, res) => {
    try {
      const { channelUrl } = req.body;
      if (!channelUrl || typeof channelUrl !== "string") {
        return res.status(400).json({ error: "channelUrl is required and must be a string" });
      }

      const extractVideoId = (url: string): string | null => {
        const patterns = [
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
          /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) return match[1];
        }
        return null;
      };
      
      const videoId = extractVideoId(channelUrl);
      
      if (videoId) {
        const mockVideoData = {
          videoId,
          title: "Amazing Tech Review - iPhone 15 Pro Max",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          channelName: "TechReviewer Pro",
          subscriberCount: 1250000,
          viewCount: 875000,
          likeCount: 45000,
          publishedAt: "2024-01-15T10:30:00Z",
          duration: "12:45",
          description: "Complete review of the latest iPhone with detailed analysis...",
          avgDailyViews: Math.floor(875000 / 30),
          estimatedRpm: 2.85,
          niche: "Tech Reviews",
          success: true,
          type: "video",
        };
        res.json(mockVideoData);
      } else {
        const mockChannelData = {
          channelName: "Sample Creator",
          subscriberCount: 125000,
          avgDailyViews: 5500,
          estimatedRpm: 2.45,
          niche: "Tech Reviews",
          success: true,
          type: "channel",
        };
        res.json(mockChannelData);
      }
    } catch (error) {
      console.log(`Error in /api/youtube-import: ${(error as Error).message}`);
      res.status(500).json({ error: "Failed to import YouTube data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}