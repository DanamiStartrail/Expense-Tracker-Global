# 💰 Expense Tracker Full-Stack

Aplikasi pengelolaan keuangan pribadi berbasis web yang dibangun dengan arsitektur **PERN Stack** (PostgreSQL, Express, React, Node.js). Proyek ini dirancang secara modular dan dapat diakses melalui jaringan lokal (Mobile Access).

---

## 🚀 Fitur Utama

* **Dashboard Interaktif**: Tampilan dashboard responsif dengan sistem layout dua kolom menggunakan Tailwind CSS.
* **Visualisasi Data**: Analitik pengeluaran menggunakan grafik lingkaran (Pie Chart) berdasarkan kategori.
* **Manajemen Anggaran**: Kartu anggaran dinamis yang memberikan peringatan visual jika pengeluaran melebihi batas (Limit).
* **Export Laporan**: Fitur untuk mengekspor seluruh riwayat transaksi ke format Excel (.xlsx).
* **Sistem Notifikasi Modern**: Menggunakan `SweetAlert2` untuk dialog konfirmasi dan `react-hot-toast` untuk notifikasi *non-blocking*.
* **Mobile Friendly**: Konfigurasi jaringan khusus yang memungkinkan akses aplikasi melalui perangkat HP dalam jaringan Wi-Fi yang sama.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite)**: Library utama untuk UI.
* **Tailwind CSS**: Framework CSS untuk styling yang cepat dan modern.
* **Axios**: Library untuk komunikasi data dengan API.
* **SweetAlert2 & React Hot Toast**: Sistem notifikasi dan dialog.

### Backend
* **Node.js & Express.js**: Server dan penyedia REST API.
* **PostgreSQL**: Database relasional untuk penyimpanan data transaksi dan kategori.
* **Dotenv**: Manajemen variabel lingkungan untuk keamanan kredensial database.

---

## 📁 Struktur Proyek

```text
Expense-Tracker/
├── backend/
│   ├── src/
│   │   ├── db.js          # Konfigurasi koneksi PostgreSQL
│   │   └── index.js       # Main server & REST API Endpoints
│   └── .env               # Database credentials
└── frontend/
    ├── src/
    │   ├── components/    # Komponen modular (Chart, Form, List, dll)
    │   ├── hooks/         # Custom Hook (useTransactions.js)
    │   └── App.jsx        # Root component
    └── postcss.config.js  # Konfigurasi Tailwind & PostCSS
```
## 🛠️ Cara Instalasi

### 1. Persiapan Database
Buat database baru bernama `expense_tracker_db` di PostgreSQL, kemudian jalankan query SQL berikut untuk menyiapkan tabel dan data awal kategori:

```sql
-- Membuat Tabel Kategori
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
-- Membuat Tabel Transaksi
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- Inisialisasi Kategori Awal
INSERT INTO categories (name) VALUES 
('Makanan'), 
('Transportasi'), 
('Hiburan'), 
('Kuliah'), 
('Gaming');
```
### 2. Konfigurasi Backend
Pindah ke direktori backend, siapkan file `.env` untuk kredensial database, lalu jalankan perintah berikut:
```bash
# Masuk ke folder backend
cd backend

# Install dependensi
npm install

# Jalankan server
node src/index.js
```
### 3. Konfigurasi Frontend
Pindah ke direktori frontend dan jalankan aplikasi menggunakan Vite:
```bash
# Masuk ke folder frontend
cd frontend

# Install dependensi
npm install

# Jalankan aplikasi di localhost
npm run dev
```
## 🧑‍💻 Author
Mandanta Gurusinga Informatics Engineering Student (Class of 2024).
