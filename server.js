const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// ======================================================
// IMPORT ROUTES
// ======================================================

const authRoutes = require("./routes/Auth");


// ======================================================
// DEBUG
// ======================================================

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);


// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(
  cors({

    origin: (origin, callback) => {

      // Postman / mobile / curl
      if (!origin) {

        return callback(null, true);

      }

      // Frontend autorisé
      if (allowedOrigins.includes(origin)) {

        return callback(null, true);

      }

      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error("CORS non autorisé")
      );

    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

  })
);


// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================================
// REQUEST LOGGER
// ======================================================

app.use((req, res, next) => {

  console.log(
    `[${req.method}] ${req.originalUrl}`
  );

  next();

});


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {

  return res.json({
    success: true,
    message: "Yamaha Backend API Running",
    environment: process.env.NODE_ENV,
  });

});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (req, res) => {

  return res.json({
    success: true,
    status: "healthy",
  });

});


// ======================================================
// AUTH ROUTES
// ======================================================

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
    error:
      err.message ||
      "Erreur serveur",
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
