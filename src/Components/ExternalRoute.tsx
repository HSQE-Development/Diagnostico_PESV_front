import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function ExternalRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Lista de rutas permitidas
    const allowedRoutes = ["/external-use"];

    // Verifica si la ruta actual no está permitida
    if (!allowedRoutes.includes(location.pathname)) {
      navigate("/external-use", { replace: true });
    }
  }, [location, navigate]);
  return <Outlet />;
}
