import { Navigate, Route, redirect } from "react-router-dom";


const PrivateRoute = ({ children } : { children: JSX.Element } ) => {
    const auth = localStorage.getItem("token");
    console.log(auth)
    return auth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute
