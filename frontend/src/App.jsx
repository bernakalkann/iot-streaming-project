import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Thermometer, Droplets, Activity } from 'lucide-react'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [latestData, setLatestData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/data');
        const jsonData = await response.json();
        
        // Veriyi grafik için formatla
        const formattedData = jsonData.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: parseFloat(item.temperature),
          humidity: parseFloat(item.humidity),
          deviceId: item.deviceId
        }));
        
        setData(formattedData);
        if (formattedData.length > 0) {
          setLatestData(formattedData[formattedData.length - 1]);
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    // Her saniye veriyi güncelle (Real-time hissi)
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="live-indicator">
          <div className="pulse-dot"></div>
          CANLI YAYIN
        </div>
        <h1>Gerçek Zamanlı IoT Sensör Ağı</h1>
        <p>AWS Kinesis & DynamoDB Simüle Edilmiş Veri Akışı</p>
      </div>

      <div className="metrics-grid">
        {/* Sıcaklık Kartı */}
        <div className="glass-card">
          <div className="metric-header">
            <h3>Ortalama Sıcaklık</h3>
            <Thermometer color="#ef4444" size={24} />
          </div>
          <div className="metric-value">
            {latestData ? `${latestData.temperature}°C` : '--'}
          </div>
          <div className={`metric-status ${latestData && latestData.temperature > 30 ? 'status-warning' : 'status-good'}`}>
            {latestData && latestData.temperature > 30 ? 'Yüksek' : 'Normal'}
          </div>
        </div>

        {/* Nem Kartı */}
        <div className="glass-card">
          <div className="metric-header">
            <h3>Bağıl Nem</h3>
            <Droplets color="#3b82f6" size={24} />
          </div>
          <div className="metric-value">
            {latestData ? `%${latestData.humidity}` : '--'}
          </div>
          <div className="metric-status status-good">
            Optimum
          </div>
        </div>

        {/* Cihaz Durumu Kartı */}
        <div className="glass-card">
          <div className="metric-header">
            <h3>Aktif Cihaz</h3>
            <Activity color="#10b981" size={24} />
          </div>
          <div className="metric-value">
            {latestData ? latestData.deviceId : 'Bağlanıyor...'}
          </div>
          <div className="metric-status status-good">
            Aktif Akış Sağlanıyor
          </div>
        </div>
      </div>

      <div className="glass-card chart-container">
        <h3 className="chart-title">Gerçek Zamanlı Sensör Analitiği (AWS Kinesis Consumer Output)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="temperature" name="Sıcaklık (°C)" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" />
            <Area type="monotone" dataKey="humidity" name="Nem (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHum)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
