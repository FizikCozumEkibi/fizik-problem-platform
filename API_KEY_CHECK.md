# 🔑 API KEY KONTROLÜ

## SORUN: API Key'de Türkçe Karakter

Daha önce verdiğiniz key:
```
AIzaSyCKR2ş0pOKYDoM4sYlRxTJUiV9aAjqrTBQ
           ↑
        "ş" karakteri var!
```

## Gemini API Key Formatı:
```
Doğru format: AIzaSy... (sadece İngilizce harfler, rakamlar, tire, alt çizgi)
Uzunluk: Genelde 39 karakter
Örnek: AIzaSyDXZr4v...
```

## ✅ ÇÖZÜM:

### 1. API Key'inizi Kontrol Edin:
```
https://makersuite.google.com/app/apikey

→ API key'inizi kopyalayın
→ CTRL+C ile kopyalayın (sağ tıklayıp yapıştırmayın)
→ Not defterine yapıştırın
→ Türkçe karakter var mı kontrol edin
```

### 2. Doğru API Key'i Buraya Yapıştırın:

Lütfen API key'inizi buraya yapıştırın, kontrol edelim:

```
[API KEY'İNİZİ BURAYA YAPIŞTIRIN]
```

### 3. Veya Netlify Environment Variables Kullanalım:

Eğer API key'inizi paylaşmak istemiyorsanız:

1. Netlify Dashboard'a gidin:
   https://app.netlify.com/sites/fizik-problem-solver/settings/deploys#environment

2. Environment variable ekleyin:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: [Gemini API key'iniz]

3. Deploy edin - otomatik çalışacak

## Hangi Yöntemi Tercih Ediyorsunuz?

A) API key'i buraya yapıştırıyorum → Doğruluğunu kontrol edin
B) Netlify Environment Variables kullanacağım → Size adımları anlat
C) Her kullanıcı kendi key'ini girsin → Şu anki sistem devam etsin
