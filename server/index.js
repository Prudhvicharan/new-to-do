const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/task-management";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  connectDB();
});

// Routes
app.use("/api/tasks", taskRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ Backend server is running!",
    timestamp: new Date().toISOString(),
    cors: "enabled",
  });
});

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Task Management API",
    status: "running",
    endpoints: {
      tasks: "/api/tasks",
      test: "/api/test",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ["/api/tasks", "/api/test", "/"],
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server with better error handling
const PORT = process.env.PORT || 5000;

// Check if port is available before starting
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Failed to start server on port ${PORT}:`, err.message);
    if (err.code === "EADDRINUSE") {
      console.log(
        `🔍 Port ${PORT} is already in use. Trying alternative ports...`
      );
      // Try alternative ports
      const altPort = PORT + 1;
      app.listen(altPort, () => {
        console.log(
          `🚀 Server is running on port ${altPort} (alternative port)`
        );
        console.log(`📝 API Documentation: http://localhost:${altPort}`);
        console.log(`🧪 Test endpoint: http://localhost:${altPort}/api/test`);
        console.log(`⚠️  Update your frontend API_URL to use port ${altPort}`);
      });
    }
    return;
  }

  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
