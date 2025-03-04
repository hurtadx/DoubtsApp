import { useState } from 'react';
import { createDebt } from '../utils/calculations';

export const DebtForm = ({ onDebtCreate }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    debtor: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDebt = createDebt(
      formData.description,
      formData.amount,
      formData.debtor
    );
    onDebtCreate(newDebt);
    setFormData({ description: '', amount: '', debtor: '' });
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="debt-form-container">
      {!isFormOpen ? (
        <button 
          className="add-debt-button"
          onClick={() => setIsFormOpen(true)}
        >
          + Nueva Deuda
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="debt-form">
          <h2>Nueva Deuda</h2>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <input
              id="description"
              type="text"
              name="description"
              placeholder="Ej: Préstamo para laptop"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Monto ($)</label>
            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="debtor">Deudor</label>
            <input
              id="debtor"
              type="text"
              name="debtor"
              placeholder="Nombre"
              value={formData.debtor}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="button" className="cancel-button" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Guardar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};