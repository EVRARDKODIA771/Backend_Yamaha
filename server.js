const express = require("express");
const cors = require("cors");

const app = express();

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());

app.use(cors({
  origin: "https://yamaha-sty-webs.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Server running"
  });

});

// ======================================================
// ROUTES
// ======================================================

// app.use("/auth", require("./routes/Auth"));

// ======================================================
// PORT
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("SERVER STARTED ON", PORT);

});
