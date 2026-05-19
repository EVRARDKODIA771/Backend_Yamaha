const { createClient } =
    require("@supabase/supabase-js");

// ======================================================
// ENV CHECK
// ======================================================

console.log("====================================");
console.log("SUPABASE CLIENT INITIALIZATION");

console.log(
    "SUPABASE_URL =",
    process.env.SUPABASE_URL
);

console.log(
    "SUPABASE_SECRET_KEY EXISTS =",
    !!process.env.SUPABASE_SECRET_KEY
);

console.log("====================================");

// ======================================================
// VALIDATION
// ======================================================

if (!process.env.SUPABASE_URL) {

    throw new Error(
        "SUPABASE_URL is missing"
    );

}

if (!process.env.SUPABASE_SECRET_KEY) {

    throw new Error(
        "SUPABASE_SECRET_KEY is missing"
    );

}

// ======================================================
// CLIENT
// ======================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    supabase
};
