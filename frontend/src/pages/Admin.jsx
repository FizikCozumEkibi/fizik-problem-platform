import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Lock, Unlock, Trash2, BarChart3, BookOpen, Clock } from 'lucide-react';
import { getAllLocalUsers } from '../utils/localAuth';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in as admin
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        // Not admin, redirect to home
        navigate('/');
        return;
      }
      
      // User is admin, load data
      loadAdminData();
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      // LOCAL DATA - Offline çalışır!
      const localUsers = getAllLocalUsers();
      
      const userList = localUsers.map(u => ({
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
      
      const statsData = {
        totalUsers: localUsers.length,
        activeUsers: localUsers.filter(u => u.status === 'active').length,
        blockedUsers: localUsers.filter(u => u.status === 'blocked').length,
        totalProblemsSolved: localUsers.reduce((sum, u) => sum + (u.solvedProblems || 0), 0)
      };
      
      setStats(statsData);
      setUsers(userList);
      setLoading(false);
    } catch (err) {
      console.error('Admin data load error:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const toggleUserStatus = async (username, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    
    // Update local state
    setUsers(users.map(u => 
      u.username === username ? { ...u, status: newStatus } : u
    ));
    
    alert(`${username} kullanıcısı ${newStatus === 'active' ? 'aktif' : 'engellenmiş'} duruma getirildi`);
  };

  const deleteUser = async (username) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    // Remove from local state
    setUsers(users.filter(u => u.username !== username));
    alert(`${username} kullanıcısı silindi`);
  };

  const updateUserExpiry = async (username, currentExpiry) => {
    const days = prompt('Kaç gün eklemek istersiniz?', '30');
    if (!days || isNaN(days)) return;

    const newExpiry = new Date(currentExpiry || new Date());
    newExpiry.setDate(newExpiry.getDate() + parseInt(days));

    // Update local state
    setUsers(users.map(u => 
      u.username === username ? { ...u, expiryDate: newExpiry.toISOString() } : u
    ));
    
    alert(`${username} kullanıcısının süresi ${days} gün uzatıldı`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="text-gray-600 mt-2">Platform yönetimi ve istatistikler</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Important Notice */}
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <div className="text-sm text-orange-800">
              <p className="font-semibold">⚠️ Demo Mod - Kullanıcı Sistemi</p>
              <p className="mt-1">
                Kullanıcı verileri LocalStorage'da saklanıyor (cihaza özel). 
                Yeni kayıtlar sadece aynı cihazda/tarayıcıda görünür.
              </p>
              <p className="mt-2 text-orange-700">
                <strong>Çözüm:</strong> Gerçek kullanıcı yönetimi için MongoDB/PostgreSQL veya Supabase entegrasyonu gereklidir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aktif Kullanıcı</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Engellenmiş</p>
                <p className="text-3xl font-bold text-red-600">{stats.blockedUsers}</p>
              </div>
              <Lock className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">TYT Öğrencileri</p>
                <p className="text-3xl font-bold text-blue-600">{stats.tytStudents}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">AYT Öğrencileri</p>
                <p className="text-3xl font-bold text-purple-600">{stats.aytStudents}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Çözülen Problem</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalProblemsSolved}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Seviye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.level === 'TYT'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {user.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.solvedProblems}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? 'Aktif' : 'Engellenmiş'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateUserExpiry(user.username, user.expiryDate)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                        title="Süre Ayarla"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.username, user.status)}
                        className={`p-2 rounded-lg transition-all ${
                          user.status === 'active'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={user.status === 'active' ? 'Engelle' : 'Engeli Kaldır'}
                      >
                        {user.status === 'active' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user.username)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
