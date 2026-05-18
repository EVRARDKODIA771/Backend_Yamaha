const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { supabase } = require("../supabaseClient");

const router = express.Router();


// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        // VALIDATION

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

        // USER EXISTE ?

        const { data: existingUser } =
            await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .maybeSingle();

        if (existingUser) {

            return res.status(400).json({
                success: false,
                error: "Utilisateur déjà existant"
            });

        }

        // HASH PASSWORD

        const password_hash =
            await bcrypt.hash(password, 10);

        // INSERT USER

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

            return res.status(500).json({
                success: false,
                error: insertError.message
            });

        }

        // JWT

        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.SUPABASE_SECRET_KEY_,
            {
                expiresIn: "7d"
            }
        );

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

        console.error(error);

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

        const {
            email,
            password
        } = req.body;

        const {
            data: user,
            error
        } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

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
            process.env.SUPABASE_SECRET_KEY_,
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

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

module.exports = router;
