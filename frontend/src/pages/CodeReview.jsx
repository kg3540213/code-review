import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../api/reviews';
import { getMyReviews } from '../api/reviews';

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
  const [showPrevious, setShowPrevious] = useState(false);
  const [previousReviews, setPreviousReviews] = useState([]);
  const [simpleView, setSimpleView] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');

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

  const loadPrevious = async () => {
    if (previousReviews.length) {
      setShowPrevious((s) => !s);
      return;
    }
    try {
      const { data } = await getMyReviews();
      setPreviousReviews(data || []);
      setShowPrevious(true);
    } catch (err) {
      setError('Unable to fetch previous reviews.');
    }
  };

  const getSimpleSummary = (text) => {
    if (!text) return '';
    // Try to extract a 'Summary' section if present
    const match = text.match(/summary[:\n\s]*([\s\S]{20,400}?)(?:\n\d\.|\n\n|$)/i);
    if (match) return match[1].trim();
    // Fallback: first 300 characters (end at sentence)
    const short = text.trim().slice(0, 400);
    const end = short.lastIndexOf('.');
    return (end > 50 ? short.slice(0, end + 1) : short) + (text.length > short.length ? '...' : '');
  };

  const renderAiResponse = (text) => {
    if (!text) return null;
    // Split by triple-backtick code blocks and render code blocks in monospace
    const parts = text.split(/```([a-zA-Z0-9+#\-]*)\n([\s\S]*?)```/g);
    // parts will be [before, lang1, code1, after, ...]
    const nodes = [];
    for (let i = 0; i < parts.length; ) {
      const before = parts[i++] || '';
      if (before) nodes.push(<div key={`t-${i}`} className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-300">{before}</div>);
      if (i < parts.length) {
        const lang = parts[i++];
        const codeBlock = parts[i++] || '';
        nodes.push(
          <pre key={`c-${i}`} className="my-4 p-4 rounded-lg bg-dark-700 overflow-x-auto text-sm font-mono text-green-200">
            <div className="text-xs text-gray-400 mb-2">{lang || language}</div>
            <code>{codeBlock.trim()}</code>
          </pre>
        );
      }
    }
    return nodes;
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
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSimpleView((s) => !s)}
                    className="px-3 py-1 rounded-md bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
                  >
                    {simpleView ? 'Show full' : 'Simplify'}
                  </button>
                  <button
                    onClick={loadPrevious}
                    className="px-3 py-1 rounded-md bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
                  >
                    {showPrevious ? 'Hide previous' : 'Show my previous reviews'}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(code || result?.code || '');
                        setCopyMsg('Code copied');
                        setTimeout(() => setCopyMsg(''), 2000);
                      } catch (e) {
                        setCopyMsg('Copy failed');
                        setTimeout(() => setCopyMsg(''), 2000);
                      }
                    }}
                    className="px-3 py-1 rounded-md bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
                  >
                    Copy code
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(result?.aiResponse || '');
                        setCopyMsg('Review copied');
                        setTimeout(() => setCopyMsg(''), 2000);
                      } catch (e) {
                        setCopyMsg('Copy failed');
                        setTimeout(() => setCopyMsg(''), 2000);
                      }
                    }}
                    className="px-3 py-1 rounded-md bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
                  >
                    Copy review
                  </button>
                </div>
                <div className="text-xs text-gray-400">{new Date(result.createdAt || Date.now()).toLocaleString()}</div>
              </div>
              {copyMsg && <div className="text-sm text-green-400 mb-3">{copyMsg}</div>}

              {simpleView ? (
                <div className="text-gray-300 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                  {getSimpleSummary(result.aiResponse)}
                </div>
              ) : (
                <div>{renderAiResponse(result.aiResponse)}</div>
              )}
            </div>
          </div>
        )}

        {showPrevious && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Your previous reviews</h3>
            <div className="grid gap-3">
              {previousReviews.length === 0 && <div className="text-sm text-gray-400">No reviews found.</div>}
              {previousReviews.map((r) => (
                <button
                  key={r._id}
                  onClick={() => {
                    setResult(r);
                    setSimpleView(false);
                    setShowPrevious(false);
                    setCode(r.code || '');
                    setLanguage(r.language || language);
                  }}
                  className="text-left p-3 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600"
                >
                  <div className="text-sm text-gray-200 font-medium">{r.language} review · {new Date(r.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-400 truncate">{(r.aiResponse || '').slice(0, 140)}{(r.aiResponse || '').length > 140 ? '...' : ''}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
