const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

process.env.JWT_SECRET = process.env.JWT_SECRET || "vibe-ink-jwt-secret-key";

const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);

const allowedOrigins =
  process.env.VITE_FRONTEND_URL || "https://sharehere-frontend.onrender.com";

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Setup Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// socket.IO handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io to use in your routes
module.exports = { io, app, server };

// Connect to MongoDB with graceful fallback
mongoose.set("bufferCommands", false);
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
      console.warn(
        "MongoDB not connected — continuing with offline fallback:",
        err.message,
      ),
    );
} else {
  console.warn(
    "MONGO_URI not provided — running with graceful offline fallback",
  );
}

// API health route
app.get("/", (req, res) => {
  res.json({ status: "ok", name: "Vibe Ink" });
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const sentenceRoutes = require("./routes/sentence");
app.use("/api/sentence", sentenceRoutes);

const crudRoutes = require("./routes/crud");
app.use("/api/crud", crudRoutes);

const userRoute = require("./routes/user");
app.use("/api/user", userRoute);

// Database offline error fallback middleware
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongooseServerSelectionError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn(
      "[AI Studio] Database offline — returning mock fallback response for",
      req.path,
    );
    if (req.method === "GET") {
      return res.json(
        req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {},
      );
    }
    return res
      .status(503)
      .json({ error: "Database offline — running in preview mode" });
  }
  next(err);
});

// Static frontend serving for production / built SPA
const distPath = path.resolve(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
