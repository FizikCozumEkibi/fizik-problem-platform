# 🚀 Kurulum Rehberi

## Gereksinimler

- Node.js 18+ (https://nodejs.org/)
- npm veya yarn paket yöneticisi

## Hızlı Başlangıç

### 1. Backend Kurulumu

```powershell
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
copy .env.example .env

# Sunucuyu başlatın
npm start
```

Backend varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

### 2. Frontend Kurulumu

```powershell
# Yeni bir terminal açın ve frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## 🔧 Yapılandırma

### Backend (.env)

Backend klasöründeki `.env` dosyasını düzenleyin:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI API Keys (Opsiyonel - Platform API Key olmadan çalışır)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_KEY=

# AI Configuration
USE_LOCAL_MODEL=true          # true: Local model kullan, false: API kullan
ENABLE_API_FALLBACK=true      # API başarısız olursa local'e geç
ENABLE_CACHE=true             # Çözümleri cache'le

# Security
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760        # 10MB
UPLOAD_DIR=./uploads
```

### Önemli Notlar

1. **API Key Gereksiz**: Platform API Key olmadan da çalışır. Local physics solver kullanır.

2. **API Kullanımı (Opsiyonel)**: 
   - OpenAI, Anthropic veya Google AI API Key'i ekleyebilirsiniz
   - Daha gelişmiş çözümler için API kullanımı önerilir
   - API başarısız olursa otomatik olarak local model'e geçer

3. **Cache Sistemi**: 
   - `ENABLE_CACHE=true` olarak bırakın
   - Aynı problemleri tekrar çözmek daha hızlı olur

## 📦 Production Build

### Frontend Production Build

```powershell
cd frontend
npm run build
```

Build dosyaları `frontend/dist` klasöründe oluşturulur.

### Backend Production

```powershell
cd backend
$env:NODE_ENV="production"
npm start
```

## 🧪 Test Etme

1. Browser'da `http://localhost:3000` adresini açın
2. "Problem Çöz" butonuna tıklayın
3. Örnek bir fizik problemi yazın:
   ```
   Bir cisim 5 m/s hız ile hareket ederken 2 m/s² ivme ile yavaşlamaktadır. 
   Cisim kaç saniye sonra durur?
   ```
4. "Çözümü Göster" butonuna tıklayın
5. Adım adım çözümü inceleyin

## 🎯 Özellikler

### ✅ Çalışan Özellikler

- ✅ Metin ile problem girişi
- ✅ Fotoğraf ile problem girişi (OCR)
- ✅ TYT/AYT seviye seçimi
- ✅ Adım adım fizik çözümleri
- ✅ Sesli anlatım (Browser TTS)
- ✅ Video kütüphanesi
- ✅ Formül kütüphanesi
- ✅ Admin paneli
- ✅ Responsive tasarım
- ✅ Cache sistemi
- ✅ Hybrid AI (Local + API)

### 🔄 Geliştirme Aşamasında

- Database entegrasyonu (MongoDB/PostgreSQL)
- Kullanıcı kayıt/giriş sistemi
- Çözüm geçmişi
- Favoriler sistemi
- Gerçek TTS (Google/Azure TTS)
- Daha gelişmiş OCR

## 🐛 Sorun Giderme

### Port Kullanımda Hatası

Eğer portlar kullanımdaysa `.env` dosyasında farklı portlar belirleyin:

```env
# Backend
PORT=5001

# Frontend (vite.config.js)
server: { port: 3001 }
```

### OCR Çalışmıyor

Tesseract.js ilk kullanımda dil dosyalarını indirir. İnternet bağlantınızı kontrol edin.

### Module Not Found Hataları

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

## 📱 Tarayıcı Desteği

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Destek

Sorun yaşarsanız:
1. `backend/` ve `frontend/` klasörlerindeki `node_modules` klasörlerini silin
2. `npm install` komutunu tekrar çalıştırın
3. Browser cache'ini temizleyin
4. Portların kullanılmadığından emin olun

## 🎓 Demo Hesaplar

**Admin Paneli:**
- Kullanıcı: `admin`
- Şifre: `admin123`

---

**Notlar:**
- Local development için `http://localhost` kullanın (http**s** değil)
- Production'da CORS ayarlarını düzenleyin
- API Key'leri güvenli bir şekilde saklayın
