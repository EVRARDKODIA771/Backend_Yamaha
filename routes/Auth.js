const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { supabase } =
    require("../supabaseClient");

const router = express.Router();

// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {

    try {

        console.log("REGISTER ROUTE HIT");

        const {
            username,
            email,
            password
        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                error: "Tous les champs sont requis"
            });

        }

        // ==================================================
        // EXISTING USER
        // ==================================================

        const {
            data: existingUser,
            error: existingError
        } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existingError) {

            console.error(existingError);

            return res.status(500).json({
                success: false,
                error: existingError.message
            });

        }

        if (existingUser) {

            return res.status(400).json({
                success: false,
                error: "Utilisateur déjà existant"
            });

        }

        // ==================================================
        // HASH
        // ==================================================

        const password_hash =
            await bcrypt.hash(password, 10);

        // ==================================================
        // INSERT
        // ==================================================

        const {
            data: newUser,
            error: insertError
        } = await supabase
            .from("users")
            .insert([
                {
                    username,
                    email,
                    password_hash,
                    role: "user"
                }
            ])
            .select()
            .single();

        if (insertError) {

            console.error(insertError);

            return res.status(500).json({
                success: false,
                error: insertError.message
            });

        }

        // ==================================================
        // TOKEN
        // ==================================================

        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // ==================================================
        // SUCCESS
        // ==================================================

        return res.json({
            success: true,
            token,

            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {

        console.error(
            "REGISTER ERROR :",
            error
        );

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {

    try {

        console.log("LOGIN ROUTE HIT");

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                error: "Email et mot de passe requis"
            });

        }

        const {
            data: user,
            error
        } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                error: error.message
            });

        }

        if (!user) {

            return res.status(404).json({
                success: false,
                error: "Utilisateur introuvable"
            });

        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                error: "Mot de passe incorrect"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            success: true,
            token,

            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "LOGIN ERROR :",
            error
        );

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

module.exports = router;
