import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./config/index";
import prisma from "./config/db";
import path from "path";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import customerRoutes from "./routes/customerRoutes";
import tenderRoutes from "./routes/tenderRoutes";
import sectorRoutes from "./routes/sectorRoutes";
import locationRoutes from "./routes/locationRoutes";
import addressRoutes from "./routes/addressRoutes";
import contactRoutes from "./routes/contactRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import socialMediaRoutes from "./routes/socialMedia";
import customerNoteRoutes from "./routes/customerNoteRoutes";
import sliderRoutes from "./routes/sliderRoutes";
import blogRoutes from "./routes/blogRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import caRoutes from "./routes/caRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import cookieParser from "cookie-parser";
import { startTTLJob } from "./jobs/ttlJob";
import dashboardRoutes from "./routes/dashboardRoutes";
const app: Express = express();

// Middleware

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Add this to allow loading images
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true, // Allow credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS first
app.use(cors(corsOptions));

// Then set up static file serving
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/uploads", express.static("/var/www/uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/tenders", tenderRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/customer-notes", customerNoteRoutes);
app.use("/api/socialmedia", socialMediaRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/ca", caRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Graceful shutdown handler
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Starting graceful shutdown...");

  // Close the Prisma connection
  await prisma.$disconnect();

  // Close the server
  process.exit(0);
});

// Start server function
const startServer = async () => {
  try {
    // Start the TTL job
    startTTLJob();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Execute server start
startServer();

export default app;
