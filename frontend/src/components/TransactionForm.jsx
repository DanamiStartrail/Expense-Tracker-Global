export default function TransactionForm({ onSubmit, description, setDescription, amount, setAmount, categories, categoryId, setCategoryId }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
    <input type="text" placeholder="Beli apa hari ini?" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', color: '#333' }} />
    <input type="number" placeholder="Nominal (Rp)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', color: '#333' }} />
    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333' }}>
    <option value="">-- Pilih Kategori --</option>
    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
    </select>
    <button type="submit" style={{ padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
    Simpan Transaksi
    </button>
    </form>
  );
}
