import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Solution() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/solver')}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Çözücüye Dön</span>
      </button>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Çözüm #{id}
        </h1>
        <p className="text-gray-600">
          Bu sayfa gelecekte çözüm geçmişi için kullanılacaktır.
        </p>
      </div>
    </div>
  );
}
