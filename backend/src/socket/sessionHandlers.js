const Session = require("../models/Session");

function registerSessionHandlers(socket, io) {
  socket.on("join-session", async ({ roomCode }) => {
    try {
      const session = await Session.findOne({ roomCode });

      if (!session) {
        socket.emit("error", {
          message: "Session not found",
        });
        return;
      }

      console.log("Session found:", session.roomCode);

      socket.join(roomCode);

      socket.emit("session-joined", session);
    } catch (error) {
      console.error(error);

      socket.emit("error", {
        message: "Something went wrong",
      });
    }
  });

  socket.on("add-item", async ({ roomCode, name, price, quantity }) => {
    try {
      const parsedPrice = Number(price);
      const parsedQuantity =
        quantity === undefined ? 1 : Number(quantity);

      // Validate incoming item data before touching the database.
      if (
        !roomCode ||
        !name ||
        !name.trim() ||
        Number.isNaN(parsedPrice) ||
        parsedPrice <= 0 ||
        Number.isNaN(parsedQuantity) ||
        parsedQuantity <= 0
      ) {
        socket.emit("error", {
          message: "Invalid item data",
        });
        return;
      }

      // Check whether the session exists.
      const session = await Session.findOne({ roomCode });

      if (!session) {
        socket.emit("error", {
          message: "Session not found",
        });
        return;
      }

      const newItem = {
        name: name.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
      };

      // Add the item to the session.
      session.items.push(newItem);

      // Save first so MongoDB becomes the source of truth.
      await session.save();

      const addedItem = session.items[session.items.length - 1];

      // Notify everyone in the room after the item is successfully saved.
      io.to(roomCode).emit("item-added", addedItem);

      console.log(
        `Item "${addedItem.name}" added to room ${roomCode}`
      );
    } catch (error) {
      console.error(error);

      socket.emit("error", {
        message: "Something went wrong",
      });
    }
  });
}

module.exports = registerSessionHandlers;