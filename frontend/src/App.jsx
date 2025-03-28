import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
        <div className="bg-red-500 text-white p-4 font-bold">
  THIS MUST BE RED NOW
</div>      
<div className="test-force-red">This must be red</div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );  
}

export default App;