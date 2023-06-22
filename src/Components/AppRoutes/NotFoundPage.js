import { Result } from "antd";
import React from "react";

const NotFoundPage = () => {
  return (
    <div style={{ marginTop: 60 }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    </div>
  );
};

export default NotFoundPage;
