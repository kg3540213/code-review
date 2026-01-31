import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReviews } from '../api/reviews';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showPrev, setShowPrev] = useState(false);
  const [previousReviews, setPreviousReviews] = useState([]);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const loadPrevious = async () => {
    if (previousReviews.length) {
      setShowPrev((s) => !s);
      return;
    }
    setLoadingPrev(true);
    try {
      const { data } = await getMyReviews();
      setPreviousReviews(data || []);
      setShowPrev(true);
    } catch (err) {
      // silently fail; better UX would show an error toast
      setPreviousReviews([]);
      setShowPrev(true);
    } finally {
      setLoadingPrev(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative z-10 border-b border-dark-700 bg-dark-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-display font-bold text-white">
            AI Code Review
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:inline">{user?.email}</span>
            <Link
              to="/review"
              className="px-4 py-2 rounded-lg bg-accent-cyan text-dark-900 font-semibold hover:bg-accent-cyan/90 transition-colors"
            >
              New review
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

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-display font-bold text-white mb-2 animate-fade-in">
          Hello, {user?.name || 'Developer'}
        </h1>
        <p className="text-gray-400 mb-10 animate-fade-in">Here's your code review overview.</p>

        <div className="grid gap-6 sm:grid-cols-2 animate-slide-up">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-accent-cyan/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-lg font-semibold text-white">Total reviews</h2>
            </div>
            <p className="text-4xl font-bold text-accent-cyan">{user?.reviewsCount ?? 0}</p>
            <p className="text-gray-500 text-sm mt-1">Code reviews completed</p>
          </div>

          <Link
            to="/review"
            className="block bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-accent-emerald/30 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/20 flex items-center justify-center group-hover:bg-accent-emerald/30 transition-colors">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-lg font-semibold text-white">New code review</h2>
            </div>
            <p className="text-gray-400 text-sm">Paste your code and get AI-powered feedback.</p>
            <span className="inline-block mt-3 text-accent-emerald font-medium group-hover:underline">
              Start review →
            </span>
          </Link>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 hover:border-accent-cyan/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/20 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="text-lg font-semibold text-white">My previous reviews</h2>
            </div>
            <p className="text-gray-400 text-sm">View recent AI reviews you've run.</p>
            <div className="mt-4">
              <button
                onClick={loadPrevious}
                className="px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
              >
                {loadingPrev ? 'Loading...' : showPrev ? 'Hide reviews' : 'Show my reviews'}
              </button>
            </div>

            {showPrev && (
              <div className="mt-4 grid gap-2">
                {previousReviews.length === 0 && !loadingPrev && (
                  <div className="text-sm text-gray-400">No previous reviews found.</div>
                )}
                {previousReviews.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => setSelectedReview(r)}
                    className="text-left p-3 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600"
                  >
                    <div className="text-sm text-gray-200 font-medium">{r.language} · {new Date(r.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-400 truncate">{(r.aiResponse || '').slice(0, 120)}{(r.aiResponse || '').length > 120 ? '...' : ''}</div>
                  </button>
                ))}
                {selectedReview && (
                  <div className="mt-3 p-3 rounded-lg bg-dark-800 border border-dark-600">
                    <div className="text-sm text-gray-200 font-medium mb-2">Selected review · {new Date(selectedReview.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap break-words">{selectedReview.aiResponse}</div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/review"
                        className="px-3 py-1 rounded-md bg-accent-cyan text-dark-900 font-medium"
                      >
                        Open in reviewer
                      </Link>
                      <button
                        onClick={() => navigator.clipboard?.writeText(selectedReview.code || '')}
                        className="px-3 py-1 rounded-md bg-dark-700 border border-dark-600 text-sm text-gray-200 hover:bg-dark-600"
                      >
                        Copy code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
