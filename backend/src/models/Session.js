const mongoose = require("mongoose");

// Each participant is stored inside its parent session.
// Using embedded documents gives every participant a unique _id,
// which will later be used for item assignment and reconnection.
const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

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

// Stores which participant paid for this item.
// Required later to calculate who owes whom.
paidBy: {
  type: mongoose.Schema.Types.ObjectId,
},

// Stores references to participant subdocument IDs.
// This avoids duplicating names and keeps assignments linked
// even if participant data changes later.
participantIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const sessionSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },

  participants: {
    type: [participantSchema],
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