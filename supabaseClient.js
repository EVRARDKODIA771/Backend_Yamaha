const { createClient } =
    require("@supabase/supabase-js");

require("dotenv").config();

const supabase = createClient(
    process.env.SUPABASE_URL_,
    process.env.SUPABASE_SECRET_KEY_
);

module.exports = {
    supabase
};
