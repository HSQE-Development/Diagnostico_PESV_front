import { useAppSelector } from "@/stores/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/login",
}) => {
  const authUser = useAppSelector((state) => state.auth.authUser);

  if (!authUser) {
    // Si no hay authUser, redirigir a la ruta de login
    return <Navigate to={redirectPath} replace />;
  }

  if (authUser) {
    if (!authUser.user.change_password) {
      return <Navigate to={"/change_password"} replace />;
    }
  }

  // Si hay authUser, renderizar el contenido de la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
