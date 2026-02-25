const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Endpoint untuk dropdown kategori
app.get('/api/categories', async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(allCategories.rows); // Ini yang akan mengisi dropdown di frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal mengambil kategori" });
  }
});

// 1. Ambil semua transaksi
app.get('/api/transactions', async (req, res) => {
  try {
    const allTransactions = await pool.query(
      `SELECT t.*, c.name as category_name 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      ORDER BY t.date DESC`
    );
    res.json(allTransactions.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Tambah transaksi
app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, category_id } = req.body;
    const newTransaction = await pool.query(
      "INSERT INTO transactions (description, amount, category_id) VALUES($1, $2, $3) RETURNING *",
                                            [description, amount, category_id]
    );
    res.json(newTransaction.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Reset data
app.delete('/api/transactions-reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions');
    res.json({ message: "Data dibersihkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk menghapus SATU transaksi berdasarkan ID
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params; // Menangkap ID dari URL
    
    // Eksekusi query hapus ke PostgreSQL
    const deleteOp = await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
    
    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan!" });
    }
    
    res.json({ message: "Transaksi berhasil dihapus secara permanen." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat menghapus data." });
  }
});

// --- PENGATURAN SERVER ---
const PORT = 5000;

// MENGUBAH KE LOCALHOST:
// Hapus '0.0.0.0' dan ganti menjadi '127.0.0.1' agar hanya bisa diakses laptop sendiri
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server berjalan khusus di http://localhost:${PORT}`);
});
