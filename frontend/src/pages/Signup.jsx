

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signupUser } from "../api/authApi";
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let errorsTemp = {};
    if (!name.trim()) {
      errorsTemp.name = "Full name is required.";
    } else if (name.length < 3) {
      errorsTemp.name = "Name must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errorsTemp.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errorsTemp.email = "Enter a valid email.";
    }

    if (!password.trim()) {
      errorsTemp.password = "Password is required.";
    } else if (password.length < 6) {
      errorsTemp.password = "Password must be at least 6 characters.";
    }

    setErrors(errorsTemp);
    return Object.keys(errorsTemp).length === 0;
  };

  const handleSignup = async () => {
    setApiError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signupUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setApiError(err.response?.data?.message || "Signup failed. Try again.");
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
            y: [50, -150, 50],
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[100%] h-[100%] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-color-dodge"
        />
        
        {/* Deep Purple Blob - LARGE & FAST */}
        <motion.div 
          animate={{ 
            x: [100, -100, 100],
            y: [-150, 50, -150],
            scale: [1.2, 0.9, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[120%] h-[120%] rounded-full bg-purple-800/25 blur-[140px] mix-blend-color-dodge"
        />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* ================= SIGNUP UI ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] mb-4">
            <UserPlus size={24} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-2xl tracking-tight">MeetSync</h2>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Account</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Join the future of workspace sync</p>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 ml-1 flex items-center gap-2 uppercase">
                <User size={12} /> Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] ml-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 ml-1 flex items-center gap-2 uppercase">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
              {errors.email && <p className="text-red-400 text-[10px] ml-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 ml-1 flex items-center gap-2 uppercase">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
              {errors.password && <p className="text-red-400 text-[10px] ml-1">{errors.password}</p>}
            </div>

            {/* API Error Message */}
            <AnimatePresence mode="wait">
              {apiError && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={14} />
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Signup Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSignup}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-indigo-500/20 ${
                loading 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Get Started <ArrowRight size={18} /></>
              )}
            </motion.button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}