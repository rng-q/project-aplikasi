import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import heroImage from "../assets/dashboard.gif";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil komentar dari API pakai token_admin
  const fetchKomentar = async () => {
    const token = localStorage.getItem("token_admin");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get("http://localhost:8000/api/admin/komentar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data komentar:", res.data.data);
      setKomentarList(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
      if (err.response?.status === 401) {
        alert("Sesi login admin telah habis. Silakan login ulang.");
        localStorage.removeItem("token_admin");
        localStorage.removeItem("admin");
        navigate("/login");
      } else {
        setError("Gagal memuat komentar. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout admin
  const handleLogout = async () => {
    const token = localStorage.getItem("token_admin");
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.warn("Gagal logout:", err);
    } finally {
      localStorage.removeItem("token_admin");
      localStorage.removeItem("admin");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchKomentar();
  }, []);

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

  // Fungsi bantu untuk ubah tanggal
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-"; // kalau invalid date
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
        <div className="text-white text-2xl font-bold tracking-wide">
          Dashboard Admin
        </div>
        <div className="flex gap-6">
          <button
            onClick={fetchKomentar}
            className="text-white/80 hover:text-white transition-all duration-300"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="text-red-400 font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Efek cahaya */}
      <motion.div
        className="absolute w-[900px] h-[900px] bg-red-500/25 blur-[180px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
          className="text-5xl md:text-6xl font-extrabold mb-8 tracking-wider drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
        >
          DASHBOARD <span className="text-red-400">ADMIN</span>
        </motion.h1>

        {error && <div className="text-red-400 mt-4">{error}</div>}

        {/* Tabel komentar */}
        <motion.div
          variants={itemVariant}
          className="overflow-x-auto max-h-[400px] overflow-y-auto mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/30"
        >
          {loading ? (
            <div className="text-gray-400 py-10 animate-pulse">
              Mengambil data komentar...
            </div>
          ) : komentarList.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Mahasiswa</th>
                  <th className="py-2 px-4">Komentar</th>
                  <th className="py-2 px-4">Kategori</th>
                  <th className="py-2 px-4">Skor</th>
                  <th className="py-2 px-4">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {komentarList.map((k) => {
                  console.log("created_at:", k.created_at);
                  return (
                    <tr
                      key={k.id}
                      className="border-b border-gray-700 hover:bg-white/10 transition-all"
                    >
                      <td className="py-2 px-4">{k.id}</td>
                      <td className="py-2 px-4">{k.mahasiswa?.nama || "-"}</td>
                      <td className="py-2 px-4">{k.komentar}</td>
                      <td className="py-2 px-4">
                        {k.analisis_sentimen?.kategori || "-"}
                      </td>
                      <td className="py-2 px-4">
                        {k.analisis_sentimen?.skor ?? "-"}
                      </td>
                     <td className="py-2 px-4">
                      {formatTanggal(k.tanggal)}
                    </td>

                    </tr>
                  );
                })}
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
