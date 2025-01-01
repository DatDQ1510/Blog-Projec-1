// // src/components/PrivateRoute.js
// import { Navigate, Outlet } from "react-router-dom";
// import React, { useContext } from "react";
// import { AuthContext } from "../AuthContext";

// const PrivateRoute = () => {
//     const { userInfo } = useContext(AuthContext);

//     if (!userInfo || !userInfo.isAdmin) {
//         return <Navigate to='/no-access' />;
//     }

//     return <Outlet />;
// };

// export default PrivateRoute;
