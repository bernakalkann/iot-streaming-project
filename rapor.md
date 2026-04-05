# Bulut Bilişim Dersi (3522)
## Proje 2: Gerçek Zamanlı Veri Akışı ve İşleme

### 1. Aşama: Giriş ve Mimari Tasarımı
Bu projede, AWS bulut platformu kullanılarak uçtan uca çalışabilen gerçek zamanlı bir IoT / WebSocket veri akış sistemi tasarlanmıştır.

**Hedeflenen Mimari:**
1. **IoT Simülatörü**: Gerçek zamanlı sensör verileri (Sıcaklık, Nem) üreterek bir WebSocket sunucusuna bağlanır.
2. **Backend**: Node.js tabanlı sunucu, WebSocket üzerinden gelen bu verileri alıp doğruladıktan sonra `AWS Kinesis Data Streams`'e gönderir.
3. **Stream ve Veritabanı**: AWS Kinesis'e düşen loglar, ayrı bir Data Consumer tarafından işlenerek AWS DynamoDB noSQL veritabanında depolanır.
4. **Frontend**: Gelecekteki aşamalarda, React.js kullanılarak bu veriler çekilerek şık ve premium tasarımlı bir arayüzde (Dashboard) görselleştirilir.

**Yapılan İşlemler:**
- Proje dosyası oluşturuldu.
- Sürüm kontrol sistemi (Git) başlatıldı.
- Rapor taslağı oluşturuldu ve ilk commit atıldı.

### 2. Aşama: Backend ve IoT Simülatör Kurulumu
İkinci aşamada Node.js ve WebSocket kullanılarak gerçek zamanlı veri akışının temelleri atılmıştır.

**Yapılan İşlemler:**
- `backend` klasörü oluşturulup `npm init` ile proje başlatılmıştır.
- Gerekli kütüphaneler (`express`, `ws`, `aws-sdk`, `dotenv`, `uuid`) kurulmuştur.
- Sensör verisini simüle etmek için `backend/simulator/index.js` dosyası oluşturulmuştur. Bu sistem saniyede bir rastgele sıcaklık ve nem verisi üreterek sisteme yollar.
- `backend/server.js` oluşturularak 8080 portunda WebSocket sunucusu ayağa kaldırılmıştır. Gelen bağlantılar ve anlık veriler başarıyla loglanmaktadır.

### 3. ve 4. Aşama: Bulut İletişimi ve Veri Depolama (AWS Simüle Edilmiş Ortam)
Kursa özgü verilen proje yönergesinde yer alan "(Sizin gerçek ortam bulma olasılığınız olmayabilir simule edeceksiniz)" kuralına binaen ve AWS IAM faturalandırma limitlerinden kaçınmak amacıyla; projedeki AWS Kinesis Message Broker ve DynamoDB modülleri yapısal olarak tamamen simüle edilerek kodlanmıştır.

**Yapılan İşlemler:**
- Kredi kartı bağlantılı bir abonelik limiti (Subscription needed) aşılmamak üzere `kinesisSimulator.js` geliştirildi.
- Sistem bu kütüphane aracılığıyla sanki gerçek bir Kinesis akışına Event (`putRecord`) atıyormuşçasına davranmaya başladı.
- Data Consumer mekanizması devreye alınarak Kinesis akışından biriken verileri okuması sağlandı. İşlenen (filtreleme ve loglama) veriler `database.json` noSQL simülasyon dosyasına kalıcı ve performanslı bir şekilde kaydedilmesi sağlandı. Veritabanının şişmemesi amacıyla gerçek zamanlıya uygun kuyruk bazlı (sadece en güncel veriler) depolama logiği kuruldu.
- Frontend'in bu veritabanına bağlanıp verileri çekebileceği RESTful API Endpointi (`/api/data`) yazıldı.

### 5. Aşama: Frontend Dashboard ve Görselleştirme
Bu aşamada AWS üzerinden çekilen anlık verilerin (Simüle edilmiş DB üzerinden) React altyapısıyla son kullanıcıya sergilenmesi sağlanmıştır. Bu aşamada özellikle **modern tasarım (Aesthetics)** kavramlarına odaklanılarak premium bir deneyim sunulmuştur.

**Yapılan İşlemler:**
- `Vite` kullanılarak yepyeni bir React uygulaması ayağa kaldırıldı.
- `Lucide-React` ile modern ikonlar ve `Recharts` kütüphanesi ile yüksek performanslı, animasyonlu veri grafikleri sisteme entegre edildi.
- React tarafında `setInterval` kullanılarak Backend'den saniyede bir veri çeken bir yapı (Dashboard) kuruldu.
- Sistem **Glassmorphism** (cam efekti), **Dark Mode** odaklı renk paletleri ve **Pulse mikro-animasyonlarıyla** ("Canlı Yayın" bildirimleri) zenginleştirildi. Yüksek UX hedeflenerek tasarlanan bu arayüz, gerçek zamanlı akan nem ve sıcaklık değerlerini milisaniyesinde grafiklere dökerek projeyi sonlandırdı.
