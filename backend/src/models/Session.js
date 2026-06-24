const mongoose = require("mongoose");

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
    type: Array,
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