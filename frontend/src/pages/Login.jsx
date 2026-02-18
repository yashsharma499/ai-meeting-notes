import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "../api/authApi";
import {
  Loader2,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    const filtered = clicks.filter((ts) => now - ts < 1000);
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
      
      const accessToken = res.data.access_token;

if (!accessToken) {
  setError("Login failed. Please try again.");
  return;
}

localStorage.setItem("access_token", accessToken);
localStorage.setItem("refresh_token", res.data.refresh_token);
localStorage.setItem("user", JSON.stringify(res.data.user));

navigate("/");
    } catch (err) {
      setAttempts((prev) => prev + 1);
      setError("Invalid email or password");
      if (attempts + 1 >= 3) setLocked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#02020a] overflow-hidden px-6">
      {/* ================= HIGH-VISIBILITY DYNAMIC BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Indigo Blob - LARGE & FAST */}
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-50, 150, -50],
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[100%] h-[100%] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-color-dodge"
        />

        {/* Deep Purple Blob - LARGE & FAST */}
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [150, -50, 150],
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[120%] h-[120%] rounded-full bg-purple-800/25 blur-[140px] mix-blend-color-dodge"
        />

        {/* Dynamic Center Pulse */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_60%)]"
        />
      </div>

      {/* ================= LOGIN UI ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] mb-4">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h2 className="text-white font-bold text-2xl tracking-tight">
            MeetSync
          </h2>
        </div>

        {/* The Card */}
        <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Back
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Log in to sync your workflow
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-14 bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2"
                >
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading || locked}
              className={`w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                locked || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 hover:brightness-110"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : locked ? (
                `Locked (${remainingTime}s)`
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
