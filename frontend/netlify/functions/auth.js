// Netlify Serverless Function - User Authentication
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Mock user database (production'da gerçek database kullanılmalı)
const users = new Map();

// Demo users
users.set('demo_user', {
  id: 'user1',
  username: 'demo_user',
  password: hashPassword('demo123'), // Hashed
  email: 'demo@example.com',
  status: 'active',
  role: 'user',
  createdAt: new Date('2024-01-01').toISOString(),
  expiryDate: new Date('2025-12-31').toISOString(),
  lastLogin: null
});

// Admin user
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = hashPassword('Ferhat4755__');

function generateToken(userId, username) {
  const tokenData = `${userId}-${username}-${Date.now()}`;
  return crypto.createHash('sha256').update(tokenData).digest('hex');
}

function validateUsername(username) {
  return username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/auth', '');

  // REGISTER
  if (path === '/register' && event.httpMethod === 'POST') {
    try {
      const { username, password, email } = JSON.parse(event.body);

      // Validation
      if (!validateUsername(username)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Kullanıcı adı en az 3 karakter olmalı ve sadece harf, rakam, alt çizgi içerebilir' 
          })
        };
      }

      if (!validatePassword(password)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Şifre en az 6 karakter olmalı' 
          })
        };
      }

      // Check if username exists
      if (users.has(username)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Bu kullanıcı adı zaten kullanılıyor' })
        };
      }

      // Check if admin username
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
        email: email || `${username}@example.com`,
        status: 'active',
        role: 'user',
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 yıl
        lastLogin: null,
        solvedProblems: 0
      };

      users.set(username, newUser);

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
            email: newUser.email,
            status: newUser.status,
            expiryDate: newUser.expiryDate
          }
        })
      };

    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Kayıt sırasında hata oluştu' })
      };
    }
  }

  // LOGIN
  if (path === '/login' && event.httpMethod === 'POST') {
    try {
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

      // Check regular user
      const user = users.get(username);
      
      if (!user || user.password !== hashedPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Kullanıcı adı veya şifre hatalı' })
        };
      }

      // Check user status
      if (user.status === 'blocked') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Hesabınız engellenmiş. Admin ile iletişime geçin.' })
        };
      }

      // Check expiry
      if (new Date(user.expiryDate) < new Date()) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Hesabınızın süresi dolmuş. Admin ile iletişime geçin.' })
        };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();

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
            email: user.email,
            role: user.role,
            status: user.status,
            expiryDate: user.expiryDate
          }
        })
      };

    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Giriş sırasında hata oluştu' })
      };
    }
  }

  // VERIFY TOKEN
  if (path === '/verify' && event.httpMethod === 'GET') {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token gerekli' })
      };
    }

    // For demo, just return success
    // Production'da token validation yapılmalı
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        valid: true,
        message: 'Token geçerli'
      })
    };
  }

  // GET ALL USERS (Admin only)
  if (path === '/users' && event.httpMethod === 'GET') {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    // Check admin token (basit kontrol)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Yetkisiz erişim' })
      };
    }

    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      status: u.status,
      role: u.role,
      createdAt: u.createdAt,
      expiryDate: u.expiryDate,
      lastLogin: u.lastLogin,
      solvedProblems: u.solvedProblems || 0
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users: userList })
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Endpoint bulunamadı' })
  };
}
