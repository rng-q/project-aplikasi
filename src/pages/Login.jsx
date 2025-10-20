import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import heroImage from "../assets/login.gif"; // bisa diganti

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("mahasiswa");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (role === "mahasiswa") {
        res = await axios.post("http://localhost:8000/api/login-mahasiswa", {
          nim: identifier,
          password,
        });
        localStorage.setItem("mahasiswa", JSON.stringify(res.data.data));
        localStorage.setItem("token_mahasiswa", res.data.token);
        navigate("/mahasiswa/dashboard");
      } else {
        res = await axios.post("http://localhost:8000/api/login", {
          email: identifier,
          password,
        });
        localStorage.setItem("admin", JSON.stringify(res.data.data));
        localStorage.setItem("token_admin", res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal, periksa kredensial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
          Masuk ke Sistem Analisis
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/30 text-red-200 py-2 rounded mb-4 text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white/80 mb-2 font-medium">Login Sebagai</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 mb-2 font-medium">
              {role === "admin" ? "Email" : "NIM"}
            </label>
            <input
              type={role === "admin" ? "email" : "text"}
              placeholder={role === "admin" ? "Masukkan email" : "Masukkan NIM"}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </motion.button>
        </form>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Belum punya akun mahasiswa?{" "}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
