const PrivateRoute = ({ isAdmin, element }) => {
    console.log('Checking admin:', isAdmin);  // Log the admin status here
    if (!isAdmin) {
        return <Navigate to="/sign-in" replace />;
    }
    return element;
};
export default PrivateRoute;