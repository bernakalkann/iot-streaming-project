const WebSocket = require('ws');

// Sunucuya bağlan
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('Sunucuya bağlanıldı. Satış noktası (IoT) verileri gönderiliyor...');

  // Her saniye rastgele bir veri gönder
  setInterval(() => {
    const data = {
      deviceId: 'sensor-' + Math.floor(Math.random() * 5) + 1,
      temperature: (20 + Math.random() * 15).toFixed(2), // 20-35 derece arası
      humidity: (40 + Math.random() * 30).toFixed(2), // %40-70 arası
      timestamp: new Date().toISOString()
    };
    
    console.log('Veri Gönderiliyor:', data);
    ws.send(JSON.stringify(data));
  }, 1000);
});

ws.on('close', function close() {
  console.log('Sunucu ile bağlantı kesildi');
});

ws.on('error', function error(err) {
  console.error('WebSocket Hata:', err.message);
});
