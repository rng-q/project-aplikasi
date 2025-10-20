import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // pakai axios default
import heroImage from "../assets/FormKomentarmhs.gif";

export default function FormKomentarMahasiswa() {
  const mahasiswa = JSON.parse(localStorage.getItem("mahasiswa")); // ambil ID dari localStorage
  const [formData, setFormData] = useState({ mahasiswa_id: mahasiswa?.id || "", komentar: "" });
  const [sentimen, setSentimen] = useState("Belum dianalisis");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSentimen("Belum dianalisis");

    try {
      const res = await axios.post("http://localhost:8000/api/mahasiswa/komentar", formData);

      const hasilSentimen = res.data.data.analisis_sentimen?.kategori || "Belum dianalisis";
      setSentimen(hasilSentimen);

      setMessage(`Komentar berhasil dikirim! Sentimen: ${hasilSentimen}`);
      setFormData({ mahasiswa_id: mahasiswa?.id || "", komentar: "" });
    } catch (err) {
      console.error("Error detail:", err.response ? err.response.data : err.message);
      setMessage("Terjadi kesalahan saat mengirim komentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
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
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Form Komentar Mahasiswa
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-1">Mahasiswa ID</label>
              <input
                type="number"
                name="mahasiswa_id"
                value={formData.mahasiswa_id}
                onChange={handleChange}
                placeholder="Masukkan ID Mahasiswa"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Komentar</label>
              <textarea
                name="komentar"
                value={formData.komentar}
                onChange={handleChange}
                placeholder="Tulis komentar Anda..."
                required
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 resize-none"
              />
              <p className="text-white/80 mt-1">
                Sentimen:{" "}
                <span
                  className={
                    sentimen === "positif"
                      ? "text-green-400"
                      : sentimen === "negatif"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                >
                  {sentimen}
                </span>
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Mengirim..." : "Kirim Komentar"}
            </motion.button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("berhasil") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <Link
            to="/mahasiswa/dashboard"
            className="block mt-4 text-center text-blue-400 hover:underline"
          >
            Kembali ke Dashboard
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
