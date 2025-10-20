import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  if (role === "mahasiswa") {
    const mahasiswa = JSON.parse(localStorage.getItem("mahasiswa"));
    return mahasiswa ? children : <Navigate to="/login" replace />;
  } else if (role === "admin") {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin ? children : <Navigate to="/login" replace />;
  }
  return <Navigate to="/login" replace />;
}
