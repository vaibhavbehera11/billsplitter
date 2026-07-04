function calculateTotals(items) {
  const totals = {};

  items.forEach((item) => {
    if (
      !item.participantIds ||
      item.participantIds.length === 0
    ) {
      return;
    }

    const itemTotal =
      item.price * item.quantity;

    const splitAmount =
      itemTotal / item.participantIds.length;

    item.participantIds.forEach((participantId) => {
      const id = participantId.toString();

      if (!totals[id]) {
        totals[id] = 0;
      }

      totals[id] += splitAmount;
    });
  });

  return totals;
}

module.exports = calculateTotals;