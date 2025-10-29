import express from 'express';

const router = express.Router();

// Mock video database
const videoDatabase = {
  'Kinematik': [
    {
      id: 1,
      title: 'Kinematik Giriş - Temel Kavramlar',
      description: 'Kinematik konusuna giriş, temel kavramlar ve formüller',
      duration: '15:30',
      thumbnail: 'https://via.placeholder.com/320x180?text=Kinematik+1',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      difficulty: 'TYT',
      views: 15420
    },
    {
      id: 2,
      title: 'Düzgün Değişken Hızlı Hareket',
      description: 'DVHH formülleri ve örnek problemler',
      duration: '22:45',
      thumbnail: 'https://via.placeholder.com/320x180?text=Kinematik+2',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      difficulty: 'AYT',
      views: 12350
    }
  ],
  'Dinamik': [
    {
      id: 3,
      title: 'Newton Kanunları',
      description: 'Newton\'un hareket kanunları ve uygulamaları',
      duration: '18:20',
      thumbnail: 'https://via.placeholder.com/320x180?text=Dinamik+1',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      difficulty: 'TYT',
      views: 18900
    }
  ],
  'Elektrik': [
    {
      id: 4,
      title: 'Ohm Kanunu ve Elektrik Devreleri',
      description: 'Temel elektrik devre analizi',
      duration: '25:10',
      thumbnail: 'https://via.placeholder.com/320x180?text=Elektrik+1',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      difficulty: 'AYT',
      views: 14220
    }
  ],
  'Enerji': [
    {
      id: 5,
      title: 'Mekanik Enerji ve Korunumu',
      description: 'Potansiyel ve kinetik enerji, enerji korunumu',
      duration: '20:15',
      thumbnail: 'https://via.placeholder.com/320x180?text=Enerji+1',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      difficulty: 'TYT',
      views: 16780
    }
  ]
};

// Get videos by topic
router.get('/topic/:topic', (req, res) => {
  try {
    const { topic } = req.params;
    const videos = videoDatabase[topic] || [];

    res.json({
      success: true,
      topic,
      videos,
      count: videos.length
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      error: 'Videolar alınırken hata oluştu'
    });
  }
});

// Get all topics
router.get('/topics', (req, res) => {
  try {
    const topics = Object.keys(videoDatabase).map(topic => ({
      name: topic,
      videoCount: videoDatabase[topic].length
    }));

    res.json({
      success: true,
      topics
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({
      error: 'Konular alınırken hata oluştu'
    });
  }
});

// Get video by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let foundVideo = null;

    for (const videos of Object.values(videoDatabase)) {
      foundVideo = videos.find(v => v.id === parseInt(id));
      if (foundVideo) break;
    }

    if (!foundVideo) {
      return res.status(404).json({
        error: 'Video bulunamadı'
      });
    }

    res.json({
      success: true,
      video: foundVideo
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      error: 'Video alınırken hata oluştu'
    });
  }
});

// Search videos
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const allVideos = Object.values(videoDatabase).flat();
    
    const results = allVideos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      query,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Search videos error:', error);
    res.status(500).json({
      error: 'Video arama hatası'
    });
  }
});

export default router;
