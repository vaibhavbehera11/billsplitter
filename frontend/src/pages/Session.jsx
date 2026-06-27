import { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";

function Session() {
  const { roomCode } = useParams();

  useEffect(() => {
    // Connect to the Socket.io server
    socket.connect();

    console.log("✅ Socket connected");

    // Join the session room
    socket.emit("join-session", roomCode);

    // Listen for confirmation from the backend
    socket.on("session-joined", (session) => {
      console.log("Session joined:", session);
    });

    // Cleanup when leaving the page
    return () => {
      socket.off("session-joined");
      socket.disconnect();
    };
  }, [roomCode]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      alert("Room code copied!");
    } catch (error) {
      console.error("Failed to copy room code:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700">
          Bill Splitter
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Session Created
        </p>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Room Code
          </p>

          <h2 className="text-4xl font-bold tracking-widest text-indigo-700 mt-2">
            {roomCode}
          </h2>

          <button
            onClick={copyRoomCode}
            className="mt-5 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Copy Room Code
          </button>
        </div>

        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold">
            Session Status
          </h3>

          <p className="text-gray-500 mt-2">
            Waiting for participants...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Session;