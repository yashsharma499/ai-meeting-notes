import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import MeetingUpload from "./pages/MeetingUpload";
import AISummary from "./pages/AISummary";
import ActionItemsDashboard from "./pages/ActionItemsDashboard";
import MeetingHistory from "./pages/MeetingHistory";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function RootLayout() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] selection:bg-indigo-500/30">
      <Navbar />

      <main className="relative z-0 pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES WITH LAYOUT */}
        <Route element={<RootLayout />}>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MeetingUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <AISummary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/actions"
            element={
              <ProtectedRoute>
                <ActionItemsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <MeetingHistory />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* 404 PAGE */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-9xl font-black text-indigo-500/20">404</h1>
                <p className="text-2xl font-bold text-white -mt-12">Page Not Found</p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
                >
                  Return Home
                </button>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
