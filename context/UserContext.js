// UserContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '../utils/localStore';
import { COMMON } from '../constants/const';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const setLogin = (userData) => {
    setUserId(userData?.user_id);
    setLocalStorage(COMMON.USER, userData);
    setUser(userData);
  };

  const setLogout = () => {
    removeLocalStorage(COMMON.USER);
    removeLocalStorage(COMMON.AUTH_TOKEN);
    setUser(null);
    setUserId(null);
    setToken(null);
  };

  const setLoginToken = (tokenData) => {
    setToken(tokenData);
    setLocalStorage(COMMON.AUTH_TOKEN, tokenData);
  };

  useEffect(() => {
    const storedUser = getLocalStorage(COMMON.USER);
    const storedToken = getLocalStorage(COMMON.AUTH_TOKEN);
    if (storedUser && storedToken) {
      setUser(storedUser);
      setUserId(storedUser?.user_id);
      setToken(storedToken);
    }
  }, []);
  return (
    <UserContext.Provider
      value={{ user, userId, token, setLogin, setLogout, setLoginToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
