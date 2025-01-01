import React, { useContext } from 'react';
import { Sidebar } from 'flowbite-react';
import { Link } from 'react-router-dom'; // Import Link
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
} from 'react-icons/hi';
import { AuthContext } from '../AuthContext';

export function ProfileComponents() {
    const { userInfo, setIsLoggedIn, setUserInfo } = useContext(AuthContext);
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


    // Thay thế logic lấy `tab` bằng cách truyền nó qua props hoặc context
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab'); // Lấy `tab` từ URL

    if (!userInfo) {
        return <div>Loading...</div>; // Xử lý nếu `userInfo` chưa sẵn sàng
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>

                    <Link to='/dashboard?tab=dash'>
                        <Sidebar.Item
                            active={tab === 'dash'}
                            icon={HiChartPie}
                            as='div'
                        >
                            Dashboard
                        </Sidebar.Item>
                    </Link>


                    {/* Profile */}
                    <Link to='/profile'>
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={userInfo.isAdmin ? 'Admin' : 'User'}
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {/* Posts (chỉ hiển thị với Admin) */}
                    {userInfo.isAdmin && (
                        <Link to='/dash-post'>
                            <Sidebar.Item
                                active={tab === 'posts'}
                                icon={HiDocumentText}
                                as='div'
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}

                    {/* Users và Comments (chỉ hiển thị với Admin) */}
                    {userInfo.isAdmin && (
                        <>
                            <Link to='/dash-users'>
                                <Sidebar.Item
                                    active={tab === 'users'}
                                    icon={HiOutlineUserGroup}
                                    as='div'
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dash-comments'>
                                <Sidebar.Item
                                    active={tab === 'comments'}
                                    icon={HiAnnotation}
                                    as='div'
                                >
                                    Comments
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}

                    {/* Sign Out */}
                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        className='cursor-pointer'
                        onClick={handleSignout}                     >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
