import ParticipantChip from "../components/ParticipantChip/ParticipantChip";
import ItemCard from "../components/ItemCard/ItemCard";
import RunningTotals from "../components/RunningTotals/RunningTotals";
import SettlementList from "../components/SettlementList/SettlementList";
import BillUpload from "../components/BillUpload/BillUpload";
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

  const [selectedParticipants, setSelectedParticipants] =
    useState([]);

  const [paidBy, setPaidBy] = useState("");

  const [totals, setTotals] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [error, setError] = useState("");
  const [scanSuccessMessage, setScanSuccessMessage] = useState("");
const [addingScannedItem, setAddingScannedItem] = useState(null);
  const [extractedItems, setExtractedItems] = useState([]);


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response =
          await api.get(`/sessions/${roomCode}`);

        const session = response.data.data;

        setParticipants(session.participants || []);
        setItems(session.items || []);
      } catch (error) {
        console.error(
          "Failed to load session:",
          error
        );
      }
    };

    fetchSession();
  }, [roomCode]);


  useEffect(() => {
    const handleConnect = () => {
      console.log(
        "Connected:",
        socket.id
      );

      socket.emit("join-session", {
        roomCode,
        participantName,
        participantId,
      });
    };


    const handleSessionJoined = (session) => {
      setParticipants(
        session.participants || []
      );

      setItems(
        session.items || []
      );
    };


    const handleItemAdded = ({
  item,
  totals,
  settlements,
}) => {
  setItems((previousItems) => [
    ...previousItems,
    item,
  ]);

  setTotals(totals);
  setSettlements(settlements);
};


    const handleParticipantAdded = (
      participants
    ) => {
      setParticipants(participants);
    };


    const handleParticipantRegistered = ({
      participantId,
      participantName,
    }) => {
      

      localStorage.setItem(
        "participantId",
        participantId
      );

      localStorage.setItem(
        "participantName",
        participantName
      );
    };

    const handleAssignmentUpdated = ({
      items,
      totals,
      settlements,
    }) => {
      setItems(items || []);
      setTotals(totals || {});
      setSettlements(settlements || []);
    };


    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "session-joined",
      handleSessionJoined
    );

    socket.on(
      "item-added",
      handleItemAdded
    );

    socket.on(
      "participant-added",
      handleParticipantAdded
    );

    socket.on(
      "participant-registered",
      handleParticipantRegistered
    );

    socket.on(
  "assignment-updated",
  handleAssignmentUpdated
);


    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }


    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "session-joined",
        handleSessionJoined
      );

      socket.off(
        "item-added",
        handleItemAdded
      );

      socket.off(
        "participant-added",
        handleParticipantAdded
      );

      socket.off(
        "participant-registered",
        handleParticipantRegistered
      );

      socket.off(
  "assignment-updated",
  handleAssignmentUpdated
);

      
    };
  }, [
    roomCode,
    participantName,
    participantId,
  ]);

    const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      alert("Room code copied!");
    } catch (error) {
      console.error(
        "Failed to copy room code:",
        error
      );
    }
  };


  const toggleParticipant = (participantId) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(participantId)) {
        return prev.filter(
          (id) => id !== participantId
        );
      }

      return [
        ...prev,
        participantId,
      ];
    });
  };

  const handleExtractedItems = (items) => {
  setScanSuccessMessage("");
  setError("");

  if (!items || items.length === 0) {
    setExtractedItems([]);
    setError("No items were detected in the bill.");
    return;
  }

  setExtractedItems(items);
};

  
  const handleAddExtractedItem = (index) => {
  const item = extractedItems[index];

  if (!item) {
    return;
  }

  if (!paidBy) {
    setError("Select who paid before adding scanned items.");
    return;
  }

  setError("");
  setScanSuccessMessage("");
  setAddingScannedItem(index);

  socket.emit("add-item", {
    roomCode,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    paidBy,
    participantIds: [],
  });

  const remainingItems = extractedItems.filter(
    (_, itemIndex) => itemIndex !== index
  );

  setExtractedItems(remainingItems);

  if (remainingItems.length === 0) {
    setScanSuccessMessage("All scanned items added.");
  } else {
    setScanSuccessMessage("Item added successfully.");
  }

  setAddingScannedItem(null);
};


  const handleAddItem = () => {
    setError("");


    if (!itemName.trim()) {
      setError(
        "Item name is required."
      );
      return;
    }


    if (
      !price ||
      Number(price) <= 0
    ) {
      setError(
        "Price must be greater than 0."
      );
      return;
    }


    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      setError(
        "Quantity must be greater than 0."
      );
      return;
    }


    if (!paidBy) {
      setError(
        "Select who paid."
      );
      return;
    }


    if (
      selectedParticipants.length === 0
    ) {
      setError(
        "Select at least one participant."
      );
      return;
    }


    console.log({
  roomCode,
  name: itemName.trim(),
  price: Number(price),
  quantity: Number(quantity),
  paidBy,
  participantIds: selectedParticipants,
});

socket.emit("add-item", {
  roomCode,
  name: itemName.trim(),
  price: Number(price),
  quantity: Number(quantity),
  paidBy,
  participantIds: selectedParticipants,
});


    setItemName("");
    setPrice("");
    setQuantity("");
    setPaidBy("");
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
            className="mt-5 px-5 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Copy Room Code
          </button>

        </div>


        {/* Participants */}
        <div className="mt-10 border-t pt-6">

          <h3 className="text-lg font-semibold mb-4">
            Participants
          </h3>


          <div className="flex flex-wrap gap-2">

            {participants.map(
              (participant) => (
                <ParticipantChip
                  key={participant._id}
                  name={participant.name}
                />
              )
            )}

          </div>

        </div>

        <BillUpload
          onItemsExtracted={handleExtractedItems}
        />

        {extractedItems.length > 0 && (
  <div className="mt-6 border rounded-xl p-4">
    <h3 className="text-lg font-semibold mb-4">
      Scanned Items
    </h3>

    <div className="space-y-3">
      {extractedItems.map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-3 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold">
              {item.name}
            </p>

            <p className="text-sm text-gray-500">
              ₹{item.price}
            </p>

            <p className="text-sm text-gray-500">
              Qty: {item.quantity}
            </p>
          </div>

          <button
            onClick={() => handleAddExtractedItem(index)}
            disabled={addingScannedItem === index}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {addingScannedItem === index ? "Adding..." : "Add"}
          </button>
        </div>
      ))}
    </div>
    {scanSuccessMessage && (
  <p className="mt-4 text-center text-green-600 font-medium">
    {scanSuccessMessage}
  </p>
)}
  </div>
  
)}


        {/* Add Item */}
        <div className="mt-10 border-t pt-6">

          <h3 className="text-xl font-semibold mb-4">
            Add Item
          </h3>


          <input
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            placeholder="Item Name"
            className="w-full rounded-lg border px-4 py-2 mb-3"
          />


          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Price"
            className="w-full rounded-lg border px-4 py-2 mb-3"
          />


          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            placeholder="Quantity"
            className="w-full rounded-lg border px-4 py-2 mb-3"
          />

                    {/* Paid By */}
          <div className="mt-4">
            <p className="mb-2 font-medium">
              Paid By
            </p>

            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <ParticipantChip
                  key={participant._id}
                  name={participant.name}
                  selected={
                    paidBy === participant._id
                  }
                  onClick={() =>
                    setPaidBy(participant._id)
                  }
                />
              ))}
            </div>
          </div>


          {/* Split Between */}
          <div className="mt-4">
            <p className="mb-2 font-medium">
              Split Between
            </p>

            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <ParticipantChip
                  key={participant._id}
                  name={participant.name}
                  selected={
                    selectedParticipants.includes(
                      participant._id
                    )
                  }
                  onClick={() =>
                    toggleParticipant(
                      participant._id
                    )
                  }
                />
              ))}
            </div>
          </div>


          <button
            onClick={handleAddItem}
            className="mt-5 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Add Item
          </button>


          {error && (
            <p className="text-center text-sm text-red-500 mt-3">
              {error}
            </p>
          )}

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
                  socket={socket}
                  roomCode={roomCode}
                  participantId={participantId}
                />
              ))}

            </div>
          )}


          <RunningTotals
            participants={participants}
            totals={totals}
          />
          <SettlementList
  settlements={settlements}
/>

          

        </div>

      </div>
    </div>
  );


}
export default Session;