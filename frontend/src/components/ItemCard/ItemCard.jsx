import ParticipantChip from "../ParticipantChip/ParticipantChip";

function ItemCard({
  item,
  participants,
  socket,
  roomCode,
  participantId,
})  {
  const participantIds = item.participantIds || [];

  const assignedParticipants = participants.filter((participant) =>
    participantIds.includes(participant._id)
  );

  const handleToggleAssignment = () => {
  socket.emit("toggle-item-assignment", {
    roomCode,
    itemId: item._id,
    participantId,
  });
};


  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <h4 className="text-lg font-semibold text-indigo-700">
        {item.name}
      </h4>

      <p className="mt-2 text-gray-700">
        <span className="font-medium">Price:</span> ₹{item.price}
      </p>

      <p className="text-gray-700">
        <span className="font-medium">Quantity:</span> {item.quantity}
      </p>

      {assignedParticipants.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-sm font-medium text-gray-600">
            Assigned
          </p>

          <div className="flex flex-wrap gap-2">
            {assignedParticipants.map((participant) => (
              <ParticipantChip
                key={participant._id}
                name={participant.name}
              />
            ))}
          </div>
        </div>
      )}

      <button
  onClick={handleToggleAssignment}
  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
>
  I ate this
</button>
    </div>
  );
}

export default ItemCard;