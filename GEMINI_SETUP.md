# 🔑 Gemini API Key - Netlify Environment Variables Kurulumu

## Problem:
- LocalStorage cihaza özel (telefon ≠ bilgisayar)
- Her cihazda ayrı ayrı girmek zor
- Kullanıcılar için API key paylaşımı gerekiyor

## Çözüm: Netlify Environment Variables

### ADIM 1: Netlify Dashboard'a Git
```
https://app.netlify.com/sites/fizik-problem-solver/settings/deploys#environment
```

### ADIM 2: Environment Variable Ekle

**Site Settings** → **Environment variables** → **Add a variable**

```
Key: VITE_GEMINI_API_KEY
Value: AIzaSyCKR2ş0pOKYDoM4sYlRxTJUiV9aAjqrTBQ
```

⚠️ **ÖNEMLİ:** Key'in başında `VITE_` olmalı (Vite projeleri için gerekli)

### ADIM 3: Yeniden Deploy Et

```bash
netlify deploy --prod
```

### ADIM 4: Kod Değişikliği Gerekli

Şu anda kod LocalStorage'dan okuyor. Environment variable'dan okumak için:

```javascript
// Önce .env variable'ı kontrol et, yoksa localStorage'a bak
const envKey = import.meta.env.VITE_GEMINI_API_KEY;
const localKey = localStorage.getItem('gemini_api_key');

const apiKey = localKey || envKey;
```

## Avantajlar:
✅ Tüm cihazlarda otomatik çalışır
✅ Kullanıcılar ayrı ayrı girmez
✅ Merkezi yönetim
✅ Güvenli (kodda görünmez)

## Dezavantajlar:
⚠️ Tüm kullanıcılar aynı limiti paylaşır (1500/gün)
⚠️ Netlify deploy gerektirir

## Uygulayalım mı?
Evet dersen kodları değiştirip deploy ederim!
