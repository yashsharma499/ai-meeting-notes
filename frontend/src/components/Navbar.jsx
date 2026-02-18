import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  Upload,
  ListChecks,
  Archive,
  LogOut,
  LogIn,
  UserPlus,
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ✅ FIX: use correct token key */
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ✅ FIX: clear correct keys */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Upload Meeting", path: "/", icon: Upload },
    { name: "Action Items", path: "/actions", icon: ListChecks },
    { name: "Meeting History", path: "/history", icon: Archive },
  ];

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    return path !== "/" && pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* BRAND LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-2xl font-black tracking-tighter text-white"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg border border-white/20">
              <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <span className="hidden sm:block uppercase tracking-[0.1em]">
            Meet<span className="text-indigo-400">Sync</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-1 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 ${
                isActive(link.path) ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <link.icon
                  size={16}
                  className={isActive(link.path) ? "text-white" : "text-gray-500"}
                />
                {link.name}
              </span>
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* DESKTOP AUTH SECTION */}
        <div className="hidden md:flex items-center gap-4 ml-6">
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition flex items-center gap-2"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-white font-semibold bg-white/5 py-2 px-4 rounded-xl border border-white/10 backdrop-blur-md">
                <UserCircle size={20} className="text-indigo-400" />
                {user?.name || "User"}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-3 text-gray-400 hover:text-white bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full w-full bg-[#0a0a0c]/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-3">

              {token && (
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl text-white text-lg font-black">
                  <UserCircle size={24} className="text-indigo-400" />
                  {user?.name || "User"}
                </div>
              )}

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 p-5 rounded-[1.5rem] text-lg font-black ${
                      isActive(link.path)
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive(link.path) ? "bg-white/20" : "bg-white/5"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    {link.name}
                  </Link>
                );
              })}

              {!token ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-indigo-600 text-white text-lg font-black"
                  >
                    <LogIn size={20} />
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-green-600 text-white text-lg font-black"
                  >
                    <UserPlus size={20} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-red-600 text-white text-lg font-black"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
