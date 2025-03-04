
export const createDebt = (description, amount, debtor, date = new Date()) => ({
  id: Date.now().toString(),
  description,
  amount: Number(amount),
  debtor,
  date,
  payments: [],
  status: 'pending' 
});


export const addPayment = (debt, amount, date = new Date()) => {
  const payment = {
    id: Date.now().toString(),
    amount: Number(amount),
    date
  };
  
  const updatedDebt = {
    ...debt,
    payments: [...debt.payments, payment]
  };
  

  const totalPaid = updatedDebt.payments.reduce((sum, p) => sum + p.amount, 0);
  if (totalPaid >= debt.amount) {
    updatedDebt.status = 'paid';
  }
  
  return updatedDebt;
};


export const calculateBalance = (debt) => {
  const totalPaid = debt.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return debt.amount - totalPaid;
};


export const increaseDebt = (debt, additionalAmount) => ({
  ...debt,
  amount: debt.amount + Number(additionalAmount)
});