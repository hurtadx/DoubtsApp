import { calculateBalance } from '../utils/calculations';

export const DebtList = ({ debts, onAddPayment, onIncreaseDebt }) => {
  const handlePayment = (debtId) => {
    const amount = prompt('Ingrese el monto del pago:');
    if (amount && !isNaN(amount)) {
      onAddPayment(debtId, Number(amount));
    }
  };

  const handleIncrease = (debtId) => {
    const amount = prompt('Ingrese el monto a aumentar:');
    if (amount && !isNaN(amount)) {
      onIncreaseDebt(debtId, Number(amount));
    }
  };

  return (
    <div className="debt-list">
      {debts.map(debt => (
        <div key={debt.id} className="debt-item">
          <div className="debt-info">
            <h3>{debt.description}</h3>
            <p>Deudor: {debt.debtor}</p>
            <p>Monto original: ${debt.amount}</p>
            <p>Saldo pendiente: ${calculateBalance(debt)}</p>
          </div>
          <span className={`debt-status status-${debt.status}`}>
            {debt.status === 'pending' ? 'Pendiente' : 'Pagado'}
          </span>
          <div className="debt-actions">
            <button onClick={() => handlePayment(debt.id)}>
              Agregar Pago
            </button>
            <button onClick={() => handleIncrease(debt.id)}>
              Aumentar Deuda
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};