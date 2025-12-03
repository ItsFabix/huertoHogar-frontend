import { Navigate } from "react-router-dom";
import { getSession, getUserRole } from "../utils/auth";

export default function ProtectedRoute({ children, requireAdmin }) {
  const session = getSession();
  const role = getUserRole();

  // 1. Si no hay sesión, mandar al Login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere admin y el usuario no lo es, mandar al Home
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3. Si pasa las validaciones, mostrar la página
  return children;
}