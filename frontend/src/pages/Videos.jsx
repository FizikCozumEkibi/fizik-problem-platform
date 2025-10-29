import { useState, useEffect } from 'react';
import { Search, Play, Clock, Eye, Filter } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic !== 'all') {
      loadVideosByTopic(selectedTopic);
    }
  }, [selectedTopic]);

  const loadTopics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/topics`);
      setTopics(response.data.topics);
      setLoading(false);
    } catch (error) {
      console.error('Topics load error:', error);
      setLoading(false);
    }
  };

  const loadVideosByTopic = async (topic) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/topic/${topic}`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Videos load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Video Eğitimler</h1>
        <p className="text-gray-600">Fizik konularını video ile öğrenin</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Video ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTopic === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tüm Konular
          </button>
          {topics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => setSelectedTopic(topic.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTopic === topic.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {topic.name} ({topic.videoCount})
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Seviye:</span>
          <div className="flex space-x-2">
            {['all', 'TYT', 'AYT'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedDifficulty === level
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'Tümü' : level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Videolar yükleniyor...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-600">Video bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    video.difficulty === 'TYT'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {video.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{video.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                src={selectedVideo.url}
                className="w-full h-full"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  selectedVideo.difficulty === 'TYT'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {selectedVideo.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedVideo.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{selectedVideo.views.toLocaleString()} görüntülenme</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
