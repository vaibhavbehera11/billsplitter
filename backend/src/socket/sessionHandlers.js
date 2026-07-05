const Session = require("../models/Session");
const calculateTotals = require("../utils/calculateTotals");
const calculateSettlements = require("../utils/calculateSettlements");


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
  async ({
    roomCode,
    name,
    price,
    quantity,
    paidBy,
    participantIds,
  }) => {
    try {
      if (
        !roomCode ||
        !name ||
        !price ||
        !quantity ||
        !paidBy ||
        !participantIds ||
        participantIds.length === 0
      ) {
        socket.emit("error", {
          message: "Invalid item data",
        });
        return;
      }

      const session = await Session.findOne({
        roomCode,
      });

      if (!session) {
        socket.emit("error", {
          message: "Session not found",
        });
        return;
      }

      session.items.push({
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
        paidBy,
        participantIds,
      });

      await session.save();

      const item =
        session.items[
          session.items.length - 1
        ];

      const totals =
        calculateTotals(session.items);

      const settlements =
        calculateSettlements(session.items);

      io.to(roomCode).emit(
        "item-added",
        {
          item,
          totals,
          settlements,
        }
      );

      console.log(
        `Item "${item.name}" added to room ${roomCode}`
      );
    } catch (error) {
      console.error(error);

      socket.emit("error", {
        message: "Something went wrong",
      });
    }
  }
);


    socket.on(
    "toggle-item-assignment",
    async ({ roomCode, itemId, participantId }) => {
      try {
        if (!roomCode || !itemId || !participantId) {
          socket.emit("error", {
            message: "Invalid assignment data",
          });
          return;
        }

        const session = await Session.findOne({
          roomCode,
        });

        if (!session) {
          socket.emit("error", {
            message: "Session not found",
          });
          return;
        }

        const item = session.items.id(itemId);

        if (!item) {
          socket.emit("error", {
            message: "Item not found",
          });
          return;
        }

                const assignedParticipants =
          item.participantIds.map((id) =>
            id.toString()
          );

        const alreadyAssigned =
          assignedParticipants.includes(
            participantId
          );

        if (alreadyAssigned) {
          item.participantIds =
            item.participantIds.filter(
              (id) =>
                id.toString() !== participantId
            );
        } else {
          item.participantIds.push(
            participantId
          );
        }

                await session.save();

        const totals = calculateTotals(
          session.items
        );

        const settlements =
          calculateSettlements(
            session.items
          );

        io.to(roomCode).emit(
          "assignment-updated",
          {
            items: session.items,
            totals,
            settlements,
          }
        );

        console.log(
          "Assignment updated for:",
          item.name
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