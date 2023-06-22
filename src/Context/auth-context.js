import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userName: null,
  email: null,
  userType: null,
  dob: null,
  mobile: null,
  address: null,
  token: null,
  login: () => {},
  logout: () => {},
});
