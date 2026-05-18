const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ======================================================
// CORS MANUEL - DOIT ÊTRE AVANT TOUT
// ======================================================

app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log("ORIGIN =", origin);
  console.log("METHOD =", req.method);
  console.log("URL =", req.originalUrl);

  res.setHeader(
    "Access-Control-Allow-Origin",
    origin || "https://yamaha-sty-webs.vercel.app"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/Auth");

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Yamaha Backend API Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
  });
});

app.use("/auth", authRoutes);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} introuvable`,
  });
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Erreur serveur",
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Yamaha Backend running on port ${PORT}`);
});
