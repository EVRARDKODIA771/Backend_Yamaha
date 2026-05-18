const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://yamaha-sty-webs.vercel.app",
].filter(Boolean);

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
console.log("ALLOWED_ORIGINS =", allowedOrigins);

// ======================================================
// CORS
// ======================================================

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS BLOCKED:", origin);
    return callback(new Error("CORS non autorisé"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Réponse directe aux requêtes preflight
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;

    if (!origin || allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin || "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.sendStatus(204);
    }
  }

  next();
});

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// REQUEST LOGGER
// ======================================================

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/Auth");

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Yamaha Backend API Running",
    environment: process.env.NODE_ENV,
  });
});

app.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: "healthy",
  });
});

app.use("/auth", authRoutes);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} introuvable`,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:");
  console.error(err);

  return res.status(500).json({
    success: false,
    error: err.message || "Erreur serveur",
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
==================================================
🚀 Yamaha Backend Running
==================================================
PORT        : ${PORT}
ENVIRONMENT : ${process.env.NODE_ENV}
FRONTEND    : ${process.env.FRONTEND_URL}
==================================================
`);
});
