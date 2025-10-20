import { createContext, useState } from "react";
import axios from "../api/axios";

export const KomentarMahasiswaContext = createContext();

export const KomentarMahasiswaProvider = ({ children }) => {
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ambil data mahasiswa dari localStorage (jika sudah login)
  const mahasiswa = JSON.parse(localStorage.getItem("mahasiswa"));

  // Fetch komentar hanya kalau mahasiswa ada
  const fetchKomentar = async () => {
    if (!mahasiswa) return; // tidak ada mahasiswa, hentikan fetch
    setLoading(true);
    try {
      const res = await axios.get("/mahasiswa/komentar", {
        params: { mahasiswa_id: mahasiswa.id }, // sesuaikan API kalau perlu
      });
      setKomentarList(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
      setMessage("Gagal ambil komentar. Pastikan login sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  // Tambah komentar
  const tambahKomentar = async (komentar) => {
    if (!mahasiswa) return;
    setLoading(true);
    try {
      const res = await axios.post("/mahasiswa/komentar", {
        mahasiswa_id: mahasiswa.id,
        komentar,
      });

      setKomentarList((prev) => [res.data.data, ...prev]);
      setMessage("Komentar berhasil dikirim!");
    } catch (err) {
      console.error("Gagal kirim komentar:", err);
      setMessage("Gagal kirim komentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KomentarMahasiswaContext.Provider
      value={{ komentarList, fetchKomentar, tambahKomentar, loading, message, setMessage }}
    >
      {children}
    </KomentarMahasiswaContext.Provider>
  );
};
