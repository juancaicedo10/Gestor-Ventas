import { Navigate, useLocation } from "react-router-dom";
import { ModuloCodigo } from "../../constants/modulos";
import { hasPermiso } from "../../utils/permissions";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = localStorage.getItem("token");
  return auth ? children : <Navigate to="/" replace />;
};

const PermisoRoute = ({
  children,
  modulo,
}: {
  children: JSX.Element;
  modulo: ModuloCodigo;
}) => {
  const auth = localStorage.getItem("token");
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (!hasPermiso(modulo)) {
    return (
      <Navigate
        to="/acceso-denegado"
        replace
        state={{ modulo, from: location.pathname }}
      />
    );
  }

  return children;
};

export { PrivateRoute, PermisoRoute };
