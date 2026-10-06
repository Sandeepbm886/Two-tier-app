import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
import { initializeDatabase, testConnection } from "./models/message.js";
import messageRoutes from "./routes/messageRoutes.route.js";

dotenv.config()
const app = express();

const PORT = process.env.PORT || 3000;

// Required for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/messages", messageRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Application is healthy",
    });
});

// Connect to PostgreSQL
initializeDatabase()
    .then(async () => {
        await testConnection();

        console.log("Connected to PostgreSQL");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error);

        process.exit(1);
    });
