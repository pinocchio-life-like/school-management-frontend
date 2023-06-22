import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setuserId] = useState(false);
  const [userName, setuserName] = useState(false);
  const [email, setEmail] = useState(false);
  const [userType, setuserType] = useState(false);
  const [dob, setDob] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [address, setAddress] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(
    (
      userId,
      userName,
      email,
      userType,
      dob,
      mobile,
      address,
      token,
      expirationDate
    ) => {
      setToken(token);
      setuserId(userId);
      setuserName(userName);
      setEmail(email);
      setuserType(userType);
      setDob(dob);
      setMobile(mobile);
      setAddress(address);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          userName: userName,
          email: email,
          userType: userType,
          dob: dob,
          mobile: mobile,
          address: address,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setuserId(null);
    setuserName(null);
    setEmail(null);
    setuserType(null);
    setDob(null);
    setMobile(null);
    setAddress(null);
    localStorage.removeItem("userData");
    navigate("/");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.userName,
        storedData.email,
        storedData.userType,
        storedData.dob,
        storedData.mobile,
        storedData.address,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
    userName,
    email,
    userType,
    dob,
    mobile,
    address,
  };
};
