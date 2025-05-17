import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/RegisterPage";
import LoggedInArea from "./pages/LoggedInArea";
import { isAuthenticated } from './utils/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/loggedIn"
        element={
          <ProtectedRoute>
            <LoggedInArea />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;