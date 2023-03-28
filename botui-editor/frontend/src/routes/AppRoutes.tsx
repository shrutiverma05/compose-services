import Login from "../pages/Login";
import GeneralSettings from "../components/GeneralSettings/UiGeneralSettings";
import BotStyles from "../components/GeneralSettings/BotStyles";
import Theme from "../components/GeneralSettings/Theme";
import PrivateRoute from "./PrivateRoutes";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function AppRoutes() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={<PrivateRoute Component={GeneralSettings} />}
            />
            <Route
              path="/general-botstyle"
              element={<PrivateRoute Component={BotStyles} />}
            />
            <Route
              path="/general-theme"
              element={<PrivateRoute Component={Theme} />}
            />
            {/* Login Route */}
            <Route path="/" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
export default AppRoutes;
