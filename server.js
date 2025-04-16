const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const configRoutes = require("./routes/configRoutes");
const { port } = require("./config/env");
const { db } = require("./config/db");

const taskRoutes = require("./routes/taskRoutes");

// Load environment variables
dotenv.config();

const app = express();

// ✅ Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ CSRF Protection (Only in Production)
// if (process.env.NODE_ENV === "production") {
    app.use(csrf({ cookie: true }));
    app.get("/api/csrf-token", (req, res) => res.json({ csrfToken: req.csrfToken() }));
// }

// ✅ Rate Limiter (Adjust limits in production)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 100 : 1000,
    message: "Too many requests, please try again later."
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/config", configRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => res.json({ message: `🚀 Task Management API running in ${process.env.NODE_ENV} mode` }));

// ✅ Global Error Handler


// ✅ Start Server
const startServer = async () => {
  try {
    // Database connection is already tested in db.js
    const server = app.listen(port, () => 
      console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`)
    );
    
    // Export for testing
    module.exports = { app, server };
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
