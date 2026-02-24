import React, { useState } from 'react'
import { createContext } from 'react';
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backend_Url = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const value = {
        backend_Url,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}