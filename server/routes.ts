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

  // YouTube video/channel import endpoint  
  app.post("/api/youtube-import", async (req, res) => {
    try {
      const { channelUrl } = req.body;
      
      // Function to extract video ID from URL
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
        // Mock video data - in real implementation this would call YouTube Data API
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
          avgDailyViews: Math.floor(875000 / 30), // Rough estimate
          estimatedRpm: 2.85,
          niche: "Tech Reviews",
          success: true,
          type: "video"
        };
        
        res.json(mockVideoData);
      } else {
        // Mock channel data
        const mockChannelData = {
          channelName: "Sample Creator",
          subscriberCount: 125000,
          avgDailyViews: 5500,
          estimatedRpm: 2.45,
          niche: "Tech Reviews",
          success: true,
          type: "channel"
        };
        
        res.json(mockChannelData);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to import YouTube data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
