import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 50 }) {
  return (
    <div className="flex flex-col justify-center items-center py-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        
        {/* OUTER GLOW LAYER */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-indigo-500 rounded-full blur-xl"
        />

        {/* SPINNING GRADIENT RING */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "#6366f1", // Indigo-500
            borderRightColor: "#a855f7", // Purple-500
            width: size,
            height: size,
          }}
        />

        {/* CORE PULSING DOT */}
        <motion.div
          animate={{
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
        />
      </div>
      
      {/* OPTIONAL STATUS TEXT */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/70"
      >
        Processing
      </motion.span>
    </div>
  );
}