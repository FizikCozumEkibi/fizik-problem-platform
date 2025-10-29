import { useState, useRef, useEffect } from 'react';
import { Camera, FileText, Loader2, Upload, X, Sparkles, Settings, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import SolutionDisplay from '../components/SolutionDisplay';
import { solvePhysicsProblem, hasGeminiApiKey } from '../services/geminiSolver';

export default function Solver() {
  const [mode, setMode] = useState('text');
  const [level, setLevel] = useState('TYT');
  const [problemText, setProblemText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // API key kontrolü
    const hasKey = hasGeminiApiKey();
    setShowApiKeyWarning(!hasKey);
    console.log('📊 Solver yüklendi - API key:', hasKey ? 'Var ✅' : 'Yok ❌');
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const processImageWithOCR = async () => {
    if (!imageFile) return;

    setIsProcessing(true);
    setOcrProgress(0);
    setError(null);

    try {
      const worker = await createWorker('tur', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(imageFile);
      await worker.terminate();

      if (!text.trim()) {
        throw new Error('Resimden metin çıkarılamadı');
      }

      setProblemText(text);
      await solveProblem(text);
    } catch (err) {
      setError('OCR işlemi başarısız: ' + err.message);
      setIsProcessing(false);
    }
  };

  const solveProblem = async (text = problemText) => {
    if (!text.trim()) {
      setError('Lütfen bir problem girin');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // DIREKT GEMINI API - Netlify Functions kullanmadan!
      const solutionData = await solvePhysicsProblem(text, level);
      setSolution(solutionData);
      
      // API key kontrolü yap ve uyarıyı güncelle
      const hasKey = hasGeminiApiKey();
      setShowApiKeyWarning(!hasKey);
    } catch (err) {
      setError('Çözüm oluşturulurken hata oluştu: ' + (err.message || ''));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setProblemText('');
    setImageFile(null);
    setImagePreview(null);
    setSolution(null);
    setError(null);
    setOcrProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Fizik Problem Çözücü</h1>
        <p className="text-gray-600">Probleminizi yazın veya fotoğrafını yükleyin</p>
      </div>

      {/* API Key Uyarısı */}
      {showApiKeyWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-yellow-800 font-semibold">⚠️ Gemini API Anahtarı Gerekli</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Detaylı çözümler için Gemini API anahtarınızı ayarlara eklemeniz gerekiyor.
                Şu an sadece basit hesaplamalar yapılacak.
              </p>
              <Link 
                to="/settings" 
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                Ayarlara Git ve API Key Ekle (Ücretsiz)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center space-x-3 p-4 rounded-lg border-2 transition-all ${
              mode === 'text'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Metin ile Giriş</span>
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex-1 flex items-center justify-center space-x-3 p-4 rounded-lg border-2 transition-all ${
              mode === 'image'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">Fotoğraf ile Giriş</span>
          </button>
        </div>

        {/* Level Selection */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Seviye:</span>
          <div className="flex space-x-2">
            {['TYT', 'AYT'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  level === lvl
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Mode */}
        {mode === 'text' && (
          <div className="space-y-4">
            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Fizik probleminizi buraya yazın..."
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
            />
            <button
              onClick={() => solveProblem()}
              disabled={isProcessing || !problemText.trim()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Çözümü Göster</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Image Input Mode */}
        {mode === 'image' && (
          <div className="space-y-4">
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-600 transition-all"
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium mb-2">Problem fotoğrafı yükleyin</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 10MB)</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Problem"
                  className="w-full rounded-lg border-2 border-gray-300"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setProblemText('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {imagePreview && (
              <>
                {ocrProgress > 0 && ocrProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>OCR İşleniyor...</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={processImageWithOCR}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Çözümü Göster</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Solution Display */}
      {solution && (
        <div className="animate-fadeIn">
          <SolutionDisplay solution={solution} problemText={problemText} />
        </div>
      )}
    </div>
  );
}
