import { useState, useEffect } from 'react';
import { DebtForm } from './components/DebtForm';
import { DebtList } from './components/DebtList';
import { addPayment, increaseDebt } from './utils/calculations';
import './App.css';

function App() {
  const [debts, setDebts] = useState(() => {
    const savedDebts = localStorage.getItem('debts');
    return savedDebts ? JSON.parse(savedDebts) : [];
  });

  

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const handleDebtCreate = (newDebt) => {
    setDebts([...debts, newDebt]);
  };

  const handleAddPayment = (debtId, amount) => {
    setDebts(debts.map(debt => 
      debt.id === debtId ? addPayment(debt, amount) : debt
    ));
  };

  const handleIncreaseDebt = (debtId, amount) => {
    setDebts(debts.map(debt =>
      debt.id === debtId ? increaseDebt(debt, amount) : debt
    ));
  };

  const handleDeleteDebt = (debtId) => {
    setDebts(debts.filter(debt => debt.id !== debtId));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Control de Deudas</h1>
      </header>
      
      <DebtForm onDebtCreate={handleDebtCreate} />
      
      <DebtList 
        debts={debts}
        onAddPayment={handleAddPayment}
        onIncreaseDebt={handleIncreaseDebt}
        onDeleteDebt={handleDeleteDebt}
      />
    </div>
  );
}

export default App;
