import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const token = localStorage.getItem("token");

  return (
    <Routes>

      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;