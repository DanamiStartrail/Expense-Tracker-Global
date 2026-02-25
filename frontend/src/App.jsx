import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useTransactions } from './hooks/useTransactions';

// Import Komponen Modular
import BudgetCard from './components/BudgetCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AnalyticsChart from './components/AnalyticsChart';
import ExportButton from './components/ExportButton';

function App() {
  const { transactions, categories, fetchTransactions, deleteTransaction, resetAllTransactions } = useTransactions();
  
  // State UI
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('semua');
  const [budget, setBudget] = useState(1000000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  
  // --- LOGIKA FILTERING ---
  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    const now = new Date();
    const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchTime = true;
    if (timeFilter === 'hari') matchTime = tDate.toDateString() === now.toDateString();
    else if (timeFilter === 'bulan') matchTime = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    else if (timeFilter === 'tahun') matchTime = tDate.getFullYear() === now.getFullYear();
    
    return matchSearch && matchTime;
  });
  
  const totalExpense = filteredTransactions.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  
  const chartData = categories.map(cat => ({
    name: cat.name,
    value: filteredTransactions.filter(t => t.category_id === cat.id).reduce((s, t) => s + parseInt(t.amount), 0)
  })).filter(item => item.value > 0);
  
  // --- HANDLER TAMBAH DATA ---
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return toast.error("Isi data dengan lengkap!");
    if (parseInt(amount) <= 0) return toast.error("Nominal harus lebih dari 0!");
    
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        description,
        amount: parseInt(amount),
                       category_id: categoryId || null
      });
      setDescription(''); setAmount(''); setCategoryId('');
      fetchTransactions();
      toast.success("Transaksi berhasil dicatat!");
    } catch (error) { toast.error("Gagal simpan data"); }
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a252f', padding: '20px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
    {/* Container Notifikasi */}
    <Toaster position="top-right" reverseOrder={false} />
    
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>💰 Expense Tracker</h1>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
    {['semua', 'hari', 'bulan', 'tahun'].map(f => (
      <button key={f} onClick={() => setTimeFilter(f)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: timeFilter === f ? '#27ae60' : '#34495e', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>{f}</button>
    ))}
    </div>
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <BudgetCard total={totalExpense} budget={budget} timeFilter={timeFilter} isOverBudget={totalExpense > budget} isEditingBudget={isEditingBudget} setBudget={setBudget} setIsEditingBudget={setIsEditingBudget} onEditBudget={() => setIsEditingBudget(true)} />
    <AnalyticsChart chartData={chartData} />
    <TransactionForm onSubmit={handleAddTransaction} description={description} setDescription={setDescription} amount={amount} setAmount={setAmount} categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} />
    </div>
    
    <div style={{ flex: '1 1 350px', background: '#2c3e50', padding: '20px', borderRadius: '15px', maxHeight: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
    <TransactionList transactions={filteredTransactions} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onDelete={deleteTransaction} />
    <ExportButton data={filteredTransactions} onReset={resetAllTransactions} />
    </div>
    </div>
    </div>
  );
}

export default App;
