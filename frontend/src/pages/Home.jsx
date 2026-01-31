import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { googleLogin } from '../api/auth';

export default function Home() {
  const { user, setUserFromAuth } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await googleLogin(credentialResponse.credential);
      setUserFromAuth(data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <Link to="/" className="text-xl font-display font-bold text-white tracking-tight">
          AI Code Review
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan font-medium hover:bg-accent-cyan/30 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-accent-cyan text-dark-900 font-semibold hover:bg-accent-cyan/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 animate-fade-in">
          Get AI-Powered
          <span className="block text-accent-cyan mt-2">Code Reviews</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10 animate-slide-up">
          Paste your code, choose a language, and receive expert-level feedback on quality, bugs, performance, and security—powered by Gemini AI.
        </p>

        {!user ? (
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-accent-cyan text-dark-900 font-semibold hover:bg-accent-cyan/90 transition-all hover:scale-105"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-dark-500 text-gray-300 hover:border-accent-cyan/50 hover:text-white transition-all"
            >
              Login
            </Link>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <div className="[&>div]:!rounded-xl">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => alert('Google sign-in failed')}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-xl bg-accent-cyan text-dark-900 font-semibold hover:bg-accent-cyan/90 transition-all hover:scale-105 animate-slide-up"
          >
            Go to Dashboard
          </Link>
        )}
      </main>
    </div>
  );
}
