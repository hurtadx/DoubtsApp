import { calculateBalance } from '../utils/calculations';
import { useState } from 'react';

export const DebtList = ({ debts, onAddPayment, onIncreaseDebt, onDeleteDebt }) => {
  
  const [filter, setFilter] = useState('all');
  
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
  
  const filteredDebts = filter === 'all' 
    ? debts 
    : debts.filter(debt => debt.status === filter);
  
  const totalPending = debts
    .filter(debt => debt.status === 'pending')
    .reduce((sum, debt) => sum + calculateBalance(debt), 0);
  
  // Función para formatear fechas
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Función para formatear valores en pesos colombianos
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="debt-list-container">

      <div className="debt-summary">
        <h2>Resumen de Deudas</h2>
        <p className="total-pending">Total pendiente: <span>{formatCurrency(totalPending)}</span></p>
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button 
            className={filter === 'paid' ? 'active' : ''}
            onClick={() => setFilter('paid')}
          >
            Pagadas
          </button>
        </div>
      </div>
      
      <div className="debt-list">
        {filteredDebts.length === 0 ? (
          <div className="no-debts">
            <p>No hay deudas {filter !== 'all' ? `${filter === 'pending' ? 'pendientes' : 'pagadas'}` : ''}</p>
          </div>
        ) : (
          filteredDebts.map(debt => (
            <div key={debt.id} className="debt-item">
              <div className="debt-info">
                <h3>{debt.description}</h3>
                <div className="debt-meta">
                  <span className="debtor">{debt.debtor}</span>
                  <span className="date">Fecha: {formatDate(debt.date)}</span>
                </div>
                
                <div className="debt-amounts">
                  <p>Monto original: <span className="amount">{formatCurrency(debt.amount)}</span></p>
                  <p>Saldo pendiente: <span className={`amount ${calculateBalance(debt) > 0 ? 'pending' : 'paid'}`}>
                    {formatCurrency(calculateBalance(debt))}
                  </span></p>
                </div>
                
                {/* Historial de pagos */}
                {debt.payments.length > 0 && (
                  <div className="payment-history">
                    <details>
                      <summary>Historial de pagos ({debt.payments.length})</summary>
                      <ul>
                        {debt.payments.map(payment => (
                          <li key={payment.id}>
                            {formatCurrency(payment.amount)} - {formatDate(payment.date)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
              
              <span className={`debt-status status-${debt.status}`}>
                {debt.status === 'pending' ? 'Pendiente' : 'Pagado'}
              </span>
              
              <div className="debt-actions">
                {debt.status === 'pending' && (
                  <>
                    <button className="action-button pay" onClick={() => handlePayment(debt.id)}>
                      Agregar Pago
                    </button>
                    <button className="action-button increase" onClick={() => handleIncrease(debt.id)}>
                      Aumentar Deuda
                    </button>
                  </>
                )}
                
                <button className="action-button delete" onClick={() => onDeleteDebt(debt.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};