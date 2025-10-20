import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.gif";

export default function Home() {
  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Background fullscreen */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />

      {/* Overlay gradasi hitam transparan */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 backdrop-blur-[2px]" />

      {/* Navbar transparan */}
      <nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-black/40">
        <div className="text-white text-2xl font-bold tracking-wide">Analisis Komentar</div>
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-all duration-300"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-white/80 hover:text-white transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="text-white/80 hover:text-white transition-all duration-300"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Efek cahaya lembut di tengah */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-blue-500/20 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Konten utama */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wider drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          WELCOME TO <span className="text-blue-400">ANALISIS KOMENTAR</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Temukan pola opini mahasiswa dengan mudah! Sistem ini menganalisis komentar dosen menggunakan teknologi data mining, 
          sehingga admin bisa mengambil keputusan lebih tepat.
        </motion.p>

        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <Link
            to="/login"
            className="px-10 py-3 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="px-10 py-3 rounded-lg border border-white/70 hover:bg-white hover:text-black font-semibold text-lg shadow-lg transition-all duration-300"
          >
            Dashboard
          </Link>
        </motion.div>
      </motion.div>

      {/* Shadow fade di pinggir layar */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/80" />
    </motion.div>
  );
}
