const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const { supabase } =
    require("../supabaseClient");

const router = express.Router();

// ======================================================
// TEMP FOLDER
// ======================================================

const TEMP_DIR =
    path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) {

    fs.mkdirSync(TEMP_DIR);

}

// ======================================================
// MULTER
// ======================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, TEMP_DIR);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}_${file.originalname}`;

        cb(null, uniqueName);

    }

});

const upload = multer({
    storage
});

// ======================================================
// UPLOAD
// ======================================================

router.post(
    "/styles",
    upload.array("styles"),
    async (req, res) => {

        try {

            console.log("====================================");
            console.log("UPLOAD ROUTE HIT");

            const files = req.files;

            if (!files || files.length === 0) {

                return res.status(400).json({
                    success: false,
                    error: "No files uploaded"
                });

            }

            console.log(
                "FILES RECEIVED =",
                files.length
            );

            const results = [];

            // ==================================================
            // LOOP FILES
            // ==================================================

            for (const file of files) {

                console.log("====================================");
                console.log("PROCESSING FILE");
                console.log(file.originalname);

                const localPath = file.path;

                // ==============================================
                // UPLOAD ORIGINAL STY
                // ==============================================

                const styBuffer =
                    fs.readFileSync(localPath);

                const styFileName =
                    file.originalname;

                console.log(
                    "UPLOADING STY TO SUPABASE..."
                );

                const {
                    error: uploadError
                } = await supabase.storage
                    .from(
                        process.env
                        .SUPABASE_STYLES_BUCKET
                    )
                    .upload(
                        styFileName,
                        styBuffer,
                        {
                            upsert: true,
                            contentType:
                                "application/octet-stream"
                        }
                    );

                if (uploadError) {

                    console.error(uploadError);

                    throw uploadError;

                }

                console.log(
                    "STY UPLOADED SUCCESSFULLY"
                );

                // ==============================================
                // PYTHON PROCESS
                // ==============================================

                console.log(
                    "STARTING PYTHON PROCESS..."
                );

                await new Promise((resolve, reject) => {

                    const py = spawn(
                        "python3",
                        [
                            "./python/process_style.py",
                            localPath,
                            file.originalname
                        ]
                    );

                    py.stdout.on(
                        "data",
                        (data) => {

                            console.log(
                                "[PYTHON STDOUT]",
                                data.toString()
                            );

                        }
                    );

                    py.stderr.on(
                        "data",
                        (data) => {

                            console.error(
                                "[PYTHON STDERR]",
                                data.toString()
                            );

                        }
                    );

                    py.on("close", (code) => {

                        console.log(
                            "PYTHON PROCESS CLOSED WITH CODE",
                            code
                        );

                        if (code !== 0) {

                            reject(
                                new Error(
                                    "Python process failed"
                                )
                            );

                        } else {

                            resolve();

                        }

                    });

                });

                results.push({
                    file: file.originalname,
                    success: true
                });

            }

            console.log("====================================");
            console.log("ALL FILES DONE");

            return res.json({
                success: true,
                results
            });

        } catch (error) {

            console.error(
                "UPLOAD ERROR"
            );

            console.error(error);

            return res.status(500).json({
                success: false,
                error: error.message
            });

        }

    }
);

module.exports = router;
