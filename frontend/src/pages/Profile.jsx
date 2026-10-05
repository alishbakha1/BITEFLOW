import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-16 text-center">
      <FaUserCircle className="mx-auto text-7xl text-[#0C3B2E]/20 mb-4" />
      <h1 className="font-display text-3xl font-bold text-[#0C3B2E]">{user?.name}</h1>
      <p className="text-gray-500 mt-1">{user?.email}</p>

      <button
        onClick={handleLogout}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0C3B2E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a2f24] transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Profile;