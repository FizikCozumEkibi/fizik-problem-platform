import { useState, useEffect } from 'react';
import { Save, Key, Info, ExternalLink, Check, X } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, hasGeminiApiKey, getGeminiApiKeyGuide } from '../services/geminiSolver';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const guide = getGeminiApiKeyGuide();

  useEffect(() => {
    const savedKey = getGeminiApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      console.log('💾 API key kaydediliyor:', apiKey.trim().substring(0, 10) + '...');
      setGeminiApiKey(apiKey.trim());
      
      // Kontrol: Kaydedildikten sonra oku
      const savedKey = getGeminiApiKey();
      console.log('✅ Kaydedilen key okundu:', savedKey ? 'BAŞARILI' : 'HATA');
      console.log('📏 Key uzunluğu:', savedKey?.length);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setSaveStatus('cleared');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600">Gemini AI entegrasyonu ve uygulama ayarları</p>
      </div>

      {/* Gemini API Key Section */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gemini API Anahtarı</h2>
        </div>

        {/* Status */}
        <div className={`p-4 rounded-lg ${hasGeminiApiKey() ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-2">
            {hasGeminiApiKey() ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">✅ API anahtarı kayıtlı - Detaylı çözümler aktif!</span>
              </>
            ) : (
              <>
                <Info className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-yellow-700 font-medium">⚠️ API anahtarı yok - Sadece basit çözümler gösterilecek</p>
                  <p className="text-yellow-600 text-sm mt-1">Detaylı çözümler için kendi Gemini API anahtarınızı aşağıdan ekleyin (ücretsiz)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Google Gemini API Anahtarı
          </label>
          <div className="flex gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showKey ? 'Gizle' : 'Göster'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Save className="w-5 h-5" />
            Kaydet
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <X className="w-5 h-5" />
            Temizle
          </button>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✅ API anahtarı başarıyla kaydedildi!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ Lütfen geçerli bir API anahtarı girin
          </div>
        )}
        {saveStatus === 'cleared' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
            🗑️ API anahtarı temizlendi
          </div>
        )}
      </div>

      {/* How to Get API Key */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">{guide.title}</h3>
        </div>

        <ol className="space-y-2 text-gray-700">
          {guide.steps.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="font-bold">{index + 1}.</span>
              <span>{step.replace(/^\d+\.\s/, '')}</span>
            </li>
          ))}
        </ol>

        <div className="pt-4 border-t">
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            API Anahtarı Al (Ücretsiz)
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
            <strong>Limitler:</strong> {guide.note}
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <strong>🔒 Güvenlik:</strong> {guide.security}
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900">🔒 Gizlilik</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• API anahtarınız <strong>sadece tarayıcınızda</strong> saklanır</li>
          <li>• Sunucularımıza <strong>gönderilmez</strong></li>
          <li>• Gemini API'ye direkt sizin tarayıcınızdan bağlanılır</li>
          <li>• API anahtarınızı kimseyle <strong>paylaşmayın</strong></li>
        </ul>
      </div>
    </div>
  );
}
