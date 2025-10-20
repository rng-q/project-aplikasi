import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import heroImage from "../assets/dashboard.gif";

export default function Dashboard() {
  const [komentarList, setKomentarList] = useState([]);
  const [loadingKomentar, setLoadingKomentar] = useState(false);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
a
  // Ambil komentar dari API
  const fetchKomentar = async () => {
    setLoadingKomentar(true);
    try {
      const res = await axios.get("/komentar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKomentarList(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
    } finally {
      setLoadingKomentar(false);
    }
  };

  useEffect(() => {
    fetchKomentar();
  }, []);

  // Hapus komentar
  const hapusKomentar = async (id) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await axios.delete(`/komentar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKomentarList((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
      alert("Gagal menghapus komentar.");
    }
  };

  // Filter komentar
  const filteredKomentar = komentarList.filter((k) =>
    filter === "all" ? true : k.analisisSentimen?.kategori === filter
  );

  // Statistik
  const totalKomentar = komentarList.length;
  const positif = komentarList.filter(k => k.analisis_sentimen?.kategori === "positif").length;
  const negatif = komentarList.filter(k => k.analisis_sentimen?.kategori === "negatif").length;

  const stats = [
    { title: "Komentar Masuk", value: totalKomentar },
    { title: "Komentar Positif", value: positif },
    { title: "Komentar Negatif", value: negatif },
  ];

  // Variants untuk animasi sekuensial
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Background */}
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
        transition={{ duration: 10, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-[3px]" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-black/40">
        <div className="text-white text-2xl font-bold tracking-wide">Analisis Komentar</div>
        <div className="flex gap-6">
          <Link to="/" className="text-white/80 hover:text-white transition-all duration-300">Home</Link>
          <Link to="/login" className="text-white/80 hover:text-white transition-all duration-300">Login</Link>
          <Link to="/dashboard" className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-1 transition-all duration-300">Dashboard</Link>
        </div>
      </nav>

      {/* Efek cahaya */}
      <motion.div
        className="absolute w-[900px] h-[900px] bg-blue-500/25 blur-[180px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Konten */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariant}
          className="text-5xl md:text-6xl font-extrabold mb-8 tracking-wider drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        >
          DASHBOARD <span className="text-blue-400">ANALISIS</span>
        </motion.h1>

        {/* Statistik */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4 max-w-6xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariant}
              className="bg-white/10 border border-blue-500/40 backdrop-blur-md rounded-2xl p-10 text-center shadow-lg hover:shadow-blue-400/30 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-300 uppercase text-sm tracking-widest mb-2">{s.title}</p>
              <h2 className="text-5xl font-bold text-blue-400">{s.value}</h2>
            </motion.div>
          ))}
        </motion.div>

        {/* Tombol aksi */}
        <motion.div variants={itemVariant} className="mt-14 flex gap-6">
          <Link to="/form-komentar" className="px-10 py-3 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300">Tambah Komentar</Link>
          <button onClick={fetchKomentar} className="px-10 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-lg shadow-lg transition-all duration-300">
            {loadingKomentar ? "Memuat..." : "Lihat Semua Komentar"}
          </button>
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} className="px-10 py-3 rounded-lg border border-white/70 hover:bg-white hover:text-black font-semibold text-lg shadow-lg transition-all duration-300">
            Logout
          </button>
        </motion.div>

        {/* Filter Sentimen */}
        {komentarList.length > 0 && (
          <motion.div variants={itemVariant} className="flex gap-3 mt-6">
            {["all", "positif", "negatif", "netral"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded ${filter === f ? "bg-blue-500 text-white" : "bg-white/20 text-white hover:bg-white/30"} transition`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </motion.div>
        )}

        {/* Tabel Komentar */}
        <motion.div variants={itemVariant} className="overflow-x-auto max-h-[400px] overflow-y-auto mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/30">
          {loadingKomentar ? (
            <div className="text-gray-400 py-10 animate-pulse">Mengambil data komentar...</div>
          ) : filteredKomentar.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Mahasiswa</th>
                  <th className="py-2 px-4">Komentar</th>
                  <th className="py-2 px-4">Sentimen</th>
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <motion.tbody layout>
                {filteredKomentar.map((k) => (
                  <motion.tr
                    key={k.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-b border-gray-700 hover:bg-white/10 transition-all"
                  >
                    <td className="py-2 px-4">{k.id}</td>
                    <td className="py-2 px-4">{k.mahasiswa?.nama || k.mahasiswa_id}</td>
                    <td className="py-2 px-4">{k.komentar}</td>
                   <td className={`py-2 px-4 font-semibold ${
                      k.analisis_sentimen?.kategori === "positif"
                        ? "text-green-400"
                        : k.analisis_sentimen?.kategori === "negatif"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}>
                      {k.analisis_sentimen?.kategori || "-"}
                    </td>

                    <td className="py-2 px-4">{k.tanggal}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => hapusKomentar(k.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white transition">
                        Hapus
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          ) : (
            <div className="text-gray-400 py-10">Belum ada komentar.</div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
