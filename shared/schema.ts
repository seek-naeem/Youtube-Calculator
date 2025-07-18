import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  rate: real("rate").notNull().default(1.0),
});

export const trendingNiches = pgTable("trending_niches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  minRpm: real("min_rpm").notNull(),
  maxRpm: real("max_rpm").notNull(),
  status: text("status").notNull(),
  statusColor: text("status_color").notNull(),
  imageUrl: text("image_url").notNull(),
  growthRate: text("growth_rate"),
});

export const earningsCalculations = pgTable("earnings_calculations", {
  id: serial("id").primaryKey(),
  dailyViews: integer("daily_views").notNull(),
  rpm: real("rpm").notNull(),
  currency: text("currency").notNull(),
  dailyEarnings: real("daily_earnings").notNull(),
  monthlyEarnings: real("monthly_earnings").notNull(),
  yearlyEarnings: real("yearly_earnings").notNull(),
  createdAt: text("created_at").notNull(),
});

export const youtubeVideos = pgTable("youtube_videos", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  channelName: text("channel_name").notNull(),
  subscriberCount: integer("subscriber_count").notNull(),
  viewCount: integer("view_count").notNull(),
  likeCount: integer("like_count"),
  publishedAt: text("published_at").notNull(),
  duration: text("duration"),
  description: text("description"),
});

export const insertCurrencySchema = createInsertSchema(currencies).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertTrendingNicheSchema = createInsertSchema(trendingNiches).omit({
  id: true,
});

export const insertEarningsCalculationSchema = createInsertSchema(earningsCalculations).omit({
  id: true,
});

export const insertYoutubeVideoSchema = createInsertSchema(youtubeVideos).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type TrendingNiche = typeof trendingNiches.$inferSelect;
export type EarningsCalculation = typeof earningsCalculations.$inferSelect;
export type YoutubeVideo = typeof youtubeVideos.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCurrency = z.infer<typeof insertCurrencySchema>;
export type InsertTrendingNiche = z.infer<typeof insertTrendingNicheSchema>;
export type InsertEarningsCalculation = z.infer<typeof insertEarningsCalculationSchema>;
export type InsertYoutubeVideo = z.infer<typeof insertYoutubeVideoSchema>;
