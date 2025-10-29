<<<<<<< HEAD
# 🔬 Fizik Problem Çözücü Web Platformu

TYT-AYT fizik problemlerini yapay zeka destekli olarak çözen, sesli anlatım ve video eğitim içerikleriyle zenginleştirilmiş kapsamlı bir eğitim platformu.

## 🎯 Özellikler

### Temel Özellikler
- ✍️ **Metin ve Fotoğraf ile Problem Girişi**: OCR teknolojisi ile fotoğraftan problem okuma
- 🤖 **AI Destekli Çözüm**: Hybrid AI yaklaşımı (API + local models)
- 📚 **Adım Adım Çözüm**: Detaylı fizik çözümleri ve formül açıklamaları
- 🔊 **Sesli Anlatım**: Türkçe TTS desteği
- 🎥 **Video Kütüphanesi**: Konu anlatımlı eğitim videoları
- 📊 **Admin Paneli**: Kullanıcı ve içerik yönetimi

### Fizik Konu Kapsamı (TYT-AYT)
- Mekanik (Kinematik, Dinamik, Enerji)
- Elektrik ve Manyetizma
- Dalgalar ve Optik
- Modern Fizik
- Termodinamik
- Basınç (Katı ve Sıvı)

## 🛠️ Teknoloji Stack

### Frontend
- React 18 + Vite
- TailwindCSS + shadcn/ui
- Lucide Icons
- Axios
- React Router
- Tesseract.js (OCR)

### Backend
- Node.js + Express
- CORS & Helmet (güvenlik)
- Multer (dosya yükleme)
- Hybrid AI sistem:
  - API rotasyonu (opsiyonel)
  - Local LLM desteği (LLAMA/Mistral)
  - Cache sistemi

## 🚀 Kurulum

### Frontend Kurulum
```bash
cd frontend
npm install
npm run dev
```

### Backend Kurulum
```bash
cd backend
npm install
npm start
```

## 🔑 API Key Yönetimi

Platform, API Key olmadan da çalışabilir:
1. **Ücretsiz API Rotasyonu**: Birden fazla ücretsiz API kullanımı
2. **Self-Hosted Model**: Açık kaynak modeller (LLAMA, Mistral)
3. **Cache Sistemi**: Önceki çözümleri önbellekleme
4. **Hybrid Yaklaşım**: API + Local model kombinasyonu

API Key varsa `.env` dosyasına ekleyin:
```env
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## 📱 Responsive Tasarım

Platform tüm cihazlarda sorunsuz çalışır:
- Masaüstü (1920x1080+)
- Tablet (768px+)
- Mobil (320px+)

## 🎓 Kullanım

1. Ana sayfada problem giriş yöntemini seçin (metin/fotoğraf)
2. TYT/AYT seviyesini belirleyin
3. Fizik probleminizi girin veya yükleyin
4. Adım adım çözümü inceleyin
5. Sesli anlatım ile dinleyin
6. Konu videolarını izleyin

## 📊 Admin Paneli

Admin paneline `/admin` adresinden erişilebilir:
- Kullanıcı yönetimi
- İçerik düzenleme
- Video kütüphanesi yönetimi
- İstatistikler ve raporlar

## 🔒 Güvenlik

- CORS yapılandırması
- Helmet.js güvenlik başlıkları
- Input validasyonu
- Rate limiting
- Dosya boyutu sınırlaması

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

---

**Geliştirici Notu**: Platform, API Key olmadan da çalışabilir. Otomatik fallback mekanizması sayesinde en uygun çözüm yöntemini seçer.
=======
# fizik-problem-platform
>>>>>>> c0c7e3619fe4eb5e5bf7ff16ab504a8941f5672c
