import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import mailRoutes from "./routes/mail.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root health check endpoint
app.get("/", async (req, res) => {
  let dbStatus = "disconnected";
  try {
    if (process.env.MONGODB_URL) {
      await connectDB();
      dbStatus = "connected";
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.status(200).json({
    status: "ok",
    message: "Coldmailer server is running",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Database connection middleware for all /api routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/mails", mailRoutes);

// Fallback for unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Only listen on port when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
}

export default app;
