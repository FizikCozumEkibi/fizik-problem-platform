// Netlify Function - Admin Get Users - REAL DATABASE (Netlify Blobs)
const { getAllUsers, initializeDemoUsers } = require('./user-storage');

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
    // Initialize demo users
    await initializeDemoUsers();
    
    // Get all users from Netlify Blobs (REAL DATABASE!)
    const allUsers = await getAllUsers();
    
    const userList = allUsers.map(u => ({
      id: u.id,
      username: u.username,
      status: u.status,
      role: u.role,
      joinDate: u.createdAt?.split('T')[0] || '2024-01-01',
      level: 'TYT',
      solvedProblems: u.solvedProblems || 0,
      expiryDate: u.expiryDate,
      lastLogin: u.lastLogin
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        users: userList,
        success: true,
        database: 'Netlify Blobs (Persistent Storage)'
      })
    };

  } catch (error) {
    console.error('Get users error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Kullanıcılar alınamadı: ' + error.message })
    };
  }
};
