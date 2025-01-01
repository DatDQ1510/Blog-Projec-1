import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // useEffect(() => {
    //     console.log('userInfo:', userInfo);
    //     console.log('isLoggedIn:', isLoggedIn);
    // }, [userInfo, isLoggedIn]); // Log mỗi khi chúng thay đổi

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userInfo, setUserInfo, loading, setLoading ,searchTerm, setSearchTerm}}>
            {children}
        </AuthContext.Provider>
    )
};
