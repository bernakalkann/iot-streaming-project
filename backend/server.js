const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// AWS Kinesis Simülasyon modülünü dahil et
const KinesisSimulator = require('./kinesisSimulator');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send('Gerçek Zamanlı Veri Akışı Sunucusu Çalışıyor (Simulated AWS Mode)');
});

// Frontend'in veritabanındaki verileri çekebileceği API endpoint'i
app.get('/api/data', (req, res) => {
  const dbPath = path.join(__dirname, 'database.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Veritabanı okunamadı' });
    res.json(data ? JSON.parse(data) : []);
  });
});

// WebSocket Bağlantısı Kurulduğunda
wss.on('connection', (ws) => {
  console.log('Yeni bir IoT cihazı bağlandı.');

  // İstemciden mesaj geldiğinde
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // AWS Kinesis Data stream e kayıt gönderiyoruz
      KinesisSimulator.putRecord(data);
      
    } catch (err) {
      console.error('Veri işlenirken hata:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('IoT cihazı bağlantıyı koptu.');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde başlatıldı.`);
  console.log(`WebSocket sunucusu ws://localhost:${PORT} üzerinde dinliyor.`);
});
