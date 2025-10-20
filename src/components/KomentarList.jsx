import React, { useState, useEffect } from "react";
import api from "../api";

export default function KomentarList() {
  const [mahasiswaId, setMahasiswaId] = useState(1);
  const [komentar, setKomentar] = useState("");
  const [message, setMessage] = useState("");
  const [listKomentar, setListKomentar] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = "3|Og1Cm0SmUmavZ8DPCInOvVrQn9rso3BmwT0AMeM2c3f276dc";

  // 🔹 Ambil semua komentar dari API
  const fetchKomentar = async () => {
    try {
      const res = await api.get("/komentar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListKomentar(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
    }
  };

  // 🔹 Jalankan saat pertama kali halaman dibuka
  useEffect(() => {
    fetchKomentar();
  }, []);

  // 🔹 Kirim komentar baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/komentar",
        { mahasiswa_id: mahasiswaId, komentar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hasil = response.data.data.analisis_sentimen?.kategori || "-";
      const skor = response.data.data.analisis_sentimen?.skor ?? 0;

      setMessage(`✅ Komentar dikirim! Sentimen: ${hasil} (skor: ${skor})`);
      setKomentar("");

      // 🔹 Tambahkan komentar baru ke list
      setListKomentar((prev) => [response.data.data, ...prev]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Gagal mengirim komentar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 drop-shadow-md">
        💬 Analisis Sentimen Komentar
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-lg border border-blue-500/30"
      >
        <label className="block mb-2 font-semibold">Komentar:</label>
        <textarea
          className="w-full border border-blue-400/40 bg-transparent rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Tulis komentar kamu..."
          required
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-lg font-semibold transition-all duration-300 ${
            loading
              ? "bg-blue-900 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {loading ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-lg font-medium">{message}</p>
      )}

      {/* Daftar komentar */}
      <div className="mt-10 w-full max-w-3xl overflow-x-auto rounded-lg border border-white/20">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-white/10 text-blue-300 uppercase text-sm tracking-wide">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Komentar</th>
              <th className="py-2 px-4">Sentimen</th>
              <th className="py-2 px-4">Skor</th>
              <th className="py-2 px-4">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {listKomentar.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Belum ada komentar
                </td>
              </tr>
            ) : (
              listKomentar.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-gray-700 hover:bg-white/5 transition"
                >
                  <td className="py-2 px-4">{k.id}</td>
                  <td className="py-2 px-4">{k.komentar}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      k.analisis_sentimen?.kategori === "positif"
                        ? "text-green-400"
                        : k.analisis_sentimen?.kategori === "negatif"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {k.analisis_sentimen?.kategori || "-"}
                  </td>
                  <td className="py-2 px-4">
                    {k.analisis_sentimen?.skor ?? "-"}
                  </td>
                  <td className="py-2 px-4">{k.tanggal || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
