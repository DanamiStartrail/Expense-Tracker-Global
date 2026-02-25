import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AnalyticsChart({ chartData }) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (chartData.length === 0) return (
    <div style={{ textAlign: 'center', padding: '20px', background: '#2c3e50', borderRadius: '15px' }}>
    <p style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>Belum ada data untuk dianalisis.</p>
    </div>
  );
  
  return (
    <div style={{ height: '320px', background: '#2c3e50', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
    <ResponsiveContainer width="100%" height="100%">
    <PieChart>
    <Pie data={chartData} innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
    {chartData.map((_, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
    </Pie>
    <Tooltip contentStyle={{ borderRadius: '8px', color: '#333' }} />
    <Legend verticalAlign="bottom" height={36}/>
    </PieChart>
    </ResponsiveContainer>
    </div>
  );
}
