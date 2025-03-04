import { calculateBalance } from '../utils/calculations';
import { useState } from 'react';
import { Modal } from './Modal';

export const DebtList = ({ debts, onAddPayment, onIncreaseDebt, onDeleteDebt }) => {
  const [filter, setFilter] = useState('all');
  const [modalType, setModalType] = useState(null); // 'payment', 'increase', null
  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const [amountInput, setAmountInput] = useState('');
  
  const openModal = (type, debtId) => {
    setModalType(type);
    setSelectedDebtId(debtId);
    setAmountInput('');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDebtId(null);
    setAmountInput('');
  };
  
  const handleSubmitPayment = () => {
    if (amountInput && !isNaN(amountInput) && Number(amountInput) > 0) {
      onAddPayment(selectedDebtId, Number(amountInput));
      closeModal();
    }
  };
  
  const handleSubmitIncrease = () => {
    if (amountInput && !isNaN(amountInput) && Number(amountInput) > 0) {
      onIncreaseDebt(selectedDebtId, Number(amountInput));
      closeModal();
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

  // Encontrar la deuda seleccionada (para el modal)
  const selectedDebt = selectedDebtId ? debts.find(debt => debt.id === selectedDebtId) : null;

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
                    <button className="action-button pay" onClick={() => openModal('payment', debt.id)}>
                      Agregar Pago
                    </button>
                    <button className="action-button increase" onClick={() => openModal('increase', debt.id)}>
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

      {/* Modal para agregar pagos */}
      <Modal 
        isOpen={modalType === 'payment'} 
        title={`Agregar pago a ${selectedDebt?.description || ''}`}
        onClose={closeModal}
      >
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="payment-amount">Monto del pago</label>
            <input
              id="payment-amount"
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              min="0"
              step="1000"
              placeholder="0"
              autoFocus
            />
          </div>
          <div className="form-group">
            <p>Deudor: <strong>{selectedDebt?.debtor}</strong></p>
            <p>Saldo pendiente: <strong>{selectedDebt ? formatCurrency(calculateBalance(selectedDebt)) : ''}</strong></p>
          </div>
          <div className="form-buttons">
            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
            <button 
              className="submit-button" 
              onClick={handleSubmitPayment}
              disabled={!amountInput || isNaN(amountInput) || Number(amountInput) <= 0}
            >
              Registrar Pago
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para aumentar deuda */}
      <Modal 
        isOpen={modalType === 'increase'} 
        title={`Aumentar deuda: ${selectedDebt?.description || ''}`}
        onClose={closeModal}
      >
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="increase-amount">Monto a aumentar</label>
            <input
              id="increase-amount"
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              min="0"
              step="1000"
              placeholder="0"
              autoFocus
            />
          </div>
          <div className="form-group">
            <p>Deudor: <strong>{selectedDebt?.debtor}</strong></p>
            <p>Monto actual: <strong>{selectedDebt ? formatCurrency(selectedDebt.amount) : ''}</strong></p>
          </div>
          <div className="form-buttons">
            <button className="cancel-button" onClick={closeModal}>Cancelar</button>
            <button 
              className="submit-button" 
              onClick={handleSubmitIncrease}
              disabled={!amountInput || isNaN(amountInput) || Number(amountInput) <= 0}
            >
              Aumentar Deuda
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};