import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardMahasiswa from "./pages/DashboardMahasiswa";
import DashboardAdmin from "./pages/DashboardAdmin";
import FormKomentar from "./components/FormKomentar";
import FormKomentarMahasiswa from "./components/FormKomentarMahasiswa";
import Statistik from "./pages/Statistik";

// Import Context Mahasiswa
import { KomentarMahasiswaProvider } from "./context/KomentarMahasiswaContext";

// Protected Route Mahasiswa
function ProtectedMahasiswa({ children }) {
  const mahasiswa = localStorage.getItem("mahasiswa");
  return mahasiswa ? children : <Navigate to="/login" replace />;
}

// Protected Route Admin
function ProtectedAdmin({ children }) {
  const admin = localStorage.getItem("admin");
  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      {/* Wrap dengan provider supaya semua halaman mahasiswa bisa akses komentar */}
      <KomentarMahasiswaProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Mahasiswa */}
          <Route
            path="/mahasiswa/dashboard"
            element={
              <ProtectedMahasiswa>
                <DashboardMahasiswa />
              </ProtectedMahasiswa>
            }
          />
          <Route
            path="/mahasiswa/komentar"
            element={
              <ProtectedMahasiswa>
                <FormKomentarMahasiswa />
              </ProtectedMahasiswa>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdmin>
                <DashboardAdmin />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/statistik"
            element={
              <ProtectedAdmin>
                <Statistik />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/komentar"
            element={
              <ProtectedAdmin>
                <FormKomentar />
              </ProtectedAdmin>
            }
          />

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KomentarMahasiswaProvider>
    </Router>
  );
}
