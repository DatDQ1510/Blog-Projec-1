import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';
import { useState } from 'react'; // Import the useState hook  

export default function Header() {
  const { isLoggedIn, userInfo, setIsLoggedIn, setUserInfo } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark'); // Disable dark mode
    } else {
      document.documentElement.classList.add('dark'); // Enable dark mode
    }
  };
  const handleSignout = async () => {

    setIsLoggedIn(false);
    setUserInfo(null);
  }
  return (
    <Flowbite>
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
          <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
          {isLoggedIn ? (
            <Dropdown
              label={<Avatar rounded />}
              inline // Để Dropdown xuất hiện ngay dưới Avatar
            >
              <Dropdown.Item>
                <Link to="/profile">Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item >
                <Link to='/' onClick={handleSignout}>Sign out</Link>
              </Dropdown.Item>
            </Dropdown>

          ) : (
            <>
              {/* Sign-Up Button */}
              <Link to="/sign-up">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign Up
                </Button>
              </Link>

              {/* Sign-In Button */}
              <Link to="/sign-in">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign In
                </Button>
              </Link>
            </>
          )}
          {/* Navbar Toggle for Mobile */}
          <Navbar.Toggle />
        </div>

        {/* Navbar Collapse (Links) */}
        <Navbar.Collapse>
          <Navbar.Link>
            <Link to="/home">Home</Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/about">About</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </Flowbite>
  );
}
