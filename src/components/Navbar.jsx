import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Cek token setiap kali halaman berubah
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    ...(isLoggedIn
      ? [{ name: "Dashboard", path: "/dashboard" }]
      : [{ name: "Login", path: "/login" }]),
  ];

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          AnalisisKomentar
        </Link>

        {/* Tombol menu mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`hover:text-yellow-300 transition ${
                  location.pathname === item.path
                    ? "border-b-2 border-yellow-300 pb-1"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* Tombol Logout hanya muncul kalau sudah login */}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-yellow-300 transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <ul className="md:hidden mt-3 space-y-2 bg-blue-500 p-3 rounded-lg">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded hover:bg-blue-700 ${
                  location.pathname === item.path
                    ? "bg-blue-700 font-semibold"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {isLoggedIn && (
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded hover:bg-blue-700"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
