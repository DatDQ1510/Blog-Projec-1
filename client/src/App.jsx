import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DashBoard from "./pages/DashBoard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import { AuthContext } from './AuthContext';
import { useContext, useEffect } from 'react';
import CreatePost from "./pages/CreatePost";

export default function App() {
  const { setIsLoggedIn, setUserInfo, setLoading } = useContext(AuthContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true); // Bắt đầu tải khi kiểm tra trạng thái đăng nhập
      try {
        const response = await fetch('http://localhost:3000/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success === false && data.message === 'Token is invalid or expired') {
            console.log('Token is invalid or expired');
            setUserInfo(null); // Xóa thông tin người dùng
            setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
          } else {
            setUserInfo(data); // Lưu thông tin người dùng
            setIsLoggedIn(true); // Đánh dấu đã đăng nhập
          }
        } else {
          console.log('Authentication failed:', await response.json());
          setUserInfo(null); // Không có thông tin người dùng
          setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setUserInfo(null); // Reset thông tin người dùng khi có lỗi
        setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn, setUserInfo, setLoading]);


  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/createpost' element={<CreatePost />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
