import { useContext } from "react";
import { KomentarContext } from "../context/KomentarContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function StatistikSentimen() {
  const { stats, komentarList } = useContext(KomentarContext);

  // Data untuk pie chart
  const dataPie = [
    { name: "Positif", value: stats.positif },
    { name: "Negatif", value: stats.negatif },
    { name: "Netral", value: komentarList.filter(k => k.analisisSentimen?.kategori === "netral").length },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#eab308"]; // hijau, merah, kuning

  // Data untuk bar chart
  const dataBar = [
    { kategori: "Positif", jumlah: stats.positif },
    { kategori: "Negatif", jumlah: stats.negatif },
    { kategori: "Netral", jumlah: dataPie[2].value },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 text-center text-blue-400"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        Statistik Analisis Sentimen
      </motion.h1>

      {/* Container Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Pie Chart */}
        <motion.div
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg border border-blue-500/30"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-xl font-semibold mb-4 text-blue-300">Persentase Sentimen</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {dataPie.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg border border-blue-500/30"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-center text-xl font-semibold mb-4 text-blue-300">Perbandingan Jumlah Komentar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="kategori" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#3b82f6" barSize={60} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Ringkasan angka */}
      <motion.div
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white/10 px-6 py-4 rounded-xl border border-green-400/50">
          <p className="text-gray-300 text-sm">Komentar Positif</p>
          <h2 className="text-3xl font-bold text-green-400">{stats.positif}</h2>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-xl border border-red-400/50">
          <p className="text-gray-300 text-sm">Komentar Negatif</p>
          <h2 className="text-3xl font-bold text-red-400">{stats.negatif}</h2>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-xl border border-yellow-400/50">
          <p className="text-gray-300 text-sm">Komentar Netral</p>
          <h2 className="text-3xl font-bold text-yellow-400">{dataPie[2].value}</h2>
        </div>
      </motion.div>
    </motion.div>
  );
}
