import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";

function Session() {
  const { roomCode } = useParams();

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const handleConnect = () => {
    console.log("Connected:", socket.id);

    socket.emit("join-session", {
      roomCode,
    });
  };

  const handleSessionJoined = (session) => {
    console.log("Session joined:", session);
  };

  const handleItemAdded = (item) => {
    console.log("Item received:", item);

    setItems((previousItems) => [...previousItems, item]);
  };

  socket.on("connect", handleConnect);
  socket.on("session-joined", handleSessionJoined);
  socket.on("item-added", handleItemAdded);

  if (!socket.connected) {
    socket.connect();
  } else {
    handleConnect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("session-joined", handleSessionJoined);
    socket.off("item-added", handleItemAdded);
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

    console.log("Sending add-item", {
      roomCode,
      name: itemName.trim(),
      price: Number(price),
      quantity: Number(quantity),
    });

    socket.emit("add-item", {
      roomCode,
      name: itemName.trim(),
      price: Number(price),
      quantity: Number(quantity),
    });

    setItemName("");
    setPrice("");
    setQuantity("");
    setError("");
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

        {/* Room Code Section */}
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

        {/* Items List */}
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
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-indigo-700">
                    {item.name}
                  </h4>

                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Price:</span> ₹{item.price}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Session;