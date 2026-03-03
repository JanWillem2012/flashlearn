import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./components/Home/HomePage";
import LoginPage from "./components/Auth/LoginPage";
import Dashboard from "./components/Dashboard/Dashboard";
import WordLists from "./components/Lists/WordLists";
import WordListDetail from "./components/Lists/WordListDetail";
import StudyMode from "./components/Study/StudyMode";
import Statistics from "./components/Stats/Statistics";

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#13131f",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#34d399", secondary: "#07070f" } },
            error:   { iconTheme: { primary: "#f87171", secondary: "#07070f" } },
          }}
        />
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/dashboard"       element={<Protected><Dashboard /></Protected>} />
          <Route path="/lists"           element={<Protected><WordLists /></Protected>} />
          <Route path="/lists/:listId"   element={<Protected><WordListDetail /></Protected>} />
          <Route path="/study/:listId"   element={<Protected><StudyMode /></Protected>} />
          <Route path="/stats"           element={<Protected><Statistics /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}