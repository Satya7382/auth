import React, { useState, useEffect, createContext, use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backend_Url = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
  try {
    const { data } = await axios.get(
      `${backend_Url}/api/auth/is-auth`,
    );

    if (data.success) {
      setIsLoggedIn(true);
      await getUserData();
    }
  } catch (error) {
    setIsLoggedIn(false);
    setUserData(null);
  }
};
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backend_Url}/api/user/data`,
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.userData);
        console.log('User data fetched successfully');
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backend_Url,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};