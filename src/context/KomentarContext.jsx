import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const KomentarContext = createContext();

export const KomentarProvider = ({ children }) => {
  const [komentarList, setKomentarList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, positif: 0, negatif: 0 });
  const token = localStorage.getItem("token");

  const fetchKomentar = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/komentar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data || [];

      // Deteksi otomatis relasi (camelCase / snake_case)
      const getKategori = (k) =>
        k?.analisis_sentimen?.kategori ||
        k?.analisisSentimen?.kategori ||
        null;

      const positif = data.filter((k) => getKategori(k) === "positif").length;
      const negatif = data.filter((k) => getKategori(k) === "negatif").length;

      setKomentarList(data);
      setStats({ total: data.length, positif, negatif });
    } catch (err) {
      console.error("Gagal ambil komentar:", err);
    } finally {
      setLoading(false);
    }
  };

  const hapusKomentar = async (id) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await axios.delete(`/komentar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const target = komentarList.find((k) => k.id === id);
      const kategori =
        target?.analisis_sentimen?.kategori ||
        target?.analisisSentimen?.kategori;

      setKomentarList((prev) => prev.filter((k) => k.id !== id));
      setStats((prev) => ({
        total: prev.total - 1,
        positif: prev.positif - (kategori === "positif" ? 1 : 0),
        negatif: prev.negatif - (kategori === "negatif" ? 1 : 0),
      }));
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
      alert("Gagal menghapus komentar.");
    }
  };

  useEffect(() => {
    fetchKomentar();
  }, []);

  return (
    <KomentarContext.Provider
      value={{ komentarList, fetchKomentar, hapusKomentar, loading, stats }}
    >
      {children}
    </KomentarContext.Provider>
  );
};
