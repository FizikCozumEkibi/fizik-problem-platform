// Netlify Serverless Function - Formula Library

const formulasData = [
  {
    topic: 'Kinematik',
    category: 'TYT-AYT',
    formulas: [
      {
        id: 'k1',
        name: 'Düzgün Hızlı Hareket - Yol Formülü',
        formula: 'Yol = Hız × Zaman',
        mathFormula: 'x = v · t',
        description: 'Sabit hızla hareket eden cismin aldığı yol, hız ile zamanın çarpımına eşittir',
        difficulty: 'TYT',
        explanation: 'x: Alınan yol (metre), v: Hız (metre/saniye), t: Geçen zaman (saniye)',
        units: { x: 'metre (m)', v: 'm/s', t: 'saniye (s)' }
      },
      {
        id: 'k2',
        name: 'İvme Formülü',
        formula: 'İvme = (Son Hız - İlk Hız) bölü Zaman',
        mathFormula: 'a = (v - v₀) / t',
        description: 'Hızdaki değişimin zamana oranı ivmeyi verir',
        difficulty: 'TYT',
        explanation: 'a: İvme (m/s²), v: Son hız (m/s), v₀: İlk hız (m/s), t: Zaman (s)',
        units: { a: 'm/s²', v: 'm/s', v0: 'm/s', t: 's' }
      },
      {
        id: 'k3',
        name: 'İvmeli Hareket - Yol Formülü',
        formula: 'Yol = (İlk Hız × Zaman) + (Yarım × İvme × Zaman²)',
        mathFormula: 'x = v₀·t + ½·a·t²',
        description: 'Düzgün değişen hareketli cismin aldığı yol',
        difficulty: 'AYT',
        explanation: 'x: Yol (m), v₀: İlk hız (m/s), a: İvme (m/s²), t: Zaman (s)',
        units: { x: 'm', v0: 'm/s', a: 'm/s²', t: 's' }
      },
      {
        id: 'k4',
        name: 'Hız-Zaman İlişkisi',
        formula: 'Son Hız = İlk Hız + (İvme × Zaman)',
        mathFormula: 'v = v₀ + a·t',
        description: 'İvmeli harekette herhangi bir andaki hız',
        difficulty: 'TYT',
        explanation: 'v: Son hız (m/s), v₀: İlk hız (m/s), a: İvme (m/s²), t: Zaman (s)',
        units: { v: 'm/s', v0: 'm/s', a: 'm/s²', t: 's' }
      }
    ]
  },
  {
    topic: 'Dinamik',
    category: 'TYT-AYT',
    formulas: [
      {
        id: 'd1',
        name: 'Newton İkinci Kanunu',
        formula: 'Kuvvet = Kütle × İvme',
        mathFormula: 'F = m · a',
        description: 'Cisme etki eden net kuvvet, kütlesi ile ivmesinin çarpımına eşittir',
        difficulty: 'TYT',
        explanation: 'F: Kuvvet (Newton), m: Kütle (kilogram), a: İvme (m/s²)',
        units: { F: 'Newton (N)', m: 'kilogram (kg)', a: 'm/s²' }
      },
      {
        id: 'd2',
        name: 'Ağırlık Kuvveti',
        formula: 'Ağırlık = Kütle × Yerçekimi İvmesi',
        mathFormula: 'G = m · g',
        description: 'Cismin yerçekimi etkisiyle aldığı kuvvet',
        difficulty: 'TYT',
        explanation: 'G: Ağırlık (N), m: Kütle (kg), g: Yerçekimi ivmesi (10 m/s²)',
        units: { G: 'N', m: 'kg', g: 'm/s²' }
      }
    ]
  },
  {
    topic: 'Enerji',
    category: 'TYT-AYT',
    formulas: [
      {
        id: 'e1',
        name: 'Kinetik Enerji (Hareket Enerjisi)',
        formula: 'Kinetik Enerji = Yarım × Kütle × Hız²',
        mathFormula: 'Eₖ = ½ · m · v²',
        description: 'Hareket halindeki cismin sahip olduğu enerji',
        difficulty: 'TYT',
        explanation: 'Eₖ: Kinetik enerji (Joule), m: Kütle (kg), v: Hız (m/s)',
        units: { Ek: 'Joule (J)', m: 'kg', v: 'm/s' }
      },
      {
        id: 'e2',
        name: 'Potansiyel Enerji (Konum Enerjisi)',
        formula: 'Potansiyel Enerji = Kütle × Yerçekimi × Yükseklik',
        mathFormula: 'Eₚ = m · g · h',
        description: 'Cismin yüksekliğinden dolayı sahip olduğu enerji',
        difficulty: 'TYT',
        explanation: 'Eₚ: Potansiyel enerji (J), m: Kütle (kg), g: 10 m/s², h: Yükseklik (m)',
        units: { Ep: 'J', m: 'kg', g: 'm/s²', h: 'm' }
      },
      {
        id: 'e3',
        name: 'İş Formülü',
        formula: 'İş = Kuvvet × Yol × cos(Açı)',
        mathFormula: 'W = F · s · cos(θ)',
        description: 'Kuvvetin hareket yönünde yaptığı iş',
        difficulty: 'AYT',
        explanation: 'W: İş (J), F: Kuvvet (N), s: Yol (m), θ: Açı (derece)',
        units: { W: 'J', F: 'N', s: 'm', θ: 'derece' }
      }
    ]
  },
  {
    topic: 'Elektrik',
    category: 'TYT-AYT',
    formulas: [
      {
        id: 'el1',
        name: 'Ohm Kanunu',
        formula: 'Gerilim = Akım × Direnç',
        mathFormula: 'V = I · R',
        description: 'Elektrik devresinde gerilim, akım ve direnç arasındaki ilişki',
        difficulty: 'TYT',
        explanation: 'V: Gerilim (Volt), I: Akım (Amper), R: Direnç (Ohm)',
        units: { V: 'Volt (V)', I: 'Amper (A)', R: 'Ohm (Ω)' }
      },
      {
        id: 'el2',
        name: 'Elektriksel Güç',
        formula: 'Güç = Gerilim × Akım',
        mathFormula: 'P = V · I',
        description: 'Elektrik devresinin harcadığı güç',
        difficulty: 'TYT',
        explanation: 'P: Güç (Watt), V: Gerilim (Volt), I: Akım (Amper)',
        units: { P: 'Watt (W)', V: 'V', I: 'A' }
      },
      {
        id: 'el3',
        name: 'Elektriksel Enerji',
        formula: 'Enerji = Güç × Zaman',
        mathFormula: 'E = P · t',
        description: 'Elektrik cihazının tükettiği toplam enerji',
        difficulty: 'TYT',
        explanation: 'E: Enerji (Joule), P: Güç (Watt), t: Zaman (saniye)',
        units: { E: 'Joule (J)', P: 'W', t: 's' }
      }
    ]
  }
];

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const path = event.path.replace('/.netlify/functions/formulas', '');

  // Get categories
  if (path === '/categories' || path === '/categories/') {
    const categories = formulasData.map(item => ({
      name: item.topic,
      count: item.formulas.length
    }));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ categories })
    };
  }

  // Get all formulas
  if (path === '/all' || path === '/all/' || path === '' || path === '/') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: formulasData })
    };
  }

  // Get formulas by topic
  if (path.startsWith('/topic/')) {
    const topic = decodeURIComponent(path.split('/topic/')[1]);
    const data = formulasData.find(item => item.topic === topic);
    
    if (!data) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Konu bulunamadı' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data })
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Endpoint bulunamadı' })
  };
}
