import NodeCache from 'node-cache';
import axios from 'axios';
import crypto from 'crypto';

// Cache setup (1 hour TTL)
const cache = new NodeCache({ stdTTL: 3600 });

class AIService {
  constructor() {
    this.useLocalModel = process.env.USE_LOCAL_MODEL === 'true';
    this.enableCache = process.env.ENABLE_CACHE === 'true';
    this.apiKeys = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      google: process.env.GOOGLE_AI_KEY
    };
  }

  // Generate cache key
  generateCacheKey(problem, level) {
    const data = `${problem}-${level}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  // Check cache
  getCachedSolution(problem, level) {
    if (!this.enableCache) return null;
    const key = this.generateCacheKey(problem, level);
    return cache.get(key);
  }

  // Save to cache
  cacheSolution(problem, level, solution) {
    if (!this.enableCache) return;
    const key = this.generateCacheKey(problem, level);
    cache.set(key, solution);
  }

  // Local physics solver (rule-based + pattern matching)
  async solveWithLocalModel(problem, level) {
    console.log('🤖 Using local physics solver...');
    
    // Detect physics topic
    const topic = this.detectPhysicsTopic(problem);
    
    // Generate solution based on topic
    const solution = this.generatePhysicsSolution(problem, topic, level);
    
    return solution;
  }

  // Detect physics topic from problem text
  detectPhysicsTopic(problem) {
    const keywords = {
      'Kinematik': ['hız', 'ivme', 'konum', 'zaman', 'hareket', 'yol', 'sürat'],
      'Dinamik': ['kuvvet', 'newton', 'sürtünme', 'ağırlık', 'kütle', 'net kuvvet'],
      'Enerji': ['enerji', 'iş', 'güç', 'potansiyel', 'kinetik', 'korunum'],
      'Elektrik': ['akım', 'voltaj', 'direnç', 'ohm', 'devre', 'ampermetre', 'voltmetre'],
      'Manyetizma': ['manyetik', 'alan', 'akı', 'bobin', 'indüksiyon'],
      'Optik': ['ışık', 'lens', 'ayna', 'kırılma', 'yansıma', 'görüntü'],
      'Dalgalar': ['dalga', 'frekans', 'periyot', 'amplitude', 'ses'],
      'Basınç': ['basınç', 'sıvı', 'katı', 'pascal', 'yoğunluk', 'hidrostatik'],
      'Termodinamik': ['ısı', 'sıcaklık', 'genleşme', 'hal değişimi', 'iç enerji']
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

  // Generate physics solution
  generatePhysicsSolution(problem, topic, level) {
    const solution = {
      topic: topic,
      level: level,
      steps: [],
      formulas: [],
      explanation: '',
      result: '',
      relatedTopics: []
    };

    // Example solution structure for Kinematik
    if (topic === 'Kinematik') {
      solution.steps = [
        {
          number: 1,
          title: 'Verilenleri Yazalım',
          content: 'Problemde verilen büyüklükleri listeleyelim ve birimlerini kontrol edelim.',
          type: 'analysis'
        },
        {
          number: 2,
          title: 'Hareket Türünü Belirleyelim',
          content: 'Düzgün hızlı mı, düzgün değişken hızlı mı yoksa serbest düşme mi?',
          type: 'identification'
        },
        {
          number: 3,
          title: 'Uygun Formülü Seçelim',
          content: 'Hareket türüne göre kinematik denklemlerden uygun olanı seçelim.',
          type: 'formula'
        },
        {
          number: 4,
          title: 'Hesaplama Yapalım',
          content: 'Değerleri formülde yerine koyarak sonucu bulalım.',
          type: 'calculation'
        },
        {
          number: 5,
          title: 'Sonucu Yorumlayalım',
          content: 'Bulunan sonucun fiziksel anlamını ve birimini kontrol edelim.',
          type: 'verification'
        }
      ];

      solution.formulas = [
        { name: 'Düzgün Hızlı Hareket', formula: 'x = v × t', description: 'Konum = Hız × Zaman' },
        { name: 'Düzgün Değişken Hızlı Hareket', formula: 'v = v₀ + a × t', description: 'Son Hız = İlk Hız + İvme × Zaman' },
        { name: 'Hareket Denklemi', formula: 'x = v₀ × t + ½ × a × t²', description: 'Yol formülü' }
      ];

      solution.explanation = `Bu problem ${topic} konusuna aittir. ${level} seviyesinde çözülecektir.`;
      solution.result = 'Adım adım çözüm için yukarıdaki adımları takip edin.';
      solution.relatedTopics = ['Dinamik', 'Enerji', 'Vektörler'];
    } else {
      // Generic solution for other topics
      solution.steps = [
        {
          number: 1,
          title: 'Problemi Anlama',
          content: `${topic} konusuna ait bu problemde verilenleri ve isteneni belirleyelim.`,
          type: 'analysis'
        },
        {
          number: 2,
          title: 'Fiziksel İlkeleri Belirleme',
          content: `${topic} ile ilgili hangi fiziksel yasaları kullanacağımızı tespit edelim.`,
          type: 'identification'
        },
        {
          number: 3,
          title: 'Çözüm Stratejisi',
          content: 'Problemi çözmek için adım adım bir plan oluşturalım.',
          type: 'strategy'
        },
        {
          number: 4,
          title: 'Çözüm',
          content: 'Formülleri uygulayarak sonuca ulaşalım.',
          type: 'calculation'
        }
      ];

      solution.explanation = `Bu ${topic} konusuna ait bir ${level} problemidir.`;
      solution.result = 'Detaylı çözüm için adımları inceleyin.';
    }

    return solution;
  }

  // Solve physics problem (main method)
  async solve(problem, level = 'TYT', imageData = null) {
    try {
      // Check cache first
      const cached = this.getCachedSolution(problem, level);
      if (cached) {
        console.log('✅ Solution found in cache');
        return { ...cached, fromCache: true };
      }

      let solution;

      // Try local model first
      if (this.useLocalModel) {
        solution = await this.solveWithLocalModel(problem, level);
      } else {
        // Try API with fallback
        solution = await this.solveWithAPI(problem, level);
      }

      // Cache the solution
      this.cacheSolution(problem, level, solution);

      return { ...solution, fromCache: false };
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
      
      // Fallback to local model if API fails
      if (!this.useLocalModel) {
        console.log('🔄 Falling back to local model...');
        const solution = await this.solveWithLocalModel(problem, level);
        this.cacheSolution(problem, level, solution);
        return { ...solution, fromCache: false, fallback: true };
      }
      
      throw error;
    }
  }

  // API-based solver (with fallback)
  async solveWithAPI(problem, level) {
    console.log('🌐 Attempting to use API...');
    
    // Try available APIs in order
    if (this.apiKeys.openai) {
      return await this.solveWithOpenAI(problem, level);
    } else if (this.apiKeys.anthropic) {
      return await this.solveWithAnthropic(problem, level);
    } else if (this.apiKeys.google) {
      return await this.solveWithGoogle(problem, level);
    }
    
    // No API available, use local
    console.log('⚠️ No API keys available, using local model');
    return await this.solveWithLocalModel(problem, level);
  }

  // OpenAI solver (placeholder)
  async solveWithOpenAI(problem, level) {
    // Implementation would go here
    throw new Error('OpenAI API not configured');
  }

  // Anthropic solver (placeholder)
  async solveWithAnthropic(problem, level) {
    // Implementation would go here
    throw new Error('Anthropic API not configured');
  }

  // Google Gemini solver (FULL IMPLEMENTATION)
  async solveWithGoogle(problem, level) {
    console.log('🌟 Using Google Gemini AI...');
    
    const apiKey = this.apiKeys.google;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    const prompt = `Sen bir fizik öğretmenisin. Aşağıdaki ${level} seviyesindeki fizik problemini adım adım çöz.

Problem: ${problem}

Çözümü şu formatta JSON olarak ver:
{
  "topic": "Konu adı (örn: Kinematik, Dinamik, Elektrik)",
  "level": "${level}",
  "steps": [
    {
      "number": 1,
      "title": "Adım başlığı",
      "content": "Adım açıklaması",
      "type": "analysis/identification/formula/calculation/verification"
    }
  ],
  "formulas": [
    {
      "name": "Formül adı",
      "formula": "Formül gösterimi",
      "description": "Formül açıklaması"
    }
  ],
  "explanation": "Genel açıklama",
  "result": "Nihai sonuç ve yorumu",
  "relatedTopics": ["İlgili konu 1", "İlgili konu 2"]
}

ÖNEMLİ: 
- Türkçe yaz
- Adım adım detaylı açıkla
- Formülleri açıkça göster
- Birim analizleri yap
- Fiziksel yorumları ekle
- Sadece JSON formatında cevap ver, başka metin ekleme`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from response
      let solution;
      try {
        // Remove markdown code blocks if present
        const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/) || aiText.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiText;
        solution = JSON.parse(jsonText);
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, converting to structured format');
        // Fallback: convert text to structured format
        solution = this.convertTextToSolution(aiText, problem, level);
      }

      console.log('✅ Google Gemini solution generated successfully');
      return solution;

    } catch (error) {
      console.error('❌ Google Gemini API Error:', error.response?.data || error.message);
      
      // Check if it's a quota/billing error
      if (error.response?.status === 429) {
        console.warn('⚠️ API rate limit reached, falling back to local solver');
      } else if (error.response?.status === 403) {
        console.warn('⚠️ API key invalid or billing issue, falling back to local solver');
      }
      
      throw error;
    }
  }

  // Convert plain text AI response to structured solution
  convertTextToSolution(text, problem, level) {
    const topic = this.detectPhysicsTopic(problem);
    
    // Split text into logical sections
    const lines = text.split('\n').filter(line => line.trim());
    
    const steps = [];
    let stepNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 10) { // Skip very short lines
        steps.push({
          number: stepNumber++,
          title: `Adım ${stepNumber - 1}`,
          content: line,
          type: stepNumber <= 2 ? 'analysis' : stepNumber <= 4 ? 'calculation' : 'verification'
        });
      }
    }

    return {
      topic: topic,
      level: level,
      steps: steps.slice(0, 6), // Limit to 6 steps
      formulas: [],
      explanation: `Google Gemini AI tarafından çözülen ${topic} problemi.`,
      result: steps[steps.length - 1]?.content || 'Çözüm tamamlandı.',
      relatedTopics: []
    };
  }
}

export default new AIService();
