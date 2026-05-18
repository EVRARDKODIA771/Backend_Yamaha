const { createClient } =
    require("@supabase/supabase-js");

require("dotenv").config();

// ======================================================
// ENV CHECK
// ======================================================

if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
) {

    throw new Error(
        "Missing Supabase environment variables"
    );

}

// ======================================================
// SUPABASE CLIENT
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
