import express from 'express';
import multer from 'multer';
import path from 'path';
import aiService from '../services/aiService.js';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'problem-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

// Solve problem with text
router.post('/solve-text', async (req, res) => {
  try {
    const { problem, level } = req.body;

    if (!problem || !problem.trim()) {
      return res.status(400).json({ error: 'Problem metni gereklidir' });
    }

    const solution = await aiService.solve(problem, level || 'TYT');

    res.json({
      success: true,
      solution,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Solve text error:', error);
    res.status(500).json({
      error: 'Çözüm oluşturulurken hata oluştu',
      message: error.message
    });
  }
});

// Solve problem with image (OCR will be handled on frontend)
router.post('/solve-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resim dosyası gereklidir' });
    }

    const { extractedText, level } = req.body;

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({ error: 'Resimden metin çıkarılamadı' });
    }

    const solution = await aiService.solve(extractedText, level || 'TYT', {
      imagePath: req.file.path,
      filename: req.file.filename
    });

    res.json({
      success: true,
      solution,
      imageUrl: `/uploads/${req.file.filename}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Solve image error:', error);
    res.status(500).json({
      error: 'Resimli çözüm oluşturulurken hata oluştu',
      message: error.message
    });
  }
});

// Get similar problems
router.post('/similar', async (req, res) => {
  try {
    const { topic, level } = req.body;

    // Mock similar problems (would be from database in production)
    const similarProblems = [
      {
        id: 1,
        title: `${topic} - Benzer Problem 1`,
        difficulty: level,
        description: 'Bu probleme benzer bir çözüm yöntemi izler.'
      },
      {
        id: 2,
        title: `${topic} - Benzer Problem 2`,
        difficulty: level,
        description: 'Aynı konuya ait farklı bir yaklaşım.'
      }
    ];

    res.json({
      success: true,
      problems: similarProblems
    });
  } catch (error) {
    console.error('Similar problems error:', error);
    res.status(500).json({
      error: 'Benzer problemler alınırken hata oluştu'
    });
  }
});

export default router;
