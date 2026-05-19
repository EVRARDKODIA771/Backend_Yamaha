const express = require("express");
const cors = require("cors");

console.log("====================================");
console.log("BOOTING SERVER...");
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("PORT =", process.env.PORT);

console.log(
    "SUPABASE_URL =",
    process.env.SUPABASE_URL
);

console.log(
    "SUPABASE_SECRET_KEY EXISTS =",
    !!process.env.SUPABASE_SECRET_KEY
);

console.log(
    "JWT_SECRET EXISTS =",
    !!process.env.JWT_SECRET
);

console.log("====================================");

const app = express();

// ======================================================
// GLOBAL REQUEST LOGGER
// ======================================================

app.use((req, res, next) => {

    console.log("====================================");
    console.log("NEW REQUEST");
    console.log("METHOD :", req.method);
    console.log("URL :", req.originalUrl);
    console.log("ORIGIN :", req.headers.origin);
    console.log("====================================");

    next();

});

// ======================================================
// JSON
// ======================================================

app.use(express.json());

// ======================================================
// CORS
// ======================================================

const corsOptions = {

    origin: process.env.FRONTEND_URL,

    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: true

};

console.log("CORS CONFIG =", corsOptions);

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// ======================================================
// ROOT
// ======================================================

app.get("/", (req, res) => {

    console.log("ROOT ROUTE HIT");

    res.json({
        success: true,
        message: "Server running"
    });

});

// ======================================================
// AUTH ROUTES
// ======================================================

try {

    console.log("LOADING AUTH ROUTES...");

    const authRoutes =
        require("./routes/Auth");

    console.log(
        "AUTH ROUTES LOADED SUCCESSFULLY"
    );

    app.use("/auth", authRoutes);

    console.log(
        "AUTH ROUTES REGISTERED ON /auth"
    );

} catch (error) {

    console.error(
        "FAILED TO LOAD AUTH ROUTES"
    );

    console.error(error);

}

// ======================================================
// 404
// ======================================================

app.use((req, res) => {

    console.log(
        "404 ROUTE NOT FOUND :",
        req.originalUrl
    );

    res.status(404).json({
        success: false,
        error: "Route not found"
    });

});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error("====================================");
    console.error("GLOBAL SERVER ERROR");
    console.error(err);
    console.error("====================================");

    res.status(500).json({
        success: false,
        error: err.message
    });

});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("====================================");
    console.log("SERVER STARTED SUCCESSFULLY");
    console.log("LISTENING ON PORT", PORT);
    console.log("====================================");

});
