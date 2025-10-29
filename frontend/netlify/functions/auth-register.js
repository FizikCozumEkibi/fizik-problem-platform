// Netlify Function - User Registration with REAL DATABASE (Netlify Blobs)
const { getUser, saveUser, hashPassword } = require('./user-storage');
const crypto = require('crypto');

function generateToken(userId, username) {
  const tokenData = `${userId}-${username}-${Date.now()}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex');
}

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
    const { username, password } = JSON.parse(event.body);

    // Validation
    if (!username || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Kullanıcı adı en az 3 karakter olmalı (harf, rakam, alt çizgi)'
        })
      };
    }

    if (!password || password.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Şifre en az 6 karakter olmalı'
        })
      };
    }

    // Check if username exists
    const existingUser = await getUser(username);
    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Bu kullanıcı adı zaten kullanılıyor' })
      };
    }

    // Check admin username
    if (username.toLowerCase() === 'admin') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Bu kullanıcı adı kullanılamaz' })
      };
    }

    // Create user
    const userId = `user${Date.now()}`;
    const hashedPassword = hashPassword(password);
    
    const newUser = {
      id: userId,
      username,
      password: hashedPassword,
      status: 'active',
      role: 'user',
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: null,
      solvedProblems: 0
    };

    // Save to Netlify Blobs (REAL DATABASE!)
    await saveUser(username, newUser);

    // Generate token
    const token = generateToken(userId, username);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Kayıt başarılı',
        token,
        user: {
          id: userId,
          username,
          role: 'user',
          status: 'active',
          expiryDate: newUser.expiryDate
        }
      })
    };

  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Kayıt sırasında hata oluştu' })
    };
  }
};
