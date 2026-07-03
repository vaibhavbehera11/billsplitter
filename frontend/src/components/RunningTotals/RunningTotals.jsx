function RunningTotals({ participants }) {
  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        Running Totals
      </h2>

      {participants.length === 0 ? (
        <p className="text-sm text-gray-500">
          No participants yet.
        </p>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>{participant.name}</span>

              <span className="font-semibold">
                ₹0
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RunningTotals;