import { useState, useEffect } from 'react';
import { Search, BookOpen, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Formulas() {
  const [formulas, setFormulas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadCategories();
    loadAllFormulas();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/formulas/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Categories load error:', error);
    }
  };

  const loadAllFormulas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/formulas/all`);
      setFormulas(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Formulas load error:', error);
      setLoading(false);
    }
  };

  const copyFormula = (formula, id) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFormulas = formulas.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.topic === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      topic.formulas.some(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Formül Kütüphanesi</h1>
        <p className="text-gray-600">TYT-AYT Fizik Formülleri</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Formül ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tüm Kategoriler
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Formüller yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFormulas.map((topicData) => {
            const filteredTopicFormulas = searchQuery === '' 
              ? topicData.formulas 
              : topicData.formulas.filter(f =>
                  f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

            if (filteredTopicFormulas.length === 0) return null;

            return (
              <div key={topicData.topic} className="space-y-4">
                {/* Topic Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{topicData.topic}</h2>
                    <p className="text-sm text-gray-600">{topicData.category}</p>
                  </div>
                </div>

                {/* Formulas Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredTopicFormulas.map((formula) => (
                    <div
                      key={formula.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">{formula.name}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            formula.difficulty === 'TYT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {formula.difficulty}
                          </span>
                          <button
                            onClick={() => copyFormula(formula.formula, formula.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            title="Formülü kopyala"
                          >
                            {copiedId === formula.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Formula - Türkçe */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-2">
                        <div className="text-sm text-gray-600 mb-1">Türkçe:</div>
                        <div className="text-base font-semibold text-gray-900">
                          {formula.formula}
                        </div>
                      </div>

                      {/* Formula - Matematiksel */}
                      {formula.mathFormula && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-3">
                          <div className="text-sm text-gray-600 mb-1">Matematiksel:</div>
                          <code className="text-xl font-mono text-gray-900 block">
                            {formula.mathFormula}
                          </code>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-2">{formula.description}</p>

                      {/* Explanation */}
                      {formula.explanation && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                          <p className="text-xs text-gray-700">{formula.explanation}</p>
                        </div>
                      )}

                      {/* Units */}
                      {formula.units && (
                        <div className="border-t pt-3">
                          <div className="text-xs font-medium text-gray-700 mb-2">Birimler:</div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(formula.units).map(([symbol, unit]) => (
                              <span
                                key={symbol}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                <span className="font-mono font-semibold">{symbol}</span>: {unit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredFormulas.every(topic => 
            topic.formulas.filter(f =>
              searchQuery === '' ||
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0
          ) && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">Formül bulunamadı</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
