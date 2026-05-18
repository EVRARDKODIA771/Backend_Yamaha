import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL_,
    process.env.SUPABASE_SECRET_KEY_
);
