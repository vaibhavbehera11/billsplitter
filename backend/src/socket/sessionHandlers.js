const Session = require("../models/Session");

function registerSessionHandlers(socket) {
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
}

module.exports = registerSessionHandlers;