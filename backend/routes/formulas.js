import express from 'express';

const router = express.Router();

// Physics formulas database
const formulaDatabase = {
  'Kinematik': {
    category: 'Mekanik',
    formulas: [
      {
        id: 1,
        name: 'Ortalama Hız',
        formula: 'v = Δx / Δt',
        latex: 'v = \\frac{\\Delta x}{\\Delta t}',
        description: 'Ortalama hız, alınan yolun geçen zamana bölümüdür',
        units: { v: 'm/s', x: 'm', t: 's' },
        difficulty: 'TYT'
      },
      {
        id: 2,
        name: 'Hareket Denklemi',
        formula: 'x = x0 + v0*t + (1/2)*a*t^2',
        latex: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
        description: 'Düzgün değişken hızlı harekette konum denklemi',
        units: { x: 'm', v0: 'm/s', a: 'm/s^2', t: 's' },
        difficulty: 'TYT'
      },
      {
        id: 3,
        name: 'Hız-İvme Bağıntısı',
        formula: 'v^2 = v0^2 + 2*a*x',
        latex: 'v^2 = v_0^2 + 2ax',
        description: 'Zaman içermeyen hız denklemi',
        units: { v: 'm/s', a: 'm/s^2', x: 'm' },
        difficulty: 'AYT'
      }
    ]
  },
  'Dinamik': {
    category: 'Mekanik',
    formulas: [
      {
        id: 4,
        name: 'Newton\'un 2. Kanunu',
        formula: 'F = ma',
        latex: 'F = ma',
        description: 'Net kuvvet, kütle ile ivmenin çarpımına eşittir',
        units: { F: 'N', m: 'kg', a: 'm/s^2' },
        difficulty: 'TYT'
      },
      {
        id: 5,
        name: 'Sürtünme Kuvveti',
        formula: 'f = mu*N',
        latex: 'f = \\mu N',
        description: 'Sürtünme kuvveti, sürtünme katsayısı ile normal kuvvetin çarpımıdır',
        units: { f: 'N', mu: 'sayı', N: 'N' },
        difficulty: 'TYT'
      }
    ]
  },
  'Enerji': {
    category: 'Mekanik',
    formulas: [
      {
        id: 6,
        name: 'Kinetik Enerji',
        formula: 'Ek = (1/2)*m*v^2',
        latex: 'E_k = \\frac{1}{2}mv^2',
        description: 'Hareket halindeki cismin enerjisi',
        units: { Ek: 'J', m: 'kg', v: 'm/s' },
        difficulty: 'TYT'
      },
      {
        id: 7,
        name: 'Potansiyel Enerji',
        formula: 'Ep = mgh',
        latex: 'E_p = mgh',
        description: 'Yüksekliğe bağlı potansiyel enerji',
        units: { Ep: 'J', m: 'kg', g: 'm/s^2', h: 'm' },
        difficulty: 'TYT'
      },
      {
        id: 8,
        name: 'İş',
        formula: 'W = F*d*cos(theta)',
        latex: 'W = F \\cdot d \\cdot \\cos\\theta',
        description: 'Kuvvetin yaptığı iş',
        units: { W: 'J', F: 'N', d: 'm' },
        difficulty: 'AYT'
      }
    ]
  },
  'Elektrik': {
    category: 'Elektrik ve Manyetizma',
    formulas: [
      {
        id: 9,
        name: 'Ohm Kanunu',
        formula: 'V = I·R',
        latex: 'V = IR',
        description: 'Voltaj, akım ile direncin çarpımına eşittir',
        units: { V: 'V', I: 'A', R: 'Ω' },
        difficulty: 'TYT'
      },
      {
        id: 10,
        name: 'Elektrik Gücü',
        formula: 'P = V·I',
        latex: 'P = VI',
        description: 'Elektrik gücü formülü',
        units: { P: 'W', V: 'V', I: 'A' },
        difficulty: 'AYT'
      },
      {
        id: 11,
        name: 'Elektrik Enerjisi',
        formula: 'E = P·t',
        latex: 'E = Pt',
        description: 'Harcanan elektrik enerjisi',
        units: { E: 'J', P: 'W', t: 's' },
        difficulty: 'TYT'
      }
    ]
  },
  'Basınç': {
    category: 'Akışkanlar',
    formulas: [
      {
        id: 12,
        name: 'Katı Basıncı',
        formula: 'P = F/A',
        latex: 'P = \\frac{F}{A}',
        description: 'Basınç, kuvvetin alana bölümüdür',
        units: { P: 'Pa', F: 'N', A: 'm^2' },
        difficulty: 'TYT'
      },
      {
        id: 13,
        name: 'Sıvı Basıncı',
        formula: 'P = rho*g*h',
        latex: 'P = \\rho gh',
        description: 'Sıvı basıncı formülü',
        units: { P: 'Pa', rho: 'kg/m^3', g: 'm/s^2', h: 'm' },
        difficulty: 'TYT'
      }
    ]
  }
};

// Get all formula categories
router.get('/categories', (req, res) => {
  try {
    const categories = Object.keys(formulaDatabase).map(key => ({
      name: key,
      category: formulaDatabase[key].category,
      count: formulaDatabase[key].formulas.length
    }));

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Kategoriler alınırken hata oluştu'
    });
  }
});

// Get formulas by topic
router.get('/topic/:topic', (req, res) => {
  try {
    const { topic } = req.params;
    const data = formulaDatabase[topic];

    if (!data) {
      return res.status(404).json({
        error: 'Konu bulunamadı'
      });
    }

    res.json({
      success: true,
      topic,
      category: data.category,
      formulas: data.formulas
    });
  } catch (error) {
    console.error('Get formulas error:', error);
    res.status(500).json({
      error: 'Formüller alınırken hata oluştu'
    });
  }
});

// Get all formulas
router.get('/all', (req, res) => {
  try {
    const allFormulas = Object.entries(formulaDatabase).map(([topic, data]) => ({
      topic,
      category: data.category,
      formulas: data.formulas
    }));

    res.json({
      success: true,
      data: allFormulas
    });
  } catch (error) {
    console.error('Get all formulas error:', error);
    res.status(500).json({
      error: 'Formüller alınırken hata oluştu'
    });
  }
});

// Search formulas
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const results = [];

    Object.entries(formulaDatabase).forEach(([topic, data]) => {
      const matchingFormulas = data.formulas.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase()) ||
        f.formula.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingFormulas.length > 0) {
        results.push({
          topic,
          category: data.category,
          formulas: matchingFormulas
        });
      }
    });

    res.json({
      success: true,
      query,
      results,
      count: results.reduce((acc, r) => acc + r.formulas.length, 0)
    });
  } catch (error) {
    console.error('Search formulas error:', error);
    res.status(500).json({
      error: 'Formül arama hatası'
    });
  }
});

export default router;
