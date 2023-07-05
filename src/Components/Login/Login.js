import React, { useContext } from "react";
import "./Login.css";
import { Button, Form, Input, Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../util/validators";
import { useForm } from "../../hooks/form-hook";
import { AuthContext } from "../../Context/auth-context";

import googleIcon from "../../Resources/google-color-svgrepo-com.svg";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const auth = useContext(AuthContext);

  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const responseData = await response.json();

      if (responseData.status === 403 || responseData.status === 500) {
        throw new Error("Couldnt");
      }
      auth.login(
        responseData.userId,
        responseData.userName,
        responseData.email,
        responseData.userType,
        responseData.dob,
        responseData.mobile,
        responseData.address,
        responseData.token
      );
      if (responseData.userType === "Student") {
        navigate("/studentDashboard");
        return;
      }
      if (responseData.userType === "Teacher") {
        navigate("/studentsMark");
        return;
      }
      if (responseData.userType === "Admin") {
        navigate("/createAccounts");
        return;
      }
      if (responseData.userType === "School Admin") {
        navigate("/classList");
        return;
      }
      if (responseData.userType === "HR Admin") {
        navigate("/employeeList");
        return;
      }
      if (responseData.userType === "Transport Admin") {
        navigate("/vehicleList");
        return;
      }

      // navigate("/dashboard");
    } catch (err) {
      error("wrong Login Credentials");
    }
  };

  return (
    <div className="MainLoginClass">
      {contextHolder}
      <div className="MainLoginHeader">
        <div
          className="MainLoginLogoText"
          onClick={() => {
            navigate("/");
          }}>
          Ozone School
        </div>
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            title="Contact The Schools Info Center"
            color="volcano"
            key="volcano">
            Dont't have an account?
          </Tooltip>
        </div>
      </div>
      <div className="LoginFormContainer">
        <div className="LoginFormHeader">
          <div style={{ fontSize: 24, fontWeight: 300 }}>Log in</div>
          <div>Forgot password?</div>
        </div>
        <div className="MainLoginForm">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" required>
              <Input
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}
                type="email"
                style={{ height: 40 }}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item name="password" required>
              <Input.Password
                validators={[VALIDATOR_MINLENGTH(6)]}
                onInput={inputHandler}
                style={{ height: 40 }}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button
                // disabled={!formState.isValid}
                type="ghost"
                htmlType="submit"
                style={{
                  height: 40,
                  width: "100%",
                  marginTop: 20,
                  backgroundColor: "rgb(4, 55, 31)",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>Or, Continue with</div>
        <div className="GoogleLogoLandingClass">
          <img style={{ width: 25 }} src={googleIcon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
