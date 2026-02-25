const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi Database (Gunakan file .env agar aman)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Cek Koneksi Database saat startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Gagal koneksi ke database PostgreSQL:', err.stack);
  }
  console.log('✅ Database PostgreSQL terhubung!');
  release();
});

// 1. Ambil Semua Transaksi (Join dengan Kategori)
app.get('/api/transactions', async (req, res) => {
  try {
    const query = `
    SELECT t.*, c.name as category_name 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    ORDER BY t.date DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data transaksi" });
  }
});

// 2. Tambah Transaksi Baru
app.post('/api/transactions', async (req, res) => {
  const { user_id, category_id, amount, description, date } = req.body;
  try {
    const query = `
    INSERT INTO transactions (user_id, category_id, amount, description, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const values = [
      user_id || null, 
      category_id || null, 
      amount, 
      description, 
      date || new Date()
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan transaksi" });
  }
});

// 3. Ambil Daftar Kategori (Untuk Dropdown di React)
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil kategori" });
  }
});

// 4. Hapus Transaksi
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus data" });
  }
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Backend menyala di port ${PORT}`);
});
