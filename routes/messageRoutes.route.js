import express from "express";
import { createMessage, findMessages } from "../models/message.js";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
    try {
        const messages = await findMessages();

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

        if (!message?.trim()) {
            return res.status(400).json({
                error: "Message is required",
            });
        }

        const newMessage = await createMessage(message);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Failed to create message:", error);

        res.status(500).json({
            error: "Failed to create message",
        });
    }
});

export default router;
