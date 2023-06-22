import Title from "antd/es/typography/Title";
import React, { useContext, useState } from "react";
import "./MyProfile.css";
import svgLocation from "../../../Resources/SvgLogos/location-pin-svgrepo-com.svg";
import { Button, DatePicker, Form, Input, Progress, message } from "antd";
import { AuthContext } from "../../../Context/auth-context";
import dayjs from "dayjs";
const MyProfile = () => {
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();
  const auth = useContext(AuthContext);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const onEditFinish = async (values) => {
    let dob = new Date(values.dob);
    dob = dob.toLocaleDateString("es-CL");

    const { firstName, lastName, mobile, address } = values;
    const userName = `${firstName} ${lastName}`;
    const email = auth.email;
    try {
      const response = await fetch(
        `http://localhost:8080/users/updateUser/${email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: userName,
            dob: dob,
            mobile: mobile,
            address: address,
          }),
        }
      );
      const responseData = await response.json();

      if (responseData.status === 403 || responseData.status === 500) {
        throw new Error("Couldnt");
      }
      success("Successfully Updated");
      setTimeout(() => {
        auth.logout();
      }, 1400);
    } catch (err) {
      error("Couldn't update, check your Connection");
    }
  };

  const onPasswordReset = async (values) => {
    const { confirmPassword } = values;
    const email = auth.email;
    try {
      const response = await fetch(
        `http://localhost:8080/users/changePassword/${email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: confirmPassword,
          }),
        }
      );
      const responseData = await response.json();

      if (responseData.status === 403 || responseData.status === 500) {
        throw new Error("Couldnt");
      }
      success("Successfully Updated");
      setTimeout(() => {
        auth.logout();
      }, 1400);
    } catch (err) {
      error("Couldn't update, check your Connection");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const confirmPassword = resetForm.getFieldValue("confirmPassword");

    const hasMinimumLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);

    const strength = [
      hasMinimumLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    setPasswordStrength(strength);
    setPasswordMatch(newPassword === confirmPassword && strength === 5);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}>
      {contextHolder}
      <div>
        <Title
          level={3}
          style={{
            textAlign: "left",
            marginBottom: 10,
            marginTop: -10,
            marginLeft: 20,
          }}>
          Profile
        </Title>
      </div>
      <div className="ProfileImageAndOverview">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "green",
            height: 120,
            width: 120,
            borderRadius: "100%",
            marginRight: 20,
          }}>
          <img
            height={120}
            width={120}
            src="https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg"
            alt=""
          />
        </div>
        <div className="ProfilePageOverview">
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
            }}>
            {auth.userName}
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "GrayText",
              display: "flex",
            }}>
            {auth.userType}
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
            }}>
            <img height={14} width={14} src={svgLocation} alt="" />{" "}
            {auth.address}
          </div>
        </div>
      </div>
      <div className="ProfileOverviewHolder">
        <div className="PersonalDetailsAndEdit">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Title level={5} style={{ marginTop: 0 }}>
              Personal Details
            </Title>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}>
              Update
            </Button>
          </div>
          <Form form={form} onFinish={onEditFinish} layout="vertical">
            <Form.Item
              initialValue={auth.userName.split(" ")[0]}
              name="firstName"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={auth.userName.split(" ")[1]}
              style={{ marginTop: -20 }}
              name="lastName"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={auth.email}
              style={{ marginTop: -20 }}
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={auth.mobile}
              style={{ marginTop: -20 }}
              name="mobile"
              label="Mobile"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={auth.address}
              style={{ marginTop: -20 }}
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={
                auth.dob === "" ? "" : dayjs(`${auth.dob}`, "DD-MM-YYYY")
              }
              style={{ marginTop: -20 }}
              name="dob"
              label="Date Of Birth"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <DatePicker style={{ width: "100%" }} placeholder="Birth Date" />
            </Form.Item>
          </Form>
        </div>
        <div className="PasswordAndReset">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}>
            <Title level={5} style={{ marginTop: 0 }}>
              Password Reset
            </Title>
            <Button
              type="primary"
              disabled={!passwordMatch}
              onClick={() => {
                resetForm.submit();
              }}>
              Reset
            </Button>
          </div>
          <Form form={resetForm} onFinish={onPasswordReset} layout="vertical">
            <Form.Item
              style={{}}
              name="newPassword"
              label="New Passwrod"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input.Password onChange={handlePasswordChange} />
            </Form.Item>
            <Form.Item
              style={{}}
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <Input.Password onChange={handlePasswordChange} />
            </Form.Item>
          </Form>
          <div style={{ marginTop: 10 }}>
            The Password Should have at least 1 Number
          </div>
          <div style={{ marginTop: 10 }}>
            The Password Should be 8 or more characters
          </div>
          <div style={{ marginTop: 10 }}>
            The Password Should have at least 1 Small letter
          </div>
          <div style={{ marginTop: 10 }}>
            The Password Should have at least 1 Capital Letter
          </div>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            The Password Should be at least 1 Special character
          </div>
          <Progress
            percent={(passwordStrength / 5) * 100}
            showInfo={false}
            status={passwordStrength === 5 ? "success" : "normal"}
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
