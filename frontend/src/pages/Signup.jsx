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
  ArrowRight 
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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden px-6">
      
      {/* Background Animation Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"
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
              <UserPlus size={16} className="text-white" />
            </div>
            <span className="text-gray-200 font-bold tracking-tight">MeetSync</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Join <span className="text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">MeetSync</span>
            </h1>
            <p className="text-gray-400 text-sm">Start turning meetings into action items</p>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 ml-1 flex items-center gap-2">
                <User size={14} /> FULL NAME
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
              {errors.name && <p className="text-red-400 text-[10px] ml-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 ml-1 flex items-center gap-2">
                <Mail size={14} /> EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
              {errors.email && <p className="text-red-400 text-[10px] ml-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
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
              {errors.password && <p className="text-red-400 text-[10px] ml-1">{errors.password}</p>}
            </div>

            {/* API Error Message */}
            <AnimatePresence>
              {apiError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
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
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
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