import { useState } from 'react';
import { Volume2, Video, BookOpen, ChevronRight, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function SolutionDisplay({ solution, problemText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakSolution = () => {
    if ('speechSynthesis' in window) {
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      const turkishVoice = voices.find(voice => 
        voice.lang.startsWith('tr') || voice.lang.includes('TR')
      );

      // Create detailed narration
      let narration = `Problem: ${problemText}. `;
      narration += `Bu ${solution.topic} konusuna ait bir ${solution.level} sorusudur. `;
      narration += `Şimdi adım adım çözelim. `;
      
      solution.steps.forEach((step, index) => {
        narration += `${index + 1}. Adım: ${step.title}. ${step.content}. `;
      });
      
      if (solution.result) {
        narration += `Sonuç: ${solution.result}`;
      }

      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.85; // Daha yavaş ve anlaşılır
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Maksimum ses
      
      if (turkishVoice) {
        utterance.voice = turkishVoice; // Türkçe ses kullan
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tarayıcınız sesli anlatımı desteklemiyor');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'analysis': return '📊';
      case 'identification': return '🎯';
      case 'formula': return '📐';
      case 'calculation': return '🧮';
      case 'verification': return '✅';
      default: return '📝';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Çözüm</h2>
          <div className="flex items-center space-x-3 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {solution.topic}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {solution.level}
            </span>
            {solution.fromCache && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Cache
              </span>
            )}
          </div>
        </div>
        <button
          onClick={isSpeaking ? stopSpeaking : speakSolution}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isSpeaking
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
          <span>{isSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
        </button>
      </div>

      {/* Problem Statement */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
        <h3 className="font-semibold text-blue-900 mb-2">Problem:</h3>
        <p className="text-gray-700">{problemText}</p>
      </div>

      {/* Explanation */}
      {solution.explanation && (
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Açıklama</h3>
              <p className="text-gray-700">{solution.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <ChevronRight className="w-5 h-5 text-blue-600" />
          <span>Çözüm Adımları</span>
        </h3>
        {solution.steps.map((step, index) => (
          <div
            key={index}
            className="bg-gray-50 p-5 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{getStepIcon(step.type)}</span>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                </div>
                <p className="text-gray-700">{step.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulas */}
      {solution.formulas && solution.formulas.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Kullanılan Formüller</span>
          </h3>
          <div className="space-y-3">
            {solution.formulas.map((formula, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold text-gray-900 mb-1">{formula.name}</div>
                <div className="formula text-lg mb-2">{formula.formula}</div>
                <div className="text-sm text-gray-600">{formula.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {solution.result && (
        <div className="bg-green-50 p-5 rounded-lg border-2 border-green-600">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Sonuç</h3>
              <p className="text-gray-700">{solution.result}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related Topics */}
      {solution.relatedTopics && solution.relatedTopics.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">İlgili Konular</h3>
          <div className="flex flex-wrap gap-2">
            {solution.relatedTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-all"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Video Suggestion */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Bu konuyu daha iyi anlamak ister misiniz?</span>
            </h3>
            <p className="text-sm opacity-90">
              {solution.topic} konusuna ait video eğitimleri izleyin
            </p>
          </div>
          <a
            href={`/videos?topic=${encodeURIComponent(solution.topic)}`}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Videoları İzle
          </a>
        </div>
      </div>
    </div>
  );
}
