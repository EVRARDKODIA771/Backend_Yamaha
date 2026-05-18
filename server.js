const express = require("express");
const cors = require("cors");

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
      "https://yamaha-sty-webs.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| ROOT ROUTE
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Yamaha API Running",
  });
});

/*
|--------------------------------------------------------------------------
| PORT
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Yamaha Backend running on port ${PORT}`);
});
