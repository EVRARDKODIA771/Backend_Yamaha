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
// CORS
// ======================================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Autorise Postman, mobile apps, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS non autorisé")
      );
    },

    credentials: true,
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
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Backend Yamaha API Running",
    environment: process.env.NODE_ENV,
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

  res.status(404).json({
    success: false,
    error: "Route introuvable",
  });

});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

  console.error(err);

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
