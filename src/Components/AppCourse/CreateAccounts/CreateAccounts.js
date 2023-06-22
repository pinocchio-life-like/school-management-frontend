import React, { useEffect, useState } from "react";
import "./CreateAccounts.css";
import Title from "antd/es/typography/Title";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Table,
  message,
} from "antd";

const { Option } = Select;

let originData = [];
const columns = [
  {
    title: "User Name",
    dataIndex: "userName",
  },
  {
    title: "User ID",
    dataIndex: "userId",
  },
  {
    title: "User Type",
    dataIndex: "userType",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "DOB",
    dataIndex: "dob",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const CreateAccounts = () => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState("");
  const [defaultPass, setDefaultPass] = useState("");
  const [tableData, setTableData] = useState([]);

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

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(`http://localhost:8080/users`);
      const responseData = await response.json();

      const data = responseData.users.map((data) => {
        return {
          userName: data.userName,
          userType: data.userType,
          userId: data.userId,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          dob: data.dob,
        };
      });
      setTableData([...data]);
    };
    getUsers();
  }, []);
  const onFinish = async (values) => {
    let dob = new Date(values.dob);
    dob = dob.toLocaleDateString("es-CL");

    const { firstName, lastName, userType, email, mobile, address } = values;

    const userName = `${firstName} ${lastName}`;
    const password = defaultPass;
    const userId = fullName;

    try {
      const response = await fetch(`http://localhost:8080/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          userType: userType,
          email: email,
          password: password,
          userId: userId,
          dob: dob,
          mobile: mobile,
          address: address,
        }),
      });
      const responseData = await response.json();

      if (responseData.status === 403 || responseData.status === 500) {
        throw new Error("Couldnt");
      }

      const data = {
        userName: userName,
        userType: userType,
        email: email,
        password: password,
        userId: userId,
        dob: dob,
        mobile: mobile,
        address: address,
      };
      setTableData([...tableData, data]);
      success("Successfully Created");
      setDefaultPass("");
      setFullName("");
      form.resetFields();
    } catch (err) {
      error("Couldn't Create, check your Connection");
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    const { firstName, lastName, email } = allValues;
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const newFullName = `${firstName}${lastName}${randomNum}`;
    setDefaultPass(email);
    setFullName(newFullName);
  };
  return (
    <div className="CreateAccountsClass">
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Title
          level={3}
          style={{
            textAlign: "left",
            marginBottom: 10,
            marginTop: -10,
            // marginLeft: 20,
          }}>
          CreateAccounts
        </Title>
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}>
          Submit
        </Button>
      </div>

      <div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onValuesChange={handleFormChange}>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "33%" }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="First Name"
                name="firstName">
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%" }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="Last Name"
                name="lastName">
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%", textAlign: "left" }}>
              <div>User ID</div>
              <div
                style={{
                  border: "1px solid blue",
                  height: 29,
                  marginTop: 10,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                }}>
                {fullName}
              </div>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "33%", marginTop: -10, textAlign: "left" }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="User Type"
                name="userType">
                <Select>
                  <Option value="HR Admin">HR Admin</Option>
                  <Option value="School Admin">School Admin</Option>
                  <Option value="Inventory Admin">Inventory Admin</Option>
                  <Option value="Transport Admin">Transport Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ width: "33%", marginTop: -10 }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="Email"
                name="email">
                <Input type="Email" />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%", marginTop: -10, textAlign: "left" }}>
              <div>Default Password</div>
              <div
                style={{
                  border: "1px solid blue",
                  height: 29,
                  marginTop: 10,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                }}>
                {defaultPass}
              </div>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "33%", marginTop: -10 }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="Date of Birth"
                name="dob">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Birth Date"
                />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%", marginTop: -10 }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                initialValue="+251"
                label="Mobile"
                name="mobile">
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%", marginTop: -10 }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}
                label="Address"
                name="address">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Table size="small" dataSource={tableData} columns={columns} />
    </div>
  );
};

export default CreateAccounts;
