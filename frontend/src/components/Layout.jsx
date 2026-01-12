import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c]">
      {/* The Navbar stays fixed at the top */}
      <Navbar />
      
      {/* pt-24 (96px) handles the height of the navbar on mobile
         md:pt-32 (128px) gives extra breathing room for the modern desktop header 
      */}
      <main className="relative z-0 pt-24 md:pt-32 px-4 pb-20 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}