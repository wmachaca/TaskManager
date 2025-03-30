import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();  
  const navigate = useNavigate();


    // Don't show navbar on auth pages
    if (location.pathname === "/login" || location.pathname === "/register") {
      return null;
    }

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    console.log("Navbar user object:", user);

      // Safe user display name with fallbacks
  const getDisplayName = () => {
    if (!user) return "User";
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return "User";
  };
    return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Empty for balance */}
          <div className="flex-1"></div>
          
          {/* Center - Welcome message (only when logged in) */}
          {user && (
            <div className="flex-1 text-center">
              <span className="text-gray-700 font-medium">
              Welcome, <span className="text-indigo-600">{getDisplayName()}</span>
              </span>
            </div>
          )}
          
          {/* Right side - Logout (only when logged in) */}
          <div className="flex-1 flex justify-end">
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-white hover:bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-indigo-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
