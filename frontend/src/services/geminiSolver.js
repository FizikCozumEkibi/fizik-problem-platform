// GEMINI API - Direkt Frontend'den (Netlify Functions KULLANMADAN)
import axios from 'axios';

// GÜVENLİK: API key ASLA kodda saklanmaz
const STORAGE_KEY = 'gemini_api_key';
const ADMIN_KEY_STORAGE = 'admin_gemini_key'; // Admin'in global key'i

export const setGeminiApiKey = (apiKey) => {
  localStorage.setItem(STORAGE_KEY, apiKey);
};

// Admin için global key ayarla (tüm kullanıcılar için)
export const setAdminGeminiApiKey = (apiKey) => {
  localStorage.setItem(ADMIN_KEY_STORAGE, apiKey);
};

export const getAdminGeminiApiKey = () => {
  return localStorage.getItem(ADMIN_KEY_STORAGE) || null;
};

export const getGeminiApiKey = () => {
  // 1. Önce kullanıcının kendi key'ine bak
  const userKey = localStorage.getItem(STORAGE_KEY);
  if (userKey) {
    console.log('🔑 User API key kullanılıyor');
    return userKey;
  }
  
  // 2. Yoksa admin'in global key'ine bak
  const adminKey = localStorage.getItem(ADMIN_KEY_STORAGE);
  if (adminKey) {
    console.log('🔑 Admin API key kullanılıyor');
    return adminKey;
  }
  
  // 3. Environment variable'dan al (Netlify'da ayarlanmışsa)
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) {
    console.log('🔑 Environment API key kullanılıyor');
    return envKey;
  }
  
  // 4. Default key yok - kullanıcı ayarlardan girmeli
  console.log('❌ API key bulunamadı');
  return null;
};

export const hasGeminiApiKey = () => {
  return !!getGeminiApiKey();
};

// DETAYLI PROBLEM ÇÖZÜMÜ
export const solvePhysicsProblem = async (problem, level = 'TYT') => {
  const apiKey = getGeminiApiKey();
  
  console.log('🔑 API Key durumu:', apiKey ? 'Var ✅' : 'Yok ❌');
  console.log('🔑 API Key uzunluğu:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.log('⚠️ API key bulunamadı, basit çözüm yapılıyor');
    // API key yoksa basit çözüm yap
    return solveLocally(problem, level);
  }
  
  console.log('✅ API key bulundu, Gemini API kullanılıyor');
  
  try {
    console.log('🚀 Gemini API çağrısı başlatılıyor...');
    console.log('📝 Problem:', problem.substring(0, 50) + '...');
    console.log('🔑 API Key var mı:', !!apiKey);
    console.log('🔑 API Key uzunluk:', apiKey?.length);
    
    const prompt = `Sen bir fizik öğretmenisin. Aşağıdaki ${level} seviyesindeki fizik problemini DETAYLI ve AÇIKLAYICI şekilde çöz.

Problem: ${problem}

ÖNEMLİ KURALLAR:
1. Her adımı DETAYLI açıkla
2. Formülleri AÇIK yaz (örn: F = m × a)
3. Sayıları formüle YERLEŞTIR
4. HESAPLA ve sonucu yaz
5. Eğer çoktan seçmeli ise hangi şıkkın doğru olduğunu BUL
6. Açıklaman öğretici olsun, sadece formül yazma

Çözümü şu formatta JSON olarak ver:
{
  "topic": "Konu adı (Dinamik, Kinematik, vb)",
  "level": "${level}",
  "steps": [
    {
      "number": 1,
      "title": "Adım Başlığı",
      "content": "DETAYLI açıklama ve hesaplama",
      "type": "analysis"
    }
  ],
  "formulas": [
    {
      "name": "Formül Adı",
      "formula": "Matematiksel ifade",
      "description": "Formülün açıklaması"
    }
  ],
  "explanation": "Genel açıklama",
  "result": "SONUÇ ve hangi şık (varsa)",
  "relatedTopics": ["İlgili konular"]
}

SADECE JSON döndür, başka açıklama yapma.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        }
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;
    
    // JSON parse
    const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/) || aiText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiText;
    const solution = JSON.parse(jsonText);
    
    solution.usedAI = true;
    solution.aiModel = 'Gemini Pro';
    
    console.log('✅ Gemini API başarılı! Çözüm alındı');
    return solution;
    
  } catch (error) {
    console.error('❌ Gemini API HATASI:', error.message);
    console.error('Hata kodu:', error.response?.status);
    console.error('Hata detayı:', error.response?.data || error);
    
    if (error.response?.status === 400) {
      console.error('⚠️ API Key geçersiz olabilir!');
    }
    
    // Hata olursa basit çözüm yap
    console.log('↩️ Basit çözüme geçiliyor...');
    return solveLocally(problem, level);
  }
};

// BASIT LOCAL ÇÖZÜM (Gemini yoksa)
function solveLocally(problem, level) {
  const topic = detectPhysicsTopic(problem);
  
  // Sayıları çıkar
  const numbers = problem.match(/\d+[.,]?\d*/g) || [];
  const hasNumbers = numbers.length > 0;
  
  let steps = [];
  let result = '';
  let formulas = [];
  
  // DİNAMİK PROBLEMLER
  if (topic === 'Dinamik') {
    formulas.push({
      name: 'Newton 2. Kanunu',
      formula: 'F = m × a',
      description: 'Kuvvet = Kütle × İvme'
    });
    
    if (hasNumbers && numbers.length >= 2) {
      // F = m × a hesaplama
      const num1 = parseFloat(numbers[0]);
      const num2 = parseFloat(numbers[1]);
      
      if (problem.toLowerCase().includes('ivme')) {
        const a = (num1 / num2).toFixed(2);
        steps = [
          {
            number: 1,
            title: 'Verilenler',
            content: `Kuvvet (F) = ${num1} N\nKütle (m) = ${num2} kg`,
            type: 'analysis'
          },
          {
            number: 2,
            title: 'Formül',
            content: 'F = m × a formülünü kullanacağız',
            type: 'formula'
          },
          {
            number: 3,
            title: 'Hesaplama',
            content: `${num1} = ${num2} × a\na = ${num1} ÷ ${num2}\na = ${a} m/s²`,
            type: 'calculation'
          },
          {
            number: 4,
            title: 'Sonuç',
            content: `Cismin ivmesi ${a} m/s²'dir`,
            type: 'result'
          }
        ];
        result = `İvme: ${a} m/s²`;
      } else if (problem.toLowerCase().includes('kuvvet')) {
        const F = (num1 * num2).toFixed(2);
        steps = [
          {
            number: 1,
            title: 'Verilenler',
            content: `Kütle (m) = ${num1} kg\nİvme (a) = ${num2} m/s²`,
            type: 'analysis'
          },
          {
            number: 2,
            title: 'Hesaplama',
            content: `F = m × a\nF = ${num1} × ${num2}\nF = ${F} N`,
            type: 'calculation'
          },
          {
            number: 3,
            title: 'Sonuç',
            content: `Kuvvet ${F} Newton'dur`,
            type: 'result'
          }
        ];
        result = `Kuvvet: ${F} N`;
      }
    }
  }
  
  // KİNEMATİK PROBLEMLER
  else if (topic === 'Kinematik') {
    formulas.push({
      name: 'Düzgün Hızlı Hareket',
      formula: 'x = v × t',
      description: 'Yol = Hız × Zaman'
    });
    
    if (hasNumbers && numbers.length >= 2) {
      const v = parseFloat(numbers[0]);
      const t = parseFloat(numbers[1]);
      const x = (v * t).toFixed(2);
      
      steps = [
        {
          number: 1,
          title: 'Verilenler',
          content: `Hız (v) = ${v} m/s\nZaman (t) = ${t} saniye`,
          type: 'analysis'
        },
        {
          number: 2,
          title: 'Formül ve Hesaplama',
          content: `x = v × t\nx = ${v} × ${t}\nx = ${x} metre`,
          type: 'calculation'
        },
        {
          number: 3,
          title: 'Sonuç',
          content: `Alınan yol ${x} metredir`,
          type: 'result'
        }
      ];
      result = `Yol: ${x} m`;
    }
  }
  
  // ENERJİ PROBLEMLER
  else if (topic === 'Enerji') {
    formulas.push({
      name: 'Kinetik Enerji',
      formula: 'Ek = (1/2) × m × v²',
      description: 'Kinetik Enerji = Yarım × Kütle × Hız Karesi'
    });
    
    if (hasNumbers && numbers.length >= 2) {
      const m = parseFloat(numbers[0]);
      const v = parseFloat(numbers[1]);
      const Ek = (0.5 * m * v * v).toFixed(2);
      
      steps = [
        {
          number: 1,
          title: 'Verilenler',
          content: `Kütle (m) = ${m} kg\nHız (v) = ${v} m/s`,
          type: 'analysis'
        },
        {
          number: 2,
          title: 'Hesaplama',
          content: `Ek = (1/2) × m × v²\nEk = 0.5 × ${m} × ${v}²\nEk = 0.5 × ${m} × ${v * v}\nEk = ${Ek} Joule`,
          type: 'calculation'
        },
        {
          number: 3,
          title: 'Sonuç',
          content: `Kinetik enerji ${Ek} Joule'dür`,
          type: 'result'
        }
      ];
      result = `Ek: ${Ek} J`;
    }
  }
  
  // Varsayılan
  if (steps.length === 0) {
    steps = [
      {
        number: 1,
        title: 'Problemin Analizi',
        content: `Bu bir ${topic} problemidir. ${hasNumbers ? 'Sayısal değerler: ' + numbers.join(', ') : 'Daha detaylı çözüm için Gemini API anahtarı ekleyin.'}`,
        type: 'analysis'
      },
      {
        number: 2,
        title: 'Çözüm İçin',
        content: 'Daha detaylı ve açıklayıcı çözüm için Gemini API anahtarınızı ayarlara ekleyin.',
        type: 'info'
      }
    ];
    result = 'Detaylı çözüm için Gemini API gerekli';
  }
  
  return {
    topic,
    level,
    steps,
    formulas,
    explanation: `${level} seviyesi ${topic} konusu. ${hasNumbers ? 'Basit hesaplama yapıldı.' : 'Gemini API ile daha detaylı çözüm alabilirsiniz.'}`,
    result,
    relatedTopics: [topic],
    usedAI: false,
    note: 'Daha detaylı çözüm için Gemini API anahtarı ekleyin (Ayarlar bölümünden)'
  };
}

// Konu tespiti
function detectPhysicsTopic(problem) {
  const keywords = {
    'Kinematik': ['hız', 'ivme', 'konum', 'zaman', 'hareket', 'yol', 'sürat'],
    'Dinamik': ['kuvvet', 'newton', 'sürtünme', 'ağırlık', 'kütle'],
    'Enerji': ['enerji', 'iş', 'güç', 'potansiyel', 'kinetik'],
    'Elektrik': ['akım', 'voltaj', 'direnç', 'ohm', 'devre'],
    'Manyetizma': ['manyetik', 'alan', 'akı', 'bobin'],
    'Optik': ['ışık', 'lens', 'ayna', 'kırılma', 'yansıma'],
    'Dalgalar': ['dalga', 'frekans', 'periyot', 'ses'],
    'Basınç': ['basınç', 'sıvı', 'katı', 'pascal', 'yoğunluk']
  };

  for (const [topic, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (problem.toLowerCase().includes(word)) {
        return topic;
      }
    }
  }
  return 'Genel Fizik';
}

// Gemini API Key ücretsiz alma rehberi
export const getGeminiApiKeyGuide = () => {
  return {
    title: 'Ücretsiz Gemini API Anahtarı Nasıl Alınır?',
    steps: [
      '1. https://makersuite.google.com/app/apikey adresine gidin',
      '2. Google hesabınızla giriş yapın',
      '3. "Get API Key" butonuna tıklayın',
      '4. "Create API key in new project" seçin',
      '5. API anahtarınızı kopyalayın',
      '6. Ayarlar bölümünden yapıştırın'
    ],
    note: 'Gemini API ücretsiz planda günlük 1500 istek limiti vardır (dakikada 60 istek).',
    security: '⚠️ API anahtarınızı kimseyle paylaşmayın! Sadece kendi tarayıcınızda saklayın.'
  };
};
