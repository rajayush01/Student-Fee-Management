import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-black to-blue-900 text-white shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">₹</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              <Link to={'/'}>
                Student Fee Management
              </Link>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/students"
              className="relative px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="relative z-10">All Students</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="relative px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="relative z-10">Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
                <span className="text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;