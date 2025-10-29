// Netlify Serverless Function - Video Library

const mockVideos = [
  {
    id: '1',
    title: 'Düzgün Hızlı Hareket - Temel Kavramlar',
    description: 'Hız, yol ve zaman ilişkisi. TYT düzeyinde anlatım.',
    topic: 'Kinematik',
    difficulty: 'TYT',
    duration: '12:34',
    views: 15234,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '2',
    title: 'İvmeli Hareket - Detaylı Anlatım',
    description: 'Düzgün değişen hızlı hareket ve formülleri.',
    topic: 'Kinematik',
    difficulty: 'AYT',
    duration: '18:45',
    views: 23456,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '3',
    title: 'Newton Kanunları - TYT',
    description: 'Kuvvet ve hareket arasındaki ilişki.',
    topic: 'Dinamik',
    difficulty: 'TYT',
    duration: '15:20',
    views: 18900,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '4',
    title: 'Enerji ve Korunum İlkeleri',
    description: 'Kinetik ve potansiyel enerji dönüşümleri.',
    topic: 'Enerji',
    difficulty: 'AYT',
    duration: '20:15',
    views: 31200,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '5',
    title: 'Ohm Kanunu ve Elektrik Devreleri',
    description: 'Temel elektrik devre çözümleri.',
    topic: 'Elektrik',
    difficulty: 'TYT',
    duration: '14:30',
    views: 27800,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '6',
    title: 'Optik - Mercekler ve Aynalar',
    description: 'Işığın kırılması ve yansıması.',
    topic: 'Optik',
    difficulty: 'AYT',
    duration: '16:45',
    views: 19500,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const topics = [
  { name: 'Kinematik', videoCount: 12 },
  { name: 'Dinamik', videoCount: 8 },
  { name: 'Enerji', videoCount: 10 },
  { name: 'Elektrik', videoCount: 15 },
  { name: 'Manyetizma', videoCount: 6 },
  { name: 'Optik', videoCount: 9 }
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

  const path = event.path.replace('/.netlify/functions/videos', '');

  // Get topics
  if (path === '/topics' || path === '/topics/') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ topics })
    };
  }

  // Get videos by topic
  if (path.startsWith('/topic/')) {
    const topic = decodeURIComponent(path.split('/topic/')[1]);
    const filtered = mockVideos.filter(v => v.topic === topic);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ videos: filtered })
    };
  }

  // Get all videos or search
  const queryParams = event.queryStringParameters || {};
  const search = queryParams.search?.toLowerCase();

  let filtered = [...mockVideos];

  if (search) {
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(search) ||
      v.description.toLowerCase().includes(search) ||
      v.topic.toLowerCase().includes(search)
    );
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ videos: filtered })
  };
}
