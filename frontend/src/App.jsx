import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./components/Auth/LoginPage";
import Dashboard from "./components/Dashboard/Dashboard";
import WordLists from "./components/Lists/WordLists";
import WordListDetail from "./components/Lists/WordListDetail";
import StudyMode from "./components/Study/StudyMode";
import Statistics from "./components/Stats/Statistics";
const Protected = ({ children }) => { const { user } = useAuth(); return user ? children : <Navigate to="/login" />; };
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/lists" element={<Protected><WordLists /></Protected>} />
          <Route path="/lists/:listId" element={<Protected><WordListDetail /></Protected>} />
          <Route path="/study/:listId" element={<Protected><StudyMode /></Protected>} />
          <Route path="/stats" element={<Protected><Statistics /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}