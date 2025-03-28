import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskPage from "./pages/TaskPage";
import Navbar from "./components/Navbar";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="*" element={<Navigate to="/" />} />          
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;