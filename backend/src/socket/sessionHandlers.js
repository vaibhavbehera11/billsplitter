const Session = require("../models/Session");
const calculateTotals = require("../utils/calculateTotals");


function registerSessionHandlers(socket, io) {
  socket.on(
  "join-session",
  async ({ roomCode, participantName, participantId }) => {
    try {
      if (!roomCode) {
        socket.emit("error", {
          message: "Room code is required.",
        });
        return;
      }

      const session = await Session.findOne({ roomCode });

      if (!session) {
        socket.emit("error", {
          message: "Session not found",
        });
        return;
      }

      const trimmedName = participantName?.trim();

      if (!trimmedName) {
        socket.emit("error", {
          message: "Participant name is required.",
        });
        return;
      }

      let participant = null;

      // Returning participant after refresh
      if (participantId) {
        participant = session.participants.id(participantId);
      }

      // First time joining
      if (!participant) {
        participant = {
          name: trimmedName,
        };

        session.participants.push(participant);

        await session.save();

        participant =
          session.participants[
            session.participants.length - 1
          ];
      }

      console.log(
        `Participant "${participant.name}" joined room ${roomCode}`
      );

      socket.join(roomCode);

      socket.emit("participant-registered", {
        participantId: participant._id,
        participantName: participant.name,
      });

      io.to(roomCode).emit(
        "participant-added",
        session.participants
      );

      socket.emit("session-joined", session);
    } catch (error) {
      console.error(error);

      socket.emit("error", {
        message: "Something went wrong",
      });
    }
  }
);

  socket.on(
  "add-item",
  async ({ roomCode, name, price, quantity, participantIds }) => {
    try {
      const parsedPrice = Number(price);

      const parsedQuantity =
        quantity === undefined ? 1 : Number(quantity);

      // Validate item data and require at least one selected participant.
      if (
        !roomCode ||
        !name ||
        !name.trim() ||
        Number.isNaN(parsedPrice) ||
        parsedPrice <= 0 ||
        Number.isNaN(parsedQuantity) ||
        parsedQuantity <= 0 ||
        !Array.isArray(participantIds) ||
        participantIds.length === 0
      ) {
        socket.emit("error", {
          message: "Invalid item data",
        });
        return;
      }

      const session = await Session.findOne({ roomCode });

      if (!session) {
        socket.emit("error", {
          message: "Session not found",
        });
        return;
      }

      const existingParticipantIds =
        session.participants.map((participant) =>
          participant._id.toString()
        );

      const allParticipantsExist =
        participantIds.every((id) =>
          existingParticipantIds.includes(id)
        );

      if (!allParticipantsExist) {
        socket.emit("error", {
          message: "Invalid participant selection",
        });
        return;
      }

      const newItem = {
        name: name.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
        participantIds,
      };

      session.items.push(newItem);

      await session.save();

      const addedItem =
      session.items[session.items.length - 1];

      const totals = calculateTotals(session.items);

      io.to(roomCode).emit("item-added", {
      item: addedItem,
      totals,
      });

      console.log(
        `Item "${addedItem.name}" added to room ${roomCode}`
      );
    } catch (error) {
      console.error(error);

      socket.emit("error", {
        message: "Something went wrong",
      });
    }
  }
);
}

module.exports = registerSessionHandlers;