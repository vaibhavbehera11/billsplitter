const express = require("express");
const Session = require("../models/Session");

const router = express.Router();

// Generate a simple 6-character room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create Session
router.post("/", async (req, res) => {
  try {
    const roomCode = generateRoomCode();

    const session = await Session.create({
      roomCode,
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        roomCode: session.roomCode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Join Session
router.post("/join", async (req, res) => {
  try {
    const { roomCode } = req.body;

    const session = await Session.findOne({ roomCode });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found or expired",
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        roomCode: session.roomCode,
        participants: session.participants,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Session
router.get("/:roomCode", async (req, res) => {
  try {
    const { roomCode } = req.params;

    const session = await Session.findOne({ roomCode });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found or expired",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;