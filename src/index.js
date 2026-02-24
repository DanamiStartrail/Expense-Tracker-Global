const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi Database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Cek Koneksi Database
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error menyambungkan ke database:', err.stack);
  }
  console.log('Database terhubung dengan sukses!');
  release();
});

// Endpoint Testing
app.get('/', (req, res) => {
  res.send('API Expense Tracker Berjalan!');
});

// Endpoint untuk Menambah Transaksi Baru
app.post('/api/transactions', async (req, res) => {
  const { user_id, category_id, amount, description, date } = req.body;

  try {
    const query = `
      INSERT INTO transactions (user_id, category_id, amount, description, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [user_id, category_id, amount, description, date || new Date()];
    
    const result = await pool.query(query, values);
    res.status(201).json({
      message: "Transaksi berhasil dicatat!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal menyimpan transaksi" });
  }
});

// Endpoint untuk Melihat Semua Transaksi
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as category_name 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      ORDER BY t.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
