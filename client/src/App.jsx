import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DashBoard from "./pages/DashBoard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Notice from "./pages/Notice";
import CreatePost from "./pages/CreatePost";
import ChangePassword from "./pages/ChangePassword";
import UpdatePost from "./components/UpdatePost";
import PostDetail from "./pages/PostDetail";
import { AuthContext } from './AuthContext';
import { useContext, useEffect } from 'react';
import Comment from "./components/Comment";
import PrivateRoute from './components/PrivateRoute';
import { Navigate } from 'react-router-dom';

export default function App() {
  const { setIsLoggedIn, setUserInfo, setLoading, userInfo, loading } = useContext(AuthContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true); // Start loading while checking login status
      try {
        const response = await fetch('http://localhost:3000/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json(); // Log the response after parsing

        if (response.ok) {
          setUserInfo(data);
          setIsLoggedIn(true)

          if (data.success === false && data.message === 'Token is invalid or expired') {

            setUserInfo(null); // Clear user info
            setIsLoggedIn(false); // Set user as logged out
          } else {
            setUserInfo(data); // Store user info
            setIsLoggedIn(true); // Mark as logged in
          }
        } else {
          console.log('Authentication failed:', data);
          setUserInfo(null); // Clear user info
          setIsLoggedIn(false); // Mark as logged out
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setUserInfo(null); // Reset user info on error
        setIsLoggedIn(false); // Mark as logged out
      } finally {
        setLoading(false); // End loading
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn, setUserInfo, setLoading]);

  // Show loading state if checking login status
  if (loading) {
    return <div>Loading...</div>; // Or use a spinner for better UX
  }

  return (
    <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/comment" element={<Comment />} />

        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:slug" element={<UpdatePost />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        {/* Protected Route for Admin */}
        <Route
          path="/admin"
          element={
            userInfo?.isAdmin ? (
              <DashBoard />
            ) : (
              <Navigate to="/sign-in" /> // Redirect to sign-in if not an admin
            )
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  );
}
