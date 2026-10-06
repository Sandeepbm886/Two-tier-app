import express from "express";
import Message from "../models/message.js";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages:", error);

        res.status(500).json({
            error: "Failed to fetch messages",
        });
    }
});

// Create a message
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required",
            });
        }

        const newMessage = await Message.create({
            message,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Failed to create message:", error);

        res.status(500).json({
            error: "Failed to create message",
        });
    }
});

export default router;
