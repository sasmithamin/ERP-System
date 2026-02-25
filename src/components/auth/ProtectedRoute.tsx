import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user || user === "undefined") {
    return <Navigate to="/login" replace />;
  }

  let parsedUser;
  try {
    parsedUser = JSON.parse(user);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(parsedUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}