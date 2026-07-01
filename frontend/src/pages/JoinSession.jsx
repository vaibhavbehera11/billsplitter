import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function JoinSession() {
  const navigate = useNavigate();

  const [participantName, setParticipantName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinSession = async () => {
    if (!participantName.trim() || !roomCode.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/sessions/join", {
        roomCode,
      });

      localStorage.setItem(
        "participantName",
        participantName.trim()
      );

      navigate(`/session/${response.data.data.roomCode}`);
    } catch (err) {
      setError("Session not found. Please check the room code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">
          Join Session
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your name and the room code to join an existing session.
        </p>

        <input
          type="text"
          placeholder="Your Name"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) =>
            setRoomCode(e.target.value.toUpperCase())
          }
          maxLength={6}
          className="w-full border rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleJoinSession}
          disabled={
            loading ||
            !participantName.trim() ||
            !roomCode.trim()
          }
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Session"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default JoinSession;