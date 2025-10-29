// SUPABASE Database Configuration - GERÇEK ÇALIŞAN DATABASE
const { createClient } = require('@supabase/supabase-js');

// DEMO Supabase credentials (Bu bilgileri kendi Supabase projenizle değiştirin)
// 1. https://supabase.com adresine gidin
// 2. Ücretsiz hesap oluşturun
// 3. Yeni proje oluşturun
// 4. Settings > API'den URL ve ANON_KEY'i alın
// 5. SQL Editor'den şu tabloyu oluşturun:

/*
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  expiry_date TIMESTAMP,
  last_login TIMESTAMP,
  solved_problems INTEGER DEFAULT 0
);
*/

// GEÇICI ÇÖZÜM: Netlify Environment Variables kullanıyoruz
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://demo-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'demo-key';

let supabase = null;

function getSupabaseClient() {
  if (!supabase && SUPABASE_URL !== 'https://demo-project.supabase.co') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

// Fallback: Basit dosya tabanlı sistem
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/tmp/physics-solver-users';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function getAllUsersFromFile() {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const users = [];
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const data = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        users.push(JSON.parse(data));
      } catch (err) {
        console.error('Error reading user file:', file, err);
      }
    }
  }
  
  return users;
}

async function getUserFromFile(username) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${username}.json`);
  
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }
  
  return null;
}

async function saveUserToFile(username, userData) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  return userData;
}

async function deleteUserFromFile(username) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${username}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Export functions
module.exports = {
  getSupabaseClient,
  // File-based fallback
  getAllUsersFromFile,
  getUserFromFile,
  saveUserToFile,
  deleteUserFromFile
};
