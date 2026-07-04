function SettlementList({ settlements }) {
  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        Settlements
      </h2>

      {settlements.length === 0 ? (
        <p className="text-sm text-gray-500">
          No settlements yet.
        </p>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2"
            >
              <span>
                {settlement.from} pays {settlement.to}
              </span>

              <span className="font-semibold">
                ₹{settlement.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SettlementList;