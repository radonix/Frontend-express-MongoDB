import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/RegisterPage";
import LoggedInArea from "./pages/LoggedInArea";

function App() {
  return (
    <Routes>
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/registerPage" element={<RegisterPage />} />
      <Route path="/loggedInArea" element={<LoggedInArea />} />
    </Routes>
  );
}

export default App;