import ParticipantChip from "../ParticipantChip/ParticipantChip";

function ItemCard({ item, participants }) {
  const participantIds = item.participantIds || [];

  const assignedParticipants = participants.filter((participant) =>
    participantIds.includes(participant._id)
  );

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
    </div>
  );
}

export default ItemCard;