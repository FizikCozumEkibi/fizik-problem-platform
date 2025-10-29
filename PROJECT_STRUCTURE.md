# 📁 Proje Yapısı

## 🌳 Klasör Ağacı

```
physics-solver-platform/
│
├── 📄 README.md                    # Ana dokümantasyon
├── 📄 INSTALLATION.md              # Kurulum rehberi
├── 📄 QUICKSTART.md                # Hızlı başlangıç
├── 📄 FEATURES.md                  # Özellik listesi
├── 📄 PROJECT_STRUCTURE.md         # Bu dosya
├── 📄 .gitignore                   # Git ignore kuralları
├── 📜 start.ps1                    # Windows başlatma scripti
│
├── 📂 backend/                     # Backend (Node.js + Express)
│   ├── 📄 package.json            # Backend bağımlılıkları
│   ├── 📄 server.js               # Ana sunucu dosyası
│   ├── 📄 .env.example            # Ortam değişkenleri şablonu
│   │
│   ├── 📂 routes/                 # API route'ları
│   │   ├── solver.js             # Problem çözme endpoints
│   │   ├── videos.js             # Video endpoints
│   │   ├── formulas.js           # Formül endpoints
│   │   └── admin.js              # Admin endpoints
│   │
│   ├── 📂 services/               # Business logic
│   │   └── aiService.js          # AI çözüm servisi
│   │
│   └── 📂 uploads/                # Yüklenen dosyalar
│       └── .gitkeep
│
└── 📂 frontend/                    # Frontend (React + Vite)
    ├── 📄 package.json            # Frontend bağımlılıkları
    ├── 📄 index.html              # HTML şablonu
    ├── 📄 vite.config.js          # Vite konfigürasyonu
    ├── 📄 tailwind.config.js      # Tailwind konfigürasyonu
    ├── 📄 postcss.config.js       # PostCSS konfigürasyonu
    │
    └── 📂 src/                    # Kaynak kodlar
        ├── 📄 main.jsx            # React entry point
        ├── 📄 App.jsx             # Ana uygulama
        ├── 📄 index.css           # Global stiller
        │
        ├── 📂 components/         # React komponentleri
        │   ├── Layout.jsx        # Ana layout (header/footer)
        │   └── SolutionDisplay.jsx # Çözüm gösterimi
        │
        └── 📂 pages/              # Sayfa komponentleri
            ├── Home.jsx          # Ana sayfa
            ├── Solver.jsx        # Problem çözücü
            ├── Videos.jsx        # Video kütüphanesi
            ├── Formulas.jsx      # Formül kütüphanesi
            ├── Admin.jsx         # Admin paneli
            ├── Solution.jsx      # Çözüm detayı
            └── NotFound.jsx      # 404 sayfası
```

## 📊 Dosya İstatistikleri

### Backend
- **Toplam Dosya**: 8
- **JavaScript Dosyaları**: 6
- **Config Dosyaları**: 2
- **Satır Sayısı**: ~1,200

### Frontend
- **Toplam Dosya**: 15
- **React Komponentleri**: 10
- **Config Dosyaları**: 5
- **Satır Sayısı**: ~2,500

### Dokümantasyon
- **Markdown Dosyaları**: 5
- **Toplam Satır**: ~800

## 🎯 Önemli Dosyalar

### Backend

#### `server.js`
- Express sunucusu
- Middleware konfigürasyonu
- Route tanımlamaları
- Error handling

#### `services/aiService.js`
- Hybrid AI sistemi
- Cache yönetimi
- Local physics solver
- API fallback mekanizması

#### `routes/solver.js`
- Problem çözme API'si
- Metin ve resim işleme
- OCR entegrasyonu
- Benzer problem önerileri

#### `routes/videos.js`
- Video kütüphanesi API'si
- Konu filtreleme
- Video arama
- Mock video veritabanı

#### `routes/formulas.js`
- Formül kütüphanesi API'si
- Formül arama
- Kategori filtreleme
- 50+ fizik formülü

#### `routes/admin.js`
- Admin panel API'si
- Kullanıcı yönetimi
- İstatistikler
- Authentication

### Frontend

#### `App.jsx`
- React Router konfigürasyonu
- Ana uygulama yapısı
- Route tanımlamaları

#### `components/Layout.jsx`
- Header ve navigation
- Footer
- Responsive menu
- Aktif link highlighting

#### `components/SolutionDisplay.jsx`
- Adım adım çözüm gösterimi
- Sesli anlatım
- Formül gösterimi
- Video önerileri

#### `pages/Home.jsx`
- Hero section
- Özellik kartları
- Konu kategorileri
- CTA bölümleri

#### `pages/Solver.jsx`
- Problem giriş formu
- Metin/Fotoğraf toggle
- OCR işleme
- Çözüm gösterimi

#### `pages/Videos.jsx`
- Video grid layout
- Filtreleme ve arama
- Video modal
- Responsive tasarım

#### `pages/Formulas.jsx`
- Formül listesi
- Kategori filtreleme
- Arama fonksiyonu
- Formül kopyalama

#### `pages/Admin.jsx`
- Login formu
- İstatistik kartları
- Kullanıcı tablosu
- CRUD işlemleri

## 🔌 API Endpoints

### Problem Çözücü
```
POST   /api/solver/solve-text      # Metin ile çözüm
POST   /api/solver/solve-image     # Resim ile çözüm
POST   /api/solver/similar         # Benzer problemler
```

### Video Kütüphanesi
```
GET    /api/videos/topics          # Konu listesi
GET    /api/videos/topic/:topic    # Konuya göre videolar
GET    /api/videos/:id             # Video detayı
GET    /api/videos/search/:query   # Video arama
```

### Formül Kütüphanesi
```
GET    /api/formulas/categories    # Kategori listesi
GET    /api/formulas/topic/:topic  # Konuya göre formüller
GET    /api/formulas/all           # Tüm formüller
GET    /api/formulas/search/:query # Formül arama
```

### Admin Paneli
```
POST   /api/admin/login            # Admin girişi
GET    /api/admin/users            # Kullanıcı listesi
GET    /api/admin/stats            # İstatistikler
PATCH  /api/admin/users/:id/status # Durum güncelle
DELETE /api/admin/users/:id        # Kullanıcı sil
```

### Health Check
```
GET    /api/health                 # Sunucu durumu
```

## 🎨 Kullanılan Teknolojiler

### Frontend Stack
```javascript
{
  "react": "18.2.0",                // UI Framework
  "vite": "5.0.8",                  // Build tool
  "tailwindcss": "3.3.6",          // CSS Framework
  "react-router-dom": "6.20.0",    // Routing
  "axios": "1.6.2",                // HTTP Client
  "tesseract.js": "5.0.3",         // OCR
  "lucide-react": "0.294.0"        // Icons
}
```

### Backend Stack
```javascript
{
  "express": "4.18.2",             // Web Framework
  "cors": "2.8.5",                 // CORS Middleware
  "helmet": "7.1.0",               // Security
  "multer": "1.4.5",               // File Upload
  "node-cache": "5.1.2",           // Caching
  "dotenv": "16.3.1"               // Environment Variables
}
```

## 🚀 Başlatma Komutları

### Otomatik (Windows)
```powershell
.\start.ps1
```

### Manuel

**Backend:**
```powershell
cd backend
npm install
npm start
```

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

## 📝 Ortam Değişkenleri

Backend `.env` dosyası:
```env
PORT=5000
NODE_ENV=development
USE_LOCAL_MODEL=true
ENABLE_CACHE=true
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Test URL'leri

- **Ana Sayfa**: http://localhost:3000
- **Problem Çözücü**: http://localhost:3000/solver
- **Video Kütüphanesi**: http://localhost:3000/videos
- **Formül Kütüphanesi**: http://localhost:3000/formulas
- **Admin Paneli**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📚 Dokümantasyon Dosyaları

1. **README.md** - Genel bakış ve özellikler
2. **INSTALLATION.md** - Detaylı kurulum adımları
3. **QUICKSTART.md** - Hızlı başlangıç rehberi
4. **FEATURES.md** - Teknik özellikler ve detaylar
5. **PROJECT_STRUCTURE.md** - Bu dosya

## 🔐 Varsayılan Giriş Bilgileri

**Admin Paneli:**
- Kullanıcı: `admin`
- Şifre: `admin123`

## 📊 Kod Metrikleri

### Toplam
- **JavaScript Dosyaları**: 16
- **React Komponentleri**: 10
- **API Endpoints**: 15
- **Toplam Satır**: ~3,700

### Karmaşıklık
- **Backend**: Orta karmaşıklık
- **Frontend**: Orta-Yüksek karmaşıklık
- **Toplam Modül**: 25+

## 🎯 Sonraki Adımlar

1. ✅ Projeyi başlatın: `.\start.ps1`
2. ✅ Tarayıcıda açın: http://localhost:3000
3. ✅ İlk problemi çözün
4. 📝 Database entegrasyonu (MongoDB/PostgreSQL)
5. 🔐 User authentication sistemi
6. 📱 Mobile responsive iyileştirmeleri
7. 🧪 Test coverage ekleme
8. 🚀 Production deployment

---

**Not:** Tüm dosyalar UTF-8 encoding ile oluşturulmuştur.
