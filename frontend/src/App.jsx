import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // 1. Fungsi Ambil Data Transaksi (Memanfaatkan JOIN dari Backend)
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error)
    }
  }
  
  // 2. Fungsi Ambil Daftar Kategori untuk Dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error("Gagal mengambil kategori:", error)
    }
  }
  
  // 3. Fungsi Tambah Data
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description || !amount) return alert("Isi deskripsi dan nominal!")
      
      try {
        await axios.post('http://localhost:5000/api/transactions', {
          description,
          amount: parseInt(amount),
                         user_id: null,
                         category_id: categoryId || null // Mengirim ID kategori yang dipilih ke database
        })
        
        // Reset form setelah sukses
        setDescription('')
        setAmount('')
        setCategoryId('') 
        fetchTransactions() // Memperbarui daftar secara otomatis
      } catch (error) {
        alert("Gagal menambah data")
      }
  }
  
  // 4. Fungsi Hapus Data
  const deleteTransaction = async (id) => {
    if (window.confirm("Yakin ingin menghapus transaksi ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`)
        fetchTransactions()
      } catch (error) {
        alert("Gagal menghapus")
      }
    }
  }
  
  // Inisialisasi data saat aplikasi pertama kali dimuat
  useEffect(() => { 
    fetchTransactions()
    fetchCategories()
  }, [])
  
  // Menghitung Total Pengeluaran secara dinamis
  const totalExpense = transactions.reduce((acc, curr) => acc + parseInt(curr.amount), 0)
  
  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial', color: '#fff', backgroundColor: '#2c3e50', minHeight: '100vh' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>💰 Expense Tracker</h1>
    
    {/* Kartu Ringkasan Total */}
    <div style={{ textAlign: 'center', background: '#34495e', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <p style={{ margin: 0, fontSize: '0.9rem', color: '#bdc3c7' }}>Total Pengeluaran</p>
    <h2 style={{ margin: '5px 0 0 0', color: '#f1c40f', fontSize: '2rem' }}>
    Rp {totalExpense.toLocaleString('id-ID')}
    </h2>
    </div>
    
    {/* Form Input Transaksi */}
    <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <input 
    type="text" placeholder="Beli apa hari ini?" 
    value={description} onChange={(e) => setDescription(e.target.value)}
    style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', color: '#333' }}
    />
    <input 
    type="number" placeholder="Nominal (Rp)" 
    value={amount} onChange={(e) => setAmount(e.target.value)}
    style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', color: '#333' }}
    />
    
    {/* Dropdown Pilihan Kategori */}
    <select 
    value={categoryId} 
    onChange={(e) => setCategoryId(e.target.value)}
    style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', backgroundColor: '#fff', color: '#333' }}
    >
    <option value="">-- Pilih Kategori --</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>{cat.name}</option>
    ))}
    </select>
    
    <button type="submit" style={{ padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
    Simpan Transaksi
    </button>
    </form>
    
    <hr style={{ borderColor: '#555', marginBottom: '20px' }} />
    
    {/* Daftar Riwayat Transaksi */}
    <h3>Riwayat Belanja</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
    {transactions.length === 0 ? (
      <p style={{ color: '#bdc3c7', textAlign: 'center' }}>Belum ada data.</p>
    ) : (
      transactions.map((t) => (
        <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#34495e', marginBottom: '8px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '1rem', fontWeight: '500' }}>{t.description}</span>
        {/* Menampilkan kategori hasil JOIN dari backend */}
        <span style={{ fontSize: '0.75rem', color: '#bdc3c7', fontStyle: 'italic' }}>
        Kategori: {t.category_name || 'Umum'}
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ecf0f1', marginTop: '4px' }}>
        Rp {parseInt(t.amount).toLocaleString('id-ID')}
        </span>
        </div>
        <button 
        onClick={() => deleteTransaction(t.id)}
        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
        Hapus
        </button>
        </li>
      ))
    )}
    </ul>
    </div>
  )
}

export default App
