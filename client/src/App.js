import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Navbar from './components/Navbar';
import AllStudents from './components/AllStudents'
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/students" element={<AllStudents />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;