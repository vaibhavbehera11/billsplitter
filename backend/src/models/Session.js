const mongoose = require("mongoose");

// Each bill item is stored inside its parent session.
// Keeping items embedded avoids an extra collection and keeps
// all session data together for this MVP.
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },
});

const sessionSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },

  participants: {
    type: [String],
    default: [],
  },

  items: {
    type: [itemSchema],
    default: [],
  },

  // MongoDB automatically removes sessions after 24 hours.
  // This keeps temporary rooms from accumulating indefinitely.
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

module.exports = mongoose.model("Session", sessionSchema);