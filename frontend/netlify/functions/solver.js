// Netlify Serverless Function - Problem Solver
const axios = require('axios');
const NodeCache = require('node-cache');
const crypto = require('crypto');

// Cache setup (24 hour TTL) - Netlify kredi tasarrufu için uzatıldı
const cache = new NodeCache({ stdTTL: 86400 });

// Rate limiting tracker (günlük istek sayısı)
const rateLimiter = {
  count: 0,
  date: new Date().toDateString(),
  maxDaily: 1400, // 1500 limitin altında güvenli limit

  check() {
    const today = new Date().toDateString();
    if (this.date !== today) {
      this.count = 0;
      this.date = today;
    }
    return this.count < this.maxDaily;
  },

  increment() {
    this.count++;
  },

  remaining() {
    return this.maxDaily - this.count;
  }
};

// Generate cache key
function generateCacheKey(problem, level) {
  const data = `${problem}-${level}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

// Detect physics topic
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

// Local solver fallback - DAHA AKILLI
function solveWithLocalModel(problem, level) {
  const topic = detectPhysicsTopic(problem);
  
  // Problemden sayıları çıkar
  const numbers = problem.match(/\d+[.,]?\d*/g) || [];
  const hasNumbers = numbers.length > 0;
  
  // Basit hesaplama örneği
  let calculation = '';
  let result = '';
  
  if (hasNumbers && topic === 'Dinamik' && problem.includes('kuvvet') && problem.includes('ivme')) {
    // F = m × a örneği
    if (numbers.length >= 2) {
      const F = parseFloat(numbers[0]);
      const m = parseFloat(numbers[1]);
      const a = (F / m).toFixed(2);
      calculation = `${F} = ${m} × a ise a = ${F}/${m} = ${a} m/s²`;
      result = `İvme ${a} m/s²'dir`;
    }
  } else if (hasNumbers && topic === 'Kinematik' && problem.includes('hız') && problem.includes('zaman')) {
    // x = v × t örneği
    if (numbers.length >= 2) {
      const v = parseFloat(numbers[0]);
      const t = parseFloat(numbers[1]);
      const x = (v * t).toFixed(2);
      calculation = `x = ${v} × ${t} = ${x} metre`;
      result = `Alınan yol ${x} metredir`;
    }
  }
  
  return {
    topic: topic,
    level: level,
    steps: [
      {
        number: 1,
        title: 'Problemin Analizi',
        content: `Bu bir ${topic} problemidir. ${hasNumbers ? 'Problemde ' + numbers.join(', ') + ' değerleri veriliyor.' : 'Sayısal değerler belirleyin.'}`,
        type: 'analysis'
      },
      {
        number: 2,
        title: 'Formül ve Hesaplama',
        content: calculation || `${topic} formüllerini kullanarak problemi çözebilirsiniz. Formül kütüphanesine bakın.`,
        type: 'calculation'
      },
      {
        number: 3,
        title: 'Sonuç',
        content: result || 'Detaylı çözüm için Gemini AI kullanılması önerilir (API anahtarı gerekli).',
        type: 'result'
      }
    ],
    formulas: [],
    explanation: `${level} seviyesinde ${topic} konusu. ${hasNumbers ? 'Basit hesaplama yapıldı.' : 'Gemini AI ile daha detaylı çözüm alabilirsiniz.'}`,
    result: result || 'Detaylı çözüm için problem metnini daha net yazın veya Gemini API aktif olmalı.',
    relatedTopics: [topic],
    usedAI: false,
    note: 'Bu basit bir yerel çözümdür. Daha detaylı analiz için Gemini AI kullanılmalıdır.'
  };
}

// Google Gemini AI solver
async function solveWithGemini(problem, level, apiKey) {
  const prompt = `Sen bir fizik öğretmenisin. Aşağıdaki ${level} seviyesindeki fizik problemini GERÇEK SAYILARLA ve DETAYLI HESAPLAMALARLA adım adım çöz.

Problem: ${problem}

ÖNEMLİ: 
- Sadece "Verilenleri yazalım" gibi genel ifadeler YAZMA
- Her adımda GERÇEK SAYILARLA hesaplama YAP
- Formüllere değerleri YERİNE KOY
- Sonucu HESAPLA ve BİRİMİYLE YAZ
- Eğer çoktan seçmeli ise hangi şıkkın doğru olduğunu BUL

Çözümü şu formatta JSON olarak ver:
{
  "topic": "Konu adı (örn: Dinamik, Kinematik)",
  "level": "${level}",
  "steps": [
    {
      "number": 1, 
      "title": "Verilenleri Yazalım", 
      "content": "m = 5 kg, F = 20 N gibi GERÇEK DEĞERLER", 
      "type": "analysis"
    },
    {
      "number": 2,
      "title": "Formül Seçimi",
      "content": "F = m × a formülünü kullanacağız",
      "type": "formula"
    },
    {
      "number": 3,
      "title": "Hesaplama",
      "content": "20 = 5 × a ise a = 20/5 = 4 m/s² gibi DETAYLI HESAPLAMA",
      "type": "calculation"
    },
    {
      "number": 4,
      "title": "Sonuç",
      "content": "İvme 4 m/s²'dir. Cevap: X şıkkı",
      "type": "result"
    }
  ],
  "formulas": [{"name": "Newton 2. Kanunu", "formula": "F = m × a", "description": "Kuvvet = Kütle × İvme"}],
  "explanation": "Problemi nasıl çözdüğümüzün özeti",
  "result": "SAYISAL SONUÇ VE ŞIKKI (varsa)",
  "relatedTopics": ["İlgili konular"]
}

Türkçe, detaylı, GERÇEK HESAPLAMALARLA. Sadece JSON ver.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      },
      { timeout: 30000 }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;
    
    // Parse JSON
    const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/) || aiText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiText;
    const solution = JSON.parse(jsonText);
    
    solution.usedAI = true;
    solution.aiModel = 'Gemini Pro';
    return solution;
    
  } catch (error) {
    console.error('Gemini error:', error.message);
    throw error;
  }
}

// Main handler
exports.handler = async function(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { problem, level = 'TYT' } = JSON.parse(event.body);

    if (!problem) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Problem metni gerekli' })
      };
    }

    // Check cache
    const cacheKey = generateCacheKey(problem, level);
    const cached = cache.get(cacheKey);
    if (cached) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          solution: { ...cached, fromCache: true }
        })
      };
    }

    let solution;
    const apiKey = process.env.GOOGLE_AI_KEY;

    // Try Gemini if API key exists and rate limit OK
    if (apiKey && rateLimiter.check()) {
      try {
        solution = await solveWithGemini(problem, level, apiKey);
        rateLimiter.increment();
        console.log(`✅ Gemini used. Remaining today: ${rateLimiter.remaining()}`);
      } catch (error) {
        console.warn('Gemini failed, using local solver');
        solution = solveWithLocalModel(problem, level);
      }
    } else {
      // No API key or rate limit reached
      if (apiKey && !rateLimiter.check()) {
        console.warn(`⚠️ Daily rate limit reached (${rateLimiter.count}/${rateLimiter.maxDaily})`);
      }
      solution = solveWithLocalModel(problem, level);
    }

    // Cache solution
    cache.set(cacheKey, solution);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        solution,
        rateLimit: {
          used: rateLimiter.count,
          limit: rateLimiter.maxDaily,
          remaining: rateLimiter.remaining()
        }
      })
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Çözüm oluşturulurken hata',
        message: error.message
      })
    };
  }
}
