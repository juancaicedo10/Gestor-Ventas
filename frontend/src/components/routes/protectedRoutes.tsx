import { Navigate } from "react-router-dom";
import decodeToken from "../../utils/tokenDecored";


const PrivateRoute = ({ children } : { children: JSX.Element } ) => {
    const auth = localStorage.getItem("token");
    return auth ? children : <Navigate to="/" replace />;
}

const AdminRoute = ({ children } : { children: JSX.Element } ) => {
    const Admin = decodeToken()?.user.role;
    return Admin ? children : <Navigate to="/" replace />;
}

export { PrivateRoute, AdminRoute }
