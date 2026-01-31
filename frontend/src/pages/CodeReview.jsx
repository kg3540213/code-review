import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../api/reviews';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML/CSS', 'Other',
];

export default function CodeReview() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout, fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!code.trim()) {
      setError('Please paste some code.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await createReview(code.trim(), language);
      setResult(data);
      await fetchUser(); // refresh review count
    } catch (err) {
      setError(err.response?.data?.message || 'Review failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-accent-emerald/5 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative z-10 border-b border-dark-700 bg-dark-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-display font-bold text-white">
            AI Code Review
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg border border-dark-500 text-gray-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-white mb-6">New code review</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Paste your code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or type your source code here..."
              rows={14}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan font-mono text-sm resize-y min-h-[280px]"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-accent-cyan text-dark-900 font-semibold hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze code'
            )}
          </button>
        </form>

        {result && (
          <div className="mt-10 animate-slide-up">
            <h2 className="text-xl font-display font-semibold text-accent-cyan mb-4">AI review</h2>
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 overflow-hidden">
              <div className="text-gray-300 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                {result.aiResponse}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
