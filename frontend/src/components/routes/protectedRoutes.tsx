import { Navigate } from "react-router-dom";
import decodeToken from "../../utils/tokenDecored";


const PrivateRoute = ({ children } : { children: JSX.Element } ) => {
    const auth = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log(auth)
    console.log(user)
    return auth ? children : <Navigate to="/login" replace />;
}

const AdminRoute = ({ children } : { children: JSX.Element } ) => {
    const Admin = decodeToken()?.role;
    return Admin ? children : <Navigate to="/" replace />;
}

export { PrivateRoute, AdminRoute }
