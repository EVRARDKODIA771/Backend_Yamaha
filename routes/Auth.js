import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { supabase } from "../supabaseClient.js";

const router = express.Router();


// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {

    try {

        const { email, password } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                error: "Email et mot de passe requis"
            });

        }

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                error: "Le mot de passe doit avoir au moins 6 caractères"
            });

        }

        // ==================================================
        // VERIFIER SI USER EXISTE
        // ==================================================

        const { data: existingUser } = await supabase
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

        // ==================================================
        // HASH PASSWORD
        // ==================================================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==================================================
        // INSERT USER
        // ==================================================

        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
                {
                    email,
                    password: hashedPassword,
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

        // ==================================================
        // CREATE JWT
        // ==================================================

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

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,
            message: "Compte créé",
            token,

            user: {
                id: newUser.id,
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

        const { email, password } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                error: "Email et mot de passe requis"
            });

        }

        // ==================================================
        // FIND USER
        // ==================================================

        const { data: user, error: findError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (findError) {

            return res.status(500).json({
                success: false,
                error: findError.message
            });

        }

        if (!user) {

            return res.status(404).json({
                success: false,
                error: "Utilisateur introuvable"
            });

        }

        // ==================================================
        // CHECK PASSWORD
        // ==================================================

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                error: "Mot de passe incorrect"
            });

        }

        // ==================================================
        // CREATE JWT
        // ==================================================

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

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.json({
            success: true,
            message: "Connexion réussie",
            token,

            user: {
                id: user.id,
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


// ======================================================
// VERIFY TOKEN MIDDLEWARE
// ======================================================

export const verifyToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                error: "Token manquant"
            });

        }

        const token = authHeader.split(" ")[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                error: "Token invalide"
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.SUPABASE_SECRET_KEY_
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            error: "Authentification échouée"
        });

    }

};


// ======================================================
// GET CURRENT USER
// ======================================================

router.get("/me", verifyToken, async (req, res) => {

    try {

        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, role, created_at")
            .eq("id", req.user.id)
            .single();

        if (error) {

            return res.status(500).json({
                success: false,
                error: error.message
            });

        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ======================================================
// EXPORT
// ======================================================

export default router;
