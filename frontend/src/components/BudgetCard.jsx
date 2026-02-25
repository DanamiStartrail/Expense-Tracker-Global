export default function BudgetCard({ total, budget, timeFilter, onEditBudget, isOverBudget, isEditingBudget, setBudget, setIsEditingBudget }) {
  return (
    <div style={{ 
      textAlign: 'center', background: isOverBudget ? '#c0392b' : '#34495e', 
      padding: '20px', borderRadius: '12px', marginBottom: '20px', transition: 'all 0.3s ease'
    }}>
    <p style={{ margin: 0, fontSize: '0.85rem', color: isOverBudget ? '#ffcccc' : '#bdc3c7' }}>
    Total Pengeluaran ({timeFilter})
    </p>
    <h2 style={{ color: isOverBudget ? '#fff' : '#f1c40f', margin: '5px 0', fontSize: '2.2rem' }}>
    Rp {total.toLocaleString('id-ID')}
    </h2>
    
    <div style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.9 }}>
    Target Anggaran: 
    {isEditingBudget ? (
      <input 
      type="number" value={budget} 
      onChange={(e) => setBudget(e.target.value)}
      onBlur={() => setIsEditingBudget(false)}
      onKeyDown={(e) => e.key === 'Enter' && setIsEditingBudget(false)}
      style={{ width: '90px', marginLeft: '5px', borderRadius: '4px', border: 'none', padding: '2px 5px' }}
      autoFocus
      />
    ) : (
      <span onClick={onEditBudget} style={{ cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}>
      Rp {parseInt(budget).toLocaleString('id-ID')}
      </span>
    )}
    </div>
    </div>
  );
}
