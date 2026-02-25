import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export const useTransactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	
	// 1. Fungsi mengambil data transaksi
	const fetchTransactions = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/transactions');
			setTransactions(response.data);
		} catch (error) {
			console.error("Error fetching transactions:", error);
		} finally {
			setLoading(false);
		}
	};
	
	// 2. Fungsi mengambil data kategori
	const fetchCategories = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/categories');
			setCategories(response.data);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};
	
	// 3. Efek samping saat komponen pertama kali dimuat
	useEffect(() => {
		fetchTransactions();
		fetchCategories();
	}, []);
	
	// 4. Fungsi menghapus transaksi satuan (dengan SweetAlert2)
	const deleteTransaction = async (id) => {
		const result = await Swal.fire({
			title: 'Hapus Transaksi?',
			text: "Data yang dihapus tidak dapat dikembalikan!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#e74c3c',
			cancelButtonColor: '#34495e',
			confirmButtonText: 'Ya, Hapus!',
			cancelButtonText: 'Batal',
			background: '#2c3e50',
			color: '#fff'
		});
		
		if (result.isConfirmed) {
			try {
				await axios.delete(`http://localhost:5000/api/transactions/${id}`);
				fetchTransactions();
				toast.success("Transaksi berhasil dihapus!");
			} catch (error) {
				toast.error("Gagal menghapus transaksi.");
			}
		}
	};
	
	// 5. Fungsi reset database (dengan SweetAlert2 Input)
	const resetAllTransactions = async () => {
		const { value: confirmText } = await Swal.fire({
			title: 'Reset Semua Data?',
			text: "Seluruh riwayat akan hilang. Ketik 'HAPUS' untuk konfirmasi:",
			input: 'text',
			inputPlaceholder: 'HAPUS',
			showCancelButton: true,
			confirmButtonColor: '#c0392b',
			cancelButtonColor: '#34495e',
			confirmButtonText: 'Ya, Bersihkan!',
			cancelButtonText: 'Batal',
			background: '#2c3e50',
			color: '#fff',
			inputAttributes: {
				autocapitalize: 'off'
			}
		});
		
		if (confirmText === 'HAPUS') {
			try {
				await axios.delete('http://localhost:5000/api/transactions-reset');
				fetchTransactions();
				toast.success("Database berhasil dibersihkan!", { icon: '🗑️' });
			} catch (error) {
				toast.error("Gagal mereset database.");
			}
		} else if (confirmText !== undefined) {
			// Jika user mengetik selain HAPUS dan menekan OK
			toast.error("Konfirmasi kata kunci salah!");
		}
	};
	
	return { 
		transactions, 
		categories, 
		loading, 
		fetchTransactions, 
		deleteTransaction, 
		resetAllTransactions 
	};
};
