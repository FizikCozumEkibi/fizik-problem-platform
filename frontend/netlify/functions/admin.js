// Netlify Serverless Function - Admin API
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// GÜNCELLENEN ŞİFRE
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = hashPassword('Ferhat4755__');

// Mock user database (shared with auth.js - in production use real database)
// This is a simplified version - in real app, share database with auth.js
const mockUsers = new Map();

// Add demo users
mockUsers.set('demo_user', {
  id: 'user1',
  username: 'demo_user',
  email: 'demo@example.com',
  status: 'active',
  role: 'user',
  createdAt: new Date('2024-01-01').toISOString(),
  expiryDate: new Date('2025-12-31').toISOString(),
  lastLogin: new Date().toISOString(),
  solvedProblems: 45
});

mockUsers.set('test_user', {
  id: 'user2',
  username: 'test_user',
  email: 'test@example.com',
  status: 'active',
  role: 'user',
  createdAt: new Date('2024-02-01').toISOString(),
  expiryDate: new Date('2025-12-31').toISOString(),
  lastLogin: new Date().toISOString(),
  solvedProblems: 23
});

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/admin', '');
  const authHeader = event.headers.authorization || event.headers.Authorization;

  // Login endpoint - no auth required
  if (path === '/login' && event.httpMethod === 'POST') {
    try {
      const { username, password } = JSON.parse(event.body);
      const hashedPassword = hashPassword(password);

      if (username === ADMIN_USERNAME && hashedPassword === ADMIN_PASSWORD) {
        const token = `admin-token-${Date.now()}`;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token: token,
            username: ADMIN_USERNAME
          })
        };
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Kullanıcı adı veya şifre hatalı' })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Geçersiz istek' })
      };
    }
  }

  // Check authentication for other endpoints
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Yetkisiz erişim' })
    };
  }

  // Simple token validation (in production, use proper JWT or session)
  const token = authHeader.replace('Bearer ', '');
  if (!token || !token.startsWith('admin-token-')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Geçersiz token' })
    };
  }

  // Get stats
  if (path === '/stats' && event.httpMethod === 'GET') {
    const userList = Array.from(mockUsers.values());
    const stats = {
      totalUsers: userList.length,
      activeUsers: userList.filter(u => u.status === 'active').length,
      blockedUsers: userList.filter(u => u.status === 'blocked').length,
      totalProblemsSolved: userList.reduce((sum, u) => sum + (u.solvedProblems || 0), 0)
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ stats })
    };
  }

  // Get users
  if (path === '/users' && event.httpMethod === 'GET') {
    const userList = Array.from(mockUsers.values()).map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      status: u.status,
      role: u.role,
      joinDate: u.createdAt?.split('T')[0] || '2024-01-01',
      level: 'TYT', // Default
      solvedProblems: u.solvedProblems || 0,
      expiryDate: u.expiryDate,
      lastLogin: u.lastLogin
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users: userList })
    };
  }

  // Update user status
  if (path.startsWith('/users/') && path.includes('/status') && event.httpMethod === 'PATCH') {
    try {
      const pathParts = path.split('/');
      const username = pathParts[2];
      const { status } = JSON.parse(event.body);

      const user = mockUsers.get(username);
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Kullanıcı bulunamadı' })
        };
      }

      user.status = status;
      mockUsers.set(username, user);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Kullanıcı durumu güncellendi',
          user: {
            username: user.username,
            status: user.status
          }
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'İşlem başarısız' })
      };
    }
  }

  // Update user expiry
  if (path.startsWith('/users/') && path.includes('/expiry') && event.httpMethod === 'PATCH') {
    try {
      const pathParts = path.split('/');
      const username = pathParts[2];
      const { expiryDate } = JSON.parse(event.body);

      const user = mockUsers.get(username);
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Kullanıcı bulunamadı' })
        };
      }

      user.expiryDate = expiryDate;
      mockUsers.set(username, user);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Kullanıcı süresi güncellendi',
          user: {
            username: user.username,
            expiryDate: user.expiryDate
          }
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'İşlem başarısız' })
      };
    }
  }

  // Delete user
  if (path.startsWith('/users/') && !path.includes('/status') && !path.includes('/expiry') && event.httpMethod === 'DELETE') {
    try {
      const pathParts = path.split('/');
      const username = pathParts[2];

      if (!mockUsers.has(username)) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Kullanıcı bulunamadı' })
        };
      }

      mockUsers.delete(username);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Kullanıcı silindi',
          username
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'İşlem başarısız' })
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Endpoint bulunamadı' })
  };
}
