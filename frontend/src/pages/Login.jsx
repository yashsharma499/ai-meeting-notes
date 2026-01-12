import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "../api/authApi";
import { Loader2, Lock, Mail, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  // User Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Rate Limiting & Lockout
  const [attempts, setAttempts] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [locked, setLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);

  useEffect(() => {
    if (!locked) return;
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setLocked(false);
          setAttempts(0);
          setClicks([]);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [locked]);

  const handleLogin = async () => {
    setError("");
    if (locked) return;

    const now = Date.now();
    const filtered = clicks.filter(ts => now - ts < 1000);
    filtered.push(now);
    setClicks(filtered);

    if (filtered.length >= 10) {
      setLocked(true);
      setError("Too many clicks! Try again later.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError("Invalid email or password");
      if (attempts + 1 >= 3) {
        setLocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden px-6">
      
      {/* Background Animation Blobs (Matching Main Page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xs">MS</span>
            </div>
            <span className="text-gray-200 font-bold tracking-tight">MeetSync</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Welcome <span className="text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">Back</span>
            </h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access your insights</p>
          </div>

          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1 flex items-center gap-2">
                <Mail size={14} /> EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1 flex items-center gap-2">
                <Lock size={14} /> PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleLogin}
              disabled={loading || locked}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-indigo-500/20 ${
                locked || loading 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : locked ? (
                `Locked (${remainingTime}s)`
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </motion.button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              New to the platform?{" "}
              <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
