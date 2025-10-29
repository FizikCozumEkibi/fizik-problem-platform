// Netlify Function - User Login with REAL DATABASE
const { getUser, saveUser, hashPassword, initializeDemoUsers } = require('./user-storage');
const crypto = require('crypto');

function generateToken(userId, username) {
  const tokenData = `${userId}-${username}-${Date.now()}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex');
}

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = hashPassword('Ferhat4755__');

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize demo users
    await initializeDemoUsers();
    
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Kullanıcı adı ve şifre gerekli' })
      };
    }

    const hashedPassword = hashPassword(password);

    // Check admin
    if (username === ADMIN_USERNAME && hashedPassword === ADMIN_PASSWORD) {
      const token = generateToken('admin', ADMIN_USERNAME);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          user: {
            id: 'admin',
            username: ADMIN_USERNAME,
            role: 'admin',
            status: 'active'
          }
        })
      };
    }

    // Check regular user from Netlify Blobs
    const user = await getUser(username);
    
    if (!user || user.password !== hashedPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Kullanıcı adı veya şifre hatalı'
        })
      };
    }

    // Check user status
    if (user.status === 'blocked') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Hesabınız engellenmiş' })
      };
    }

    // Check expiry
    if (new Date(user.expiryDate) < new Date()) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Hesabınızın süresi dolmuş' })
      };
    }

    // Update last login in Netlify Blobs
    user.lastLogin = new Date().toISOString();
    await saveUser(username, user);

    // Generate token
    const token = generateToken(user.id, user.username);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          status: user.status,
          expiryDate: user.expiryDate
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Giriş sırasında hata oluştu' })
    };
  }
};
