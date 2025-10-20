import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import heroImage from "../assets/dashboardmhs.gif";

export default function DashboardMahasiswa() {
  const navigate = useNavigate();
  const mahasiswa = JSON.parse(localStorage.getItem("mahasiswa"));
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil komentar dari API
  const fetchKomentar = async () => {
    if (!mahasiswa) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/mahasiswa/komentar", {
        params: { mahasiswa_id: mahasiswa.id },
      });
      setKomentarList(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hapus komentar
  const hapusKomentar = async (id) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/mahasiswa/komentar/${id}`);
      setKomentarList((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
      alert("Gagal menghapus komentar.");
    }
  };

  useEffect(() => {
    if (!mahasiswa) return navigate("/login");
    fetchKomentar();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mahasiswa");
    navigate("/login");
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };
  const itemVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

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
        <div className="text-white text-2xl font-bold tracking-wide">Dashboard Mahasiswa</div>
        <div className="flex gap-6">
          <Link to="/" className="text-white/80 hover:text-white transition-all duration-300">Home</Link>
          <button onClick={handleLogout} className="text-red-400 font-semibold">Logout</button>
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
          DASHBOARD <span className="text-blue-400">MAHASISWA</span>
        </motion.h1>

        {/* Tombol aksi */}
        <motion.div variants={itemVariant} className="mt-14 flex gap-6">
          <Link to="/mahasiswa/komentar" className="px-10 py-3 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
            Tambah Komentar
          </Link>
          <button onClick={fetchKomentar} className="px-10 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-lg shadow-lg transition-all duration-300">
            {loading ? "Memuat..." : "Lihat Komentar"}
          </button>
        </motion.div>

        {/* Tabel komentar */}
        <motion.div variants={itemVariant} className="overflow-x-auto max-h-[400px] overflow-y-auto mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/30">
          {loading ? (
            <div className="text-gray-400 py-10 animate-pulse">Mengambil data komentar...</div>
          ) : komentarList.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Nama Mahasiswa</th>
                  <th className="py-2 px-4">Komentar</th>
                  <th className="py-2 px-4">Tanggal</th>
                  <th className="py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {komentarList.map((k) => (
                  <tr key={k.id} className="border-b border-gray-700 hover:bg-white/10 transition-all">
                    <td className="py-2 px-4">{k.id}</td>
                    <td className="py-2 px-4">{k.mahasiswa?.nama || k.mahasiswa_id}</td>
                    <td className="py-2 px-4">{k.komentar}</td>
                    <td className="py-2 px-4">{k.tanggal}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => hapusKomentar(k.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white transition">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-400 py-10">Belum ada komentar.</div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
