import { Link } from 'react-router-dom';
import { Camera, FileText, Zap, Video, Volume2, BookOpen, TrendingUp } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: 'Metin ile Giriş',
      description: 'Fizik probleminizi yazarak çözün'
    },
    {
      icon: Camera,
      title: 'Fotoğraf ile Giriş',
      description: 'Problem fotoğrafını yükleyin, OCR ile otomatik okuma'
    },
    {
      icon: Zap,
      title: 'Yapay Zeka Çözüm',
      description: 'Hybrid AI sistemi ile %95+ doğruluk oranı'
    },
    {
      icon: TrendingUp,
      title: 'Adım Adım Açıklama',
      description: 'Her adımı detaylı şekilde öğrenin'
    },
    {
      icon: Volume2,
      title: 'Sesli Anlatım',
      description: 'TTS ile Türkçe sesli çözüm dinleyin'
    },
    {
      icon: Video,
      title: 'Video Eğitimler',
      description: 'Konu anlatımlı video kütüphanesi'
    },
    {
      icon: BookOpen,
      title: 'Formül Kütüphanesi',
      description: 'Tüm fizik formüllerine hızlı erişim'
    },
    {
      icon: Zap,
      title: 'API Key Gereksiz',
      description: 'Açık kaynak modeller ile ücretsiz kullanım'
    }
  ];

  const topics = [
    { name: 'Kinematik', color: 'from-blue-500 to-blue-600', count: 45 },
    { name: 'Dinamik', color: 'from-purple-500 to-purple-600', count: 38 },
    { name: 'Enerji', color: 'from-green-500 to-green-600', count: 42 },
    { name: 'Elektrik', color: 'from-yellow-500 to-yellow-600', count: 51 },
    { name: 'Optik', color: 'from-pink-500 to-pink-600', count: 29 },
    { name: 'Dalgalar', color: 'from-indigo-500 to-indigo-600', count: 33 }
  ];

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
          🚀 TYT-AYT Fizik Çözüm Platformu
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Fizik Problemlerini
          <br />
          Yapay Zeka ile Çözün
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Metin veya fotoğraf ile problem gönderin, adım adım çözümleri sesli anlatım ve video eğitimlerle öğrenin.
          API Key gerektirmeden ücretsiz kullanın!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/solver"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Hemen Çözmeye Başla
          </Link>
          <Link
            to="/videos"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            Video Eğitimleri İzle
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-blue-600">95%+</div>
          <div className="text-sm text-gray-600 mt-2">Doğruluk Oranı</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-purple-600">238+</div>
          <div className="text-sm text-gray-600 mt-2">Çözülmüş Problem</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-green-600">45+</div>
          <div className="text-sm text-gray-600 mt-2">Video Eğitim</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-pink-600">100+</div>
          <div className="text-sm text-gray-600 mt-2">Formül</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Özellikler</h2>
          <p className="text-gray-600 mt-2">Platform size neler sunuyor?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Topics Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Konu Kapsamı</h2>
          <p className="text-gray-600 mt-2">TYT-AYT müfredatına uygun tüm konular</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topics.map((topic, index) => (
            <Link
              key={index}
              to="/solver"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center group hover:-translate-y-1"
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${topic.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-2xl font-bold text-white">{topic.count}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{topic.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{topic.count} Problem</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Hemen Başlayın!</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Fizik probleminizi girin, yapay zekanın size adım adım çözümü nasıl gösterdiğini görün.
          Sesli anlatım ve video eğitimlerle öğrenme deneyiminizi zenginleştirin.
        </p>
        <Link
          to="/solver"
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Problem Çöz
        </Link>
      </section>
    </div>
  );
}
