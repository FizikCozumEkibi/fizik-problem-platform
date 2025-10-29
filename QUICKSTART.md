# ⚡ Hızlı Başlangıç

## 🎯 En Hızlı Yöntem (Windows)

1. PowerShell'i yönetici olarak açın
2. Proje klasörüne gidin:
```powershell
cd C:\Users\halim\CascadeProjects\physics-solver-platform
```

3. Başlatma scriptini çalıştırın:
```powershell
.\start.ps1
```

Script otomatik olarak:
- ✅ Node.js kontrolü yapar
- ✅ Bağımlılıkları yükler
- ✅ .env dosyasını oluşturur
- ✅ Backend ve Frontend'i başlatır
- ✅ Tarayıcıda açar

## 🔧 Manuel Kurulum

### Backend
```powershell
cd backend
npm install
copy .env.example .env
npm start
```

### Frontend (Yeni Terminal)
```powershell
cd frontend
npm install
npm run dev
```

## 🌐 Erişim

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Admin**: http://localhost:3000/admin
  - Kullanıcı: `admin`
  - Şifre: `admin123`

## 🧪 İlk Test

1. Ana sayfada "Hemen Çözmeye Başla" butonuna tıklayın
2. Örnek problem yazın:
```
Bir cisim 10 m/s hız ile düşey yukarı atılıyor. 
Cisim kaç saniye sonra en yüksek noktaya ulaşır? (g=10 m/s²)
```
3. "Çözümü Göster" butonuna tıklayın
4. Adım adım çözümü inceleyin
5. "Sesli Dinle" butonuna tıklayarak çözümü dinleyin

## 📸 Fotoğraf ile Test

1. "Fotoğraf ile Giriş" sekmesine geçin
2. Bir fizik problemi fotoğrafı yükleyin
3. OCR otomatik olarak metni çıkaracak
4. "Çözümü Göster" ile sonucu görün

## 🎥 Video Eğitimler

1. Üst menüden "Video Eğitimler" sekmesine gidin
2. Konu seçin (Kinematik, Dinamik, vb.)
3. Video kartına tıklayarak izleyin

## 📚 Formül Kütüphanesi

1. Üst menüden "Formül Kütüphanesi" sekmesine gidin
2. Konu filtreleyin veya arama yapın
3. Formülleri görüntüleyin ve kopyalayın

## ⚙️ Admin Paneli

1. Sağ üst köşedeki "Admin" butonuna tıklayın
2. Giriş yapın (admin / admin123)
3. Kullanıcıları yönetin ve istatistikleri görüntüleyin

## ⚠️ Sorun Giderme

### Port kullanımda hatası
```powershell
# Kullanılan portları kontrol edin
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# İşlemi sonlandırın
taskkill /PID <PID> /F
```

### Bağımlılık hataları
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### OCR çalışmıyor
- İnternet bağlantınızı kontrol edin (ilk kulanımda dil dosyaları indirilir)
- Tarayıcıyı yeniden başlatın
- Daha net ve yüksek çözünürlüklü fotoğraf kullanın

## 🎓 Özellikler

✅ **Çalışan:**
- Metin ve fotoğraf ile problem girişi
- AI destekli çözüm (API Key gerektirmez)
- Adım adım açıklamalar
- Sesli anlatım (Browser TTS)
- Video kütüphanesi
- Formül kütüphanesi
- Admin paneli
- Responsive tasarım

## 📖 Daha Fazla Bilgi

- Detaylı kurulum: `INSTALLATION.md`
- Özellik listesi: `FEATURES.md`
- Ana dokümantasyon: `README.md`

## 🆘 Yardım

Sorunlarla karşılaşırsanız:
1. Terminal çıktısını kontrol edin
2. Browser console'u kontrol edin (F12)
3. `INSTALLATION.md` dosyasındaki sorun giderme bölümüne bakın

---

**Not:** İlk çalıştırmada bağımlılık yüklemesi 2-5 dakika sürebilir.
