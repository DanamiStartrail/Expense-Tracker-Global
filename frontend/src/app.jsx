import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error("Gagal mengambil data:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description || !amount) return alert("Isi semua data!")

    try {
      await axios.post('http://localhost:5000/api/transactions', {
        description,
        amount: parseInt(amount),
        user_id: null, // Sementara null sesuai skema DB kita
        category_id: null
      })
      setDescription('')
      setAmount('')
      fetchTransactions() // Refresh daftar setelah input
    } catch (error) {
      alert("Gagal menambah data")
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>💰 Expense Tracker</h1>
      
      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" placeholder="Keterangan (misal: Beli Nasi)" 
          value={description} onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <input 
          type="number" placeholder="Nominal (Rp)" 
          value={amount} onChange={(e) => setAmount(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Tambah Pengeluaran
        </button>
      </form>

      <hr />

      {/* DAFTAR TRANSAKSI */}
      <h3>Riwayat</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map((t) => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>{t.description}</span>
            <strong>Rp {parseInt(t.amount).toLocaleString('id-ID')}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
