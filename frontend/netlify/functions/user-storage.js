// BASIT VE GÜVENİLİR User Storage - GLOBAL STATE
const crypto = require('crypto');

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

// GLOBAL SHARED STATE - Tüm functions'lar bunu paylaşacak
if (!global.usersDatabase) {
  global.usersDatabase = new Map();
  
  // Demo users ekle
  global.usersDatabase.set('demo_user', {
    id: 'user1',
    username: 'demo_user',
    password: hashPassword('demo123'),
    status: 'active',
    role: 'user',
    createdAt: new Date('2024-01-15').toISOString(),
    expiryDate: new Date('2025-12-31').toISOString(),
    lastLogin: new Date().toISOString(),
    solvedProblems: 45
  });
  
  global.usersDatabase.set('test_user', {
    id: 'user2',
    username: 'test_user',
    password: hashPassword('test123'),
    status: 'active',
    role: 'user',
    createdAt: new Date('2024-02-01').toISOString(),
    expiryDate: new Date('2025-12-31').toISOString(),
    lastLogin: new Date('2024-10-20').toISOString(),
    solvedProblems: 23
  });
}

// Get all users
async function getAllUsers() {
  return Array.from(global.usersDatabase.values());
}

// Get user by username
async function getUser(username) {
  return global.usersDatabase.get(username) || null;
}

// Save user
async function saveUser(username, userData) {
  global.usersDatabase.set(username, userData);
  console.log(`✅ User saved: ${username}, Total users: ${global.usersDatabase.size}`);
  return userData;
}

// Delete user
async function deleteUser(username) {
  global.usersDatabase.delete(username);
}

// Initialize demo users (artık otomatik oluyor)
async function initializeDemoUsers() {
  // Demo users zaten yukarıda eklendi
  return true;
}

module.exports = {
  getAllUsers,
  getUser,
  saveUser,
  deleteUser,
  initializeDemoUsers,
  hashPassword
};
