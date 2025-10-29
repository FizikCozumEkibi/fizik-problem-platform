// Netlify Function - Admin Stats - REAL DATABASE
const { getAllUsers } = require('./user-storage');

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check admin auth
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Yetkisiz erişim' })
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get all users from Netlify Blobs
    const userList = await getAllUsers();
    
    const stats = {
      totalUsers: userList.length,
      activeUsers: userList.filter(u => u.status === 'active').length,
      blockedUsers: userList.filter(u => u.status === 'blocked').length,
      totalProblemsSolved: userList.reduce((sum, u) => sum + (u.solvedProblems || 0), 0)
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        stats,
        success: true 
      })
    };

  } catch (error) {
    console.error('Get stats error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'İstatistikler alınamadı: ' + error.message })
    };
  }
};
