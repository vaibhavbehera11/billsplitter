import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateSession() {
  const navigate = useNavigate();

  const [participantName, setParticipantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateSession = async () => {
    if (!participantName.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/sessions");

      const roomCode = response.data.data.roomCode;

      localStorage.setItem("roomCode", roomCode);
      localStorage.setItem(
        "participantName",
        participantName.trim()
      );

      navigate(`/session/${roomCode}`);
    } catch (err) {
      setError("Unable to create session. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">
          Create Session
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Start a new bill splitting session.
        </p>

        <input
          type="text"
          placeholder="Your Name"
          value={participantName}
          onChange={(e) =>
            setParticipantName(e.target.value)
          }
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleCreateSession}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Session"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-6">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateSession;