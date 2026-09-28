const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const queueRoutes = require("./routes/queue");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "https://kqueueless.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

// Port
const PORT = process.env.PORT || 5000;

// Create HTTP server FIRST
const server = http.createServer(app);

// Create Socket.IO SECOND
const io = new Server(server, {
  cors: {
    origin: "https://kqueueless.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Routes AFTER io exists
app.use("/api/auth", authRoutes);

app.use("/api/queues", queueRoutes(io));

app.get("/", (req, res) => {
  res.send("QueueLess Backend is running");
});

// Socket.IO
io.on("connection", (socket) => {
  socket.on("joinQueue", (queueId) => {
    socket.join(`queue_${queueId}`);
  });

  socket.on("disconnect", () => {});
});

// Start server LAST
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
