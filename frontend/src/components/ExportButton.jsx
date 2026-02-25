import * as XLSX from 'xlsx';

export default function ExportButton({ data, onReset }) {
  const exportToExcel = () => {
    if (data.length === 0) return alert("Tidak ada data untuk diekspor!");
    
    const worksheetData = data.map(t => ({
      Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
                                         Deskripsi: t.description,
                                         Kategori: t.category_name || 'Umum',
                                         Nominal: parseInt(t.amount)
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, `Laporan_Pengeluaran.xlsx`);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
    <button 
    onClick={exportToExcel}
    style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
    >
    📥 Export ke Excel (.xlsx)
    </button>
    
    <button 
    onClick={onReset}
    style={{ padding: '10px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
    >
    🗑️ Reset Semua Data
    </button>
    </div>
  );
}
