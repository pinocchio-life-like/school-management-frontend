import { Layout, theme } from "antd";
import React, { useState } from "react";
import AppRoute from "./Components/AppRoutes/AppRoute";
import AppFooter from "./Components/Layout/AppFooter/AppFooter";
import AppHeader from "./Components/Layout/AppHeader/AppHeader";
import SideBar from "./Components/Layout/Sidebar/SideBar";
import "./App.css";

import { LandingRoute } from "./Components/AppRoutes/LandingRoute";
import { AuthContext } from "./Context/auth-context";
import { useAuth } from "./hooks/auth-hook";

const { Content } = Layout;

const App = () => {
  const {
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
  } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [marginLeft, setMarginLeft] = useState(200);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setMarginLeftHandler = (value) => {
    setMarginLeft(value);
  };
  const setCollapsedHandler = (value) => {
    setCollapsed(value);
  };

  let routes;

  if (token) {
    routes = (
      <>
        <Layout
          style={{
            minHeight: "100vh",
            margin: "0",
          }}>
          <SideBar width={marginLeft} collapsed={collapsed} />
          <Layout
            // className="site-layout"
            style={{
              marginLeft: marginLeft,
              backgroundColor: "#f7f7fa",
            }}>
            <AppHeader
              collapsed={collapsed}
              onSetMarginLeft={setMarginLeftHandler}
              onSetCollapsed={setCollapsedHandler}
            />
            <Content
              style={{
                // border: "1px solid red",
                borderTop: "3px solid #4593FF",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                margin: "84px 16px 24px 16px",
                overflow: "initial",
                minHeight: 280,
                background: colorBgContainer,
              }}>
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  background: colorBgContainer,
                }}>
                <AppRoute />
              </div>
            </Content>
          </Layout>
        </Layout>
        <AppFooter />
      </>
    );
  } else {
    routes = <LandingRoute />;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        email: email,
        userType: userType,
        dob: dob,
        mobile: mobile,
        address: address,
        login: login,
        logout: logout,
      }}>
      {routes}
    </AuthContext.Provider>
  );
};
export default App;
