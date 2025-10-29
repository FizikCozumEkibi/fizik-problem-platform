import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Atom, BookOpen, Calculator, Settings, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/login');
  };
  
  const navigation = [
    { name: 'Ana Sayfa', path: '/', icon: Atom },
    { name: 'Problem Çöz', path: '/solver', icon: Calculator },
    { name: 'Formül Kütüphanesi', path: '/formulas', icon: BookOpen },
    { name: 'Ayarlar', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fizik Çözücü
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info or Login/Register */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm font-medium">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-red-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">Çıkış</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden pb-3 flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Fizik Problem Çözücü</h3>
              <p className="text-sm text-gray-600">
                TYT-AYT fizik problemlerinizi yapay zeka ile çözün, adım adım öğrenin.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Özellikler</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Metin ve Fotoğraf ile Problem Girişi</li>
                <li>• Adım Adım Çözüm</li>
                <li>• Sesli Anlatım</li>
                <li>• Video Eğitimler</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Konu Kapsamı</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Kinematik & Dinamik</li>
                <li>• Elektrik & Manyetizma</li>
                <li>• Enerji & İş-Güç</li>
                <li>• Optik & Dalgalar</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; 2024 Fizik Problem Çözücü. Eğitim amaçlı geliştirilmiştir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
