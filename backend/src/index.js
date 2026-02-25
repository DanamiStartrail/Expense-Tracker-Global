const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Mengambil koneksi database dari db.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Agar server bisa membaca data JSON dari frontend

/**
 * 1. GET ALL TRANSACTIONS
 * Mengambil data transaksi beserta nama kategorinya
 */
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
    console.error(err.message);
    res.status(500).json({ error: "Gagal mengambil data transaksi" });
  }
});

/**
 * 2. GET ALL CATEGORIES
 * Mengambil daftar kategori untuk dropdown di frontend
 */
app.get('/api/categories', async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
});

/**
 * 3. POST NEW TRANSACTION
 * Menyimpan transaksi baru ke database
 */
app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, category_id, user_id } = req.body;
    const newTransaction = await pool.query(
      "INSERT INTO transactions (description, amount, category_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
                                            [description, amount, category_id, user_id]
    );
    res.json(newTransaction.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal menyimpan transaksi" });
  }
});

/**
 * 4. DELETE TRANSACTION BY ID
 * Menghapus satu transaksi berdasarkan ID-nya
 */
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal menghapus transaksi" });
  }
});

/**
 * 5. RESET ALL DATA
 * Menghapus seluruh riwayat transaksi di database
 */
app.delete('/api/transactions-reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions');
    res.json({ message: "Seluruh data riwayat berhasil dibersihkan!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal mereset database" });
  }
});

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan stabil di port ${PORT}`);
});
