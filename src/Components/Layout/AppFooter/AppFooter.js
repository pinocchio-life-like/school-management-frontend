import { Footer } from "antd/es/layout/layout";
import React from "react";

const AppFooter = () => {
  return (
    <div>
      <Footer
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50px",
          background: "aliceblue",
          textAlign: "center",
          width: "100%",
        }}>
        SIRM ©2023
      </Footer>
    </div>
  );
};

export default AppFooter;
