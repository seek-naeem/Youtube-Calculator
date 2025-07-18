import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
// import { setupVite, serveStatic } from "./vite.js"; // Commented for now

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    capturedJsonResponse = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 50)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
  console.error(`Error: ${status} - ${err.message}`);
});

// API Endpoint
app.get("/api/trending-niches", (req: Request, res: Response) => {
  const trendingNiches = [
    {
      id: 1,
      name: "Tech",
      status: "Hot",
      statusColor: "blue",
      imageUrl: "/tech.jpg",
      description: "Tech tutorials",
      growthRate: "10%",
    },
    {
      id: 2,
      name: "Gaming",
      status: "Trending",
      statusColor: "green",
      imageUrl: "/gaming.jpg",
      description: "Gaming reviews",
      growthRate: "15%",
    },
  ];
  res.status(200).json(trendingNiches);
});

// Server setup
const server = createServer(app);

(async () => {
  try {
    // Uncomment when vite setup is available
    /*
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server, {
        proxy: {
          "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      });
      console.log("Vite setup completed");
    } else {
      serveStatic(app);
      console.log("Serving static files");
    }
    */

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    const tryPort = (p: number) => {
      server
        .listen(p, "localhost", () => {
          console.log(`Server running on http://localhost:${p}`);
        })
        .on("error", (err: any) => {
          if (err.code === "EADDRINUSE" && p < 3010) {
            console.log(`Port ${p} in use, trying ${p + 1}`);
            tryPort(p + 1);
          } else {
            console.error(`Server error: ${err.message}`);
          }
        });
    };

    tryPort(port);
  } catch (error) {
    console.error(`Failed to start server: ${(error as Error).message}`);
  }
})();
