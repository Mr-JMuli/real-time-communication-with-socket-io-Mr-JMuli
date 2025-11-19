import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import socketHandler from "./socket/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://real-time-communication-with-socket-alpha-five.vercel.app",
];

// EXPRESS CORS (Fix #1)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: "uploads/" });

// In-memory data stores
export const users = new Map();
export const onlineUsers = new Set();
export const rooms = new Map();
export const messages = new Map();

// SOCKET.IO SERVER WITH CORRECT CORS (Fix #2)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// API: Login (JWT)
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const token = jwt.sign({ username }, "secret-key-chat-2025", {
    expiresIn: "7d",
  });

  res.json({ token, username });
});

// API: File Upload
app.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `${process.env.SERVER_URL || "https://real-time-communication-with-socket-io-9voy.onrender.com"}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// SOCKET HANDLER
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
