import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Dropdown, Avatar, Button, TextInput } from 'flowbite-react';
import { AiOutlineSearch, AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';
import { AuthContext } from '../AuthContext';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, setUserInfo } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Đảm bảo chế độ sáng mặc định
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Lưu mặc định là light
    }
  }, []);


  const handleSignout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserInfo(null);
        window.location.href = '/';
      } else {
        const error = await response.json();
        console.error('Failed to log out:', error.message);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <Navbar className="border-b-2">
      {/* Logo */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Dat's
        </span>
        Blog
      </Link>

      {/* Search Bar */}
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>

      {/* Mobile Search Button */}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* Right-Side Actions */}
      <div className="flex gap-2 md:order-2">
        {/* Theme Toggle Button */}
        <Button
          onClick={toggleDarkMode}
          gradientDuoTone="purpleToBlue"
          pill
        >
          {isDarkMode ? <AiOutlineSun /> : <AiOutlineMoon />}
        </Button>

        {isLoggedIn ? (
          <Dropdown label={<Avatar rounded />} inline>
            <Dropdown.Item>
              <Link to="/profile">Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/" onClick={handleSignout}>
                Sign out
              </Link>
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to="/sign-up">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign Up
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          </>
        )}
        <Navbar.Toggle />
      </div>

      {/* Navbar Collapse (Links) */}
      <Navbar.Collapse>
        <Navbar.Link>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/notice">Notice </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
