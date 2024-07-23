import { useContext } from "react"
import { UserContext } from "./Context/UserContext";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({path, children}) => {
    const { userInfo } = useContext(UserContext);
        
    return userInfo?.email || localStorage.getItem('userInfo') ? children  : <Navigate to='/login' />
}

export default ProtectedRoute;  