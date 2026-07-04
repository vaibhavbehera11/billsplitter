function calculateSettlements(items) {
  const balances = {};

  items.forEach((item) => {
    const itemTotal =
      item.price * item.quantity;

    const payerId =
      item.paidBy.toString();

    if (!balances[payerId]) {
      balances[payerId] = 0;
    }

    balances[payerId] += itemTotal;


    const splitAmount =
      itemTotal / item.participantIds.length;


    item.participantIds.forEach(
      (participantId) => {
        const id =
          participantId.toString();

        if (!balances[id]) {
          balances[id] = 0;
        }

        balances[id] -= splitAmount;
      }
    );
  });


  const creditors = [];
  const debtors = [];


  Object.entries(balances).forEach(
    ([participantId, amount]) => {
      if (amount > 0) {
        creditors.push({
          participantId,
          amount,
        });
      }

      if (amount < 0) {
        debtors.push({
          participantId,
          amount: Math.abs(amount),
        });
      }
    }
  );


  const settlements = [];


  let i = 0;
  let j = 0;


  while (
    i < debtors.length &&
    j < creditors.length
  ) {
    const amount = Math.min(
      debtors[i].amount,
      creditors[j].amount
    );


    settlements.push({
      from: debtors[i].participantId,
      to: creditors[j].participantId,
      amount,
    });


    debtors[i].amount -= amount;
    creditors[j].amount -= amount;


    if (debtors[i].amount === 0) {
      i++;
    }

    if (creditors[j].amount === 0) {
      j++;
    }
  }


  return settlements;
}


module.exports = calculateSettlements;