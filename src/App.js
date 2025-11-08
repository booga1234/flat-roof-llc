import { useEffect, useState } from "react";
import "./index.css";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem("xanoAuthToken");
  });

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("xanoAuthToken", authToken);
    } else {
      localStorage.removeItem("xanoAuthToken");
    }
  }, [authToken]);

  function handleSuccess(token) {
    setAuthToken(token ?? "");
  }

  function handleLogout() {
    localStorage.removeItem("xanoAuthToken");
    setAuthToken("");
  }

  const isAuthenticated = Boolean(authToken);

  return isAuthenticated ? (
    <DashboardPage onLogout={handleLogout} />
  ) : (
    <LoginPage onSuccess={handleSuccess} />
  );
}

export default App;
