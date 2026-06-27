const registerSessionHandlers = require("./sessionHandlers");

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Register all session-related socket events
    registerSessionHandlers(socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = initializeSocket;