const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class KinesisSimulator extends EventEmitter {
  constructor() {
    super();
    this.streamName = 'Simulated-IoT-Stream';
    this.dbPath = path.join(__dirname, 'database.json');
    console.log(`[AWS Kinesis Simülatörü] ${this.streamName} Başlatıldı!`);
  }

  // Gelen veriyi Kinesis Stream'e yazar
  putRecord(data) {
    console.log(`[AWS Kinesis] Yeni kayıt akışa alındı:`, data.deviceId);
    this.emit('data', data); // Data Consumer'ı tetikler
  }
}

const kinesisStream = new KinesisSimulator();

// Data Consumer: Kinesis'ten sürekli veri okuyan servis (Simülasyon)
kinesisStream.on('data', (record) => {
  // Gelen veriyi DynamoDB (database.json) olarak işleyip kaydediyoruz.
  fs.readFile(kinesisStream.dbPath, 'utf8', (err, dbData) => {
    let db = [];
    if (!err && dbData) {
      try {
        db = JSON.parse(dbData);
      } catch(e) {}
    }
    
    // Yalnızca son 50 kaydı tutarak veritabanının şişmesini engelliyoruz (Real-time dashboard için)
    if (db.length > 50) db.shift();
    
    db.push(record);

    fs.writeFile(kinesisStream.dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) console.error('[DynamoDB Simülasyonu] Kayıt hatası:', err);
    });
  });
});

module.exports = kinesisStream;
