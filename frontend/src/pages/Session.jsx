import ParticipantChip from "../components/ParticipantChip/ParticipantChip";
import ItemCard from "../components/ItemCard/ItemCard";
import RunningTotals from "../components/RunningTotals/RunningTotals";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import api from "../services/api";

function Session() {
  const { roomCode } = useParams();

  const participantName = localStorage.getItem("participantName");
  const participantId = localStorage.getItem("participantId");

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [totals, setTotals] = useState({});
  const [error, setError] = useState("");

  // Load latest session from MongoDB
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get(`/sessions/${roomCode}`);

        const session = response.data.data;

        setParticipants(session.participants || []);
        setItems(session.items || []);
      } catch (error) {
        console.error("Failed to load session:", error);
      }
    };

    fetchSession();
  }, [roomCode]);

  // Socket connection
useEffect(() => {
  const handleConnect = () => {
    console.log("Connected:", socket.id);

    socket.emit("join-session", {
      roomCode,
      participantName,
      participantId,
    });
  };

  const handleSessionJoined = (session) => {
    console.log("Session joined:", session);

    setParticipants(session.participants || []);
    setItems(session.items || []);
  };

  const handleItemAdded = ({ item, totals }) => {
  console.log("Item received:", item);
  console.log("Totals received:", totals);

  setItems((previousItems) => [
    ...previousItems,
    item,
  ]);

  setTotals(totals);
  };

  const handleParticipantAdded = (participants) => {
    console.log("Participants updated:", participants);

    setParticipants(participants);
  };

  const handleParticipantRegistered = ({
    participantId,
    participantName,
  }) => {
    console.log("Participant registered:", {
      participantId,
      participantName,
    });

    localStorage.setItem("participantId", participantId);
    localStorage.setItem("participantName", participantName);
  };

  socket.on("connect", handleConnect);
  socket.on("session-joined", handleSessionJoined);
  socket.on("item-added", handleItemAdded);
  socket.on("participant-added", handleParticipantAdded);
  socket.on(
    "participant-registered",
    handleParticipantRegistered
  );

  if (!socket.connected) {
    socket.connect();
  } else {
    handleConnect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("session-joined", handleSessionJoined);
    socket.off("item-added", handleItemAdded);
    socket.off("participant-added", handleParticipantAdded);
    socket.off(
      "participant-registered",
      handleParticipantRegistered
    );
  };
}, [roomCode, participantName, participantId]);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      alert("Room code copied!");
    } catch (error) {
      console.error("Failed to copy room code:", error);
    }
  };

  const toggleParticipant = (participantId) => {
    setSelectedParticipants((prev) => {
        if (prev.includes(participantId)) {
            return prev.filter((id) => id !== participantId);
        }

        return [...prev, participantId];
    });
  };

  const handleAddItem = () => {
    setError("");

    if (!itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (selectedParticipants.length === 0) {
      setError("Select at least one participant.");
      return;
    
    }

    socket.emit("add-item", {
  roomCode,
  name: itemName.trim(),
  price: Number(price),
  quantity: Number(quantity),
  participantIds: selectedParticipants,
});

    setItemName("");
    setPrice("");
    setQuantity("");
    setSelectedParticipants([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700">
          Bill Splitter
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Connected
        </p>

        {/* Room Code */}
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

        {/* Participants */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Participants
          </h3>

          {participants.length === 0 ? (
            <p className="text-gray-500">
              No participants yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <ParticipantChip
                  key={participant._id}
                  name={participant.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Session Status */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold">
            Session Status
          </h3>

          <p className="text-gray-500 mt-2">
            Waiting for participants...
          </p>
        </div>

        {/* Add Item */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Add Item
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>

              <input
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>

              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>

              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-4">
              <p className="mb-2 font-medium">
                Split Between
    </p>

    <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <ParticipantChip
            key={participant._id}
            name={participant.name}
            selected={selectedParticipants.includes(participant._id)}
            onClick={() => toggleParticipant(participant._id)}
          />
        ))}
    </div>
</div>

            <button
              onClick={handleAddItem}
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              Add Item
            </button>

            {error && (
              <p className="text-center text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Items
          </h3>

          {items.length === 0 ? (
            <p className="text-center text-gray-500">
              No items added yet.
            </p>
          ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                participants={participants}
              />
            ))}
          </div>
          )}

          <RunningTotals
            participants={participants}
            totals={totals}
          />
        </div>
      </div>
    </div>
  );
}

export default Session;