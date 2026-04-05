require('dotenv').config();
const AWS = require('aws-sdk');

// Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const kinesis = new AWS.Kinesis();

const streamName = 'IoT-Streaming-Data';

console.log('AWS Kinesis Data Stream Oluşturuluyor...');

kinesis.createStream({
  StreamName: streamName,
  ShardCount: 1
}, (err, data) => {
  if (err && err.code !== 'ResourceInUseException') {
    console.error('Kinesis stream hatası:', err.message);
  } else if (err && err.code === 'ResourceInUseException') {
    console.log('Stream zaten mevcut:', streamName);
  } else {
    console.log('Stream başarıyla oluşturuldu veya oluşturma tetiklendi.');
  }

  // Durumu kontrol et ve bekleniyor...
  let interval = setInterval(() => {
    kinesis.describeStream({ StreamName: streamName }, (err, data) => {
      if (err) {
        console.error('Durum okunamadı:', err.message);
      } else {
        const status = data.StreamDescription.StreamStatus;
        console.log(`Stream durumu: ${status}`);
        if (status === 'ACTIVE') {
          console.log('🚀 Stream AKTİF! Artık veri alıp gönderebiliriz.');
          clearInterval(interval);
        }
      }
    });
  }, 5000);
});
