import express from 'express';

const router = express.Router();

// Mock users database
let users = [
  { id: 1, username: 'ahmet_yilmaz', email: 'ahmet@example.com', level: 'TYT', status: 'active', joinDate: '2024-01-15', solvedProblems: 45 },
  { id: 2, username: 'zeynep_kaya', email: 'zeynep@example.com', level: 'AYT', status: 'active', joinDate: '2024-02-20', solvedProblems: 78 },
  { id: 3, username: 'mehmet_demir', email: 'mehmet@example.com', level: 'TYT', status: 'blocked', joinDate: '2024-03-10', solvedProblems: 12 }
];

// Simple auth middleware (would be JWT in production)
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Simple check - in production use JWT
  if (authHeader === 'Bearer admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Yetkisiz erişim' });
  }
};

// Get all users
router.get('/users', adminAuth, (req, res) => {
  try {
    res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Kullanıcılar alınırken hata oluştu'
    });
  }
});

// Get user by ID
router.get('/users/:id', adminAuth, (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Kullanıcı alınırken hata oluştu'
    });
  }
});

// Block/Unblock user
router.patch('/users/:id/status', adminAuth, (req, res) => {
  try {
    const { status } = req.body;
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    user.status = status;

    res.json({
      success: true,
      message: 'Kullanıcı durumu güncellendi',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      error: 'Kullanıcı durumu güncellenirken hata oluştu'
    });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, (req, res) => {
  try {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    users.splice(index, 1);

    res.json({
      success: true,
      message: 'Kullanıcı silindi'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Kullanıcı silinirken hata oluştu'
    });
  }
});

// Get statistics
router.get('/stats', adminAuth, (req, res) => {
  try {
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      blockedUsers: users.filter(u => u.status === 'blocked').length,
      tytStudents: users.filter(u => u.level === 'TYT').length,
      aytStudents: users.filter(u => u.level === 'AYT').length,
      totalProblemsSolved: users.reduce((sum, u) => sum + u.solvedProblems, 0)
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'İstatistikler alınırken hata oluştu'
    });
  }
});

// Admin login (simplified)
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple check - in production use proper auth
    if (username === 'admin' && password === 'admin123') {
      res.json({
        success: true,
        token: 'admin-token',
        user: { username: 'admin', role: 'admin' }
      });
    } else {
      res.status(401).json({
        error: 'Geçersiz kullanıcı adı veya şifre'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error: 'Giriş yapılırken hata oluştu'
    });
  }
});

export default router;
