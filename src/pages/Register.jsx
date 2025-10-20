import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await axios.post("http://localhost:8000/api/mahasiswa/register", {
      nim,
      nama,
      prodi,
      password,
    });

    // simpan data & token
    localStorage.setItem("mahasiswa", JSON.stringify(res.data.data));
    localStorage.setItem("token_mahasiswa", res.data.token);

    setSuccess("Registrasi berhasil! Mengalihkan ke dashboard...");
    setTimeout(() => navigate("/mahasiswa/dashboard"), 1500); 
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Registrasi gagal");
  }
};


  return (
    <motion.div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Daftar Mahasiswa</h1>

        {error && <div className="bg-red-500/20 text-red-300 text-center py-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-500/20 text-green-300 text-center py-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Prodi"
            value={prodi}
            onChange={(e) => setProdi(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Daftar
          </motion.button>
        </form>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">Masuk di sini</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
