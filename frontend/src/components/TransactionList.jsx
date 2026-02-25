export default function TransactionList({ transactions, searchTerm, setSearchTerm, onDelete }) {
  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
    <h3 style={{ margin: 0 }}>Riwayat</h3>
    <input 
    type="text" placeholder="Cari..." value={searchTerm} 
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', width: '130px', color: '#333', fontSize: '0.8rem' }}
    />
    </div>
    
    <ul style={{ listStyle: 'none', padding: 0 }}>
    {transactions.length === 0 ? (
      <p style={{ color: '#bdc3c7', textAlign: 'center' }}>Data tidak ditemukan.</p>
    ) : (
      transactions.map((t) => (
        <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#34495e', marginBottom: '10px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{t.description}</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
        <span style={{ 
          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', color: '#fff', fontWeight: 'bold',
          background: t.category_name === 'Roblox/Game' ? '#8e44ad' : t.category_name === 'Kuliah' ? '#2980b9' : '#7f8c8d'
        }}>
        {t.category_name || 'Umum'}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#95a5a6' }}>
        {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ecf0f1', marginTop: '4px' }}>
        Rp {parseInt(t.amount).toLocaleString('id-ID')}
        </span>
        </div>
        <button onClick={() => onDelete(t.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        Hapus
        </button>
        </li>
      ))
    )}
    </ul>
    </>
  );
}
