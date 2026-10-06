import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
import Message from "./models/message.js";
import messageRoutes from "./routes/messageRoutes.route.js";

dotenv.config()
const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_DB = process.env.MONGO_DB || "devopsapp";
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE || "admin";

function getMongoUri() {
    if (process.env.MONGO_URI) {
        return process.env.MONGO_URI;
    }

    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
        const username = encodeURIComponent(process.env.MONGO_USERNAME);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);

        return `mongodb://${username}:${password}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_AUTH_SOURCE}`;
    }

    return `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
}

const MONGO_URI = getMongoUri();

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

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(async () => {
        await Message.findOne().lean();

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);

        if (error?.codeName === "Unauthorized") {
            console.error(
                "MongoDB requires authentication. Set MONGO_URI, or set MONGO_USERNAME and MONGO_PASSWORD."
            );
        }

        process.exit(1);
    });
