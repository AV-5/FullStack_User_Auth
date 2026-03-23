import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-400 text-sm mb-6">Email: {user?.email}</p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>

      </div>
    </div>
  );
}