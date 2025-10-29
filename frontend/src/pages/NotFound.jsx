import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Sayfa Bulunamadı</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
}
