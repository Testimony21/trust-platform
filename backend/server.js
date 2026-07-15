const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const userRoutes = require("./routes/userRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const dealRoutes = require("./routes/dealRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message"); // <-- create a Message model

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/app", limiter);

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/deals", dealRoutes);

app.get("/", (req, res) => {
  res.send("Trust Platform API Running");
});

// --- Wrap Express with HTTP server ---
const server = http.createServer(app);

// --- Attach Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend URL
    methods: ["GET", "POST"],
  },
});

// --- Socket.IO Middleware (JWT auth optional) ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

// --- Socket.IO Events ---
app.set("io", io); // Make io accessible in routes

io.on("connection", (socket) => {
  console.log("User connected:", socket.user?.id);

  socket.on("joinDeal", (dealId) => {
    socket.join(dealId);
    console.log(`User ${socket.user?.id} joined deal ${dealId}`);
  });

  socket.on("leaveDeal", (dealId) => {
    socket.leave(dealId);
    console.log(`User ${socket.user?.id} left deal ${dealId}`);
  });

  socket.on("sendMessage", async ({ dealId, senderId, text }) => {
    try {
      const message = await Message.create({ dealId, senderId, text });
      io.to(dealId).emit("newMessage", message);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
