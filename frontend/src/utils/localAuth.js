// LOCAL AUTHENTICATION - Offline çalışan sistem
import crypto from 'crypto-js';

const USERS_KEY = 'physics_solver_users';
const CURRENT_USER_KEY = 'physics_solver_current_user';

// Hash password
export const hashPassword = (password) => {
  return crypto.SHA256(password).toString();
};

// Generate token
export const generateToken = (userId, username) => {
  const tokenData = `${userId}-${username}-${Date.now()}`;
  return crypto.SHA256(tokenData).toString();
};

// Get all users from localStorage
export const getAllLocalUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (err) {
    return [];
  }
};

// Save user to localStorage
export const saveLocalUser = (userData) => {
  try {
    const users = getAllLocalUsers();
    const existingIndex = users.findIndex(u => u.username === userData.username);
    
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (err) {
    console.error('Save user error:', err);
    return false;
  }
};

// Get user from localStorage
export const getLocalUser = (username) => {
  const users = getAllLocalUsers();
  return users.find(u => u.username === username) || null;
};

// Register user locally
export const registerLocalUser = (username, password) => {
  try {
    // Check if exists
    if (getLocalUser(username)) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanılıyor' };
    }
    
    // Check admin username
    if (username.toLowerCase() === 'admin') {
      return { success: false, error: 'Bu kullanıcı adı kullanılamaz' };
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
    
    saveLocalUser(newUser);
    
    // Generate token
    const token = generateToken(userId, username);
    
    return {
      success: true,
      token,
      user: {
        id: userId,
        username,
        role: 'user',
        status: 'active',
        expiryDate: newUser.expiryDate
      }
    };
  } catch (err) {
    return { success: false, error: 'Kayıt sırasında hata oluştu' };
  }
};

// Login user locally
export const loginLocalUser = (username, password) => {
  try {
    // Admin check
    if (username === 'admin' && hashPassword(password) === hashPassword('Ferhat4755__')) {
      const token = generateToken('admin', 'admin');
      return {
        success: true,
        token,
        user: {
          id: 'admin',
          username: 'admin',
          role: 'admin',
          status: 'active'
        }
      };
    }
    
    // Regular user
    const user = getLocalUser(username);
    
    if (!user || user.password !== hashPassword(password)) {
      return { success: false, error: 'Kullanıcı adı veya şifre hatalı' };
    }
    
    // Check status
    if (user.status === 'blocked') {
      return { success: false, error: 'Hesabınız engellenmiş' };
    }
    
    // Check expiry
    if (new Date(user.expiryDate) < new Date()) {
      return { success: false, error: 'Hesabınızın süresi dolmuş' };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    saveLocalUser(user);
    
    // Generate token
    const token = generateToken(user.id, user.username);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
        expiryDate: user.expiryDate
      }
    };
  } catch (err) {
    return { success: false, error: 'Giriş sırasında hata oluştu' };
  }
};

// Set current user
export const setCurrentUser = (userData) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

// Initialize demo users
export const initializeDemoUsers = () => {
  const demoUser = getLocalUser('demo_user');
  if (!demoUser) {
    saveLocalUser({
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
  }
};
