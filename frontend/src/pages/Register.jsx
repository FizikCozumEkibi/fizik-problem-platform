import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock } from 'lucide-react';
import { registerLocalUser, initializeDemoUsers } from '../utils/localAuth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize demo users
    initializeDemoUsers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalı');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);

    try {
      // LOCAL REGISTRATION - Offline çalışır!
      const result = registerLocalUser(username, password);
      
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Save token and user
      localStorage.setItem('userToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));

      // Redirect to solver
      navigate('/solver');
    } catch (err) {
      setError('Kayıt sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Kayıt Ol</h1>
          <p className="text-gray-600 mt-2">Fizik problemlerini çözmeye başla</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                placeholder="kullanici_adi"
                required
                pattern="[a-zA-Z0-9_]{3,}"
                title="En az 3 karakter, sadece harf, rakam ve alt çizgi"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              En az 3 karakter, sadece harf, rakam ve alt çizgi
            </p>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                placeholder="••••••"
                required
                minLength="6"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Tekrar
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                placeholder="••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Giriş Yap
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
