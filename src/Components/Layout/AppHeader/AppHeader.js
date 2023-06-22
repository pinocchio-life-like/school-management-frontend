import { Dropdown, Typography, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../Context/auth-context";
import "./AppHeader.css";

const AppHeader = (props) => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: (
        <Typography.Link
          onClick={() => {
            navigate("/myProfile");
          }}>
          My Profile
        </Typography.Link>
      ),
    },
    {
      key: "2",
      label: (
        <Typography.Link
          onClick={() => {
            navigate("/inbox");
          }}>
          Inbox
        </Typography.Link>
      ),
    },
    {
      key: "3",
      label: <Typography.Link onClick={auth.logout}>Logout</Typography.Link>,
    },
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div>
      <div
        style={{
          padding: 20,
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 200,
        }}></div>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          position: "fixed",
          top: 0,
          right: 0,
          paddingRight: 20,
          zIndex: 100,
          width: `${100 - 13.4}vw`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {React.createElement(
          props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => {
              props.onSetCollapsed(!props.collapsed);
              if (props.collapsed === false) {
                props.onSetMarginLeft(80);
              } else {
                props.onSetMarginLeft(200);
              }
            },
          }
        )}
        <Dropdown
          className="AppHeaderClass"
          trigger="click"
          menu={{
            items,
          }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // width: 160,
              padding: "0px 10px",
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "green",
                height: 38,
                width: 38,
                borderRadius: "100%",
              }}>
              <img
                height={38}
                width={38}
                src="https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg"
                alt=""
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-around",
                alignItems: "center",
                margin: "0px 10px",
              }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                }}>
                {auth.userName}
              </div>
              <div
                style={{
                  marginTop: -45,
                  fontWeight: 700,
                  color: "rgb(69, 147, 255)",
                }}>
                {auth.userType}
              </div>
            </div>
            <div>
              <DownOutlined />
            </div>
          </div>
        </Dropdown>
      </Header>
    </div>
  );
};

export default AppHeader;
