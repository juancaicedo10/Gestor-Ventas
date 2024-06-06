import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children } : { children: JSX.Element } ) => {
    const auth = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log(auth)
    console.log(user)
    return auth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute
