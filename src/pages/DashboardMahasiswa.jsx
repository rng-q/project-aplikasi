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

  // Ambil komentar milik mahasiswa sendiri
  const fetchKomentar = async () => {
    if (!mahasiswa) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/mahasiswa/komentar", {
      params: { mahasiswa_id: mahasiswa.id },
      });


      // urutkan komentar terbaru di atas
      const sortedKomentar = (res.data.data || []).sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );
      setKomentarList(sortedKomentar);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hapus komentar milik sendiri
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

      {/* Konten */}
      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-8 tracking-wider drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        >
          DASHBOARD <span className="text-blue-400">MAHASISWA</span>
        </motion.h1>

        {/* Tombol aksi */}
        <div className="mt-10 flex gap-6">
          <Link
            to="/mahasiswa/komentar"
            className="px-10 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg transition-all duration-300"
          >
            Tambah Komentar
          </Link>
          <button
            onClick={fetchKomentar}
            className="px-10 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-lg shadow-lg transition-all duration-300"
          >
            {loading ? "Memuat..." : "Lihat Komentar"}
          </button>
        </div>

        {/* Tabel komentar */}
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/30">
          {loading ? (
            <div className="text-gray-400 py-10 animate-pulse">Mengambil data komentar...</div>
          ) : komentarList.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Nama</th>
                  <th className="py-2 px-4">Komentar</th>
                  <th className="py-2 px-4">Tanggal</th>
                  {/* <th className="py-2 px-4">Analisis</th> */}
                  <th className="py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {komentarList.map((k) => (
                  <tr key={k.id} className="border-b border-gray-700 hover:bg-white/10 transition-all">
                    <td className="py-2 px-4">{k.id}</td>
                    <td className="py-2 px-4">{k.mahasiswa?.nama || "-"}</td>
                    <td className="py-2 px-4">{k.komentar}</td>
                    <td className="py-2 px-4 text-sm text-gray-400">
                      {new Date(k.tanggal).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    {/* <td className="py-2 px-4">{k.analisis_sentimen?.kategori || "-"}</td> */}
                    <td className="py-2 px-4">
                      <button
                        onClick={() => hapusKomentar(k.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white transition"
                      >
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
        </div>
      </motion.div>
    </motion.div>
  );
}
