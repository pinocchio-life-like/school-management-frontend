import React from "react";
import Title from "antd/es/typography/Title";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
const handleKeyPress = (e) => {
  const charCode = e.which ? e.which : e.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    e.preventDefault();
  }
};

const AddEmployee = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const onFinish = async (values) => {
    let date = new Date(values.dob);
    let dob = date.toLocaleDateString("es-CL");

    try {
      const response = await fetch(
        "http://localhost:8080/employee/employeeList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, dob: dob }),
        }
      );
      const responseData = await response.json();
      console.log(responseData.code);
      if (responseData.code === 404) {
        throw new Error("Check internet Connection");
      }
      success("Employee Successfully Registered");
      form.resetFields();
    } catch (err) {
      error("Check Your internet connection and try again");
      // form.resetFields();
    }
  };
  return (
    <div>
      {contextHolder}
      <div className="AddEmployeeContainer">
        <div>
          <Title
            level={3}
            style={{
              textAlign: "left",
              marginTop: 0,
              fontWeight: 580,
              letterSpacing: 1,
            }}>
            Add Employee
          </Title>
        </div>
        <div className="AddEmployeeForm">
          <Form
            style={{ justifyContent: "left", marginTop: 56 }}
            form={form}
            name="horizontal_login"
            layout="vertical"
            onFinish={onFinish}>
            <Row
              style={{
                marginBottom: 15,
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="First Name"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Input placeholder="Enter First Name" />
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Last Name"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Input placeholder="Enter Last Name" />
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Date Of Birth"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}
                  name="dob"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}>
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                marginBottom: 15,
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Gender"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Select placeholder="Select Gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Email"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}
                  name="phoneNumber"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}>
                  <Input placeholder="Enter Phone Number" />
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                marginBottom: 15,
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="City"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Input placeholder="Enter City" />
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Street"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="street"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Input placeholder="Street" />
                </Form.Item>
              </Col>
              <Col style={{ width: "33%" }}>
                <Form.Item
                  label="Designation"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}
                  name="designation"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}>
                  <Select placeholder="Select Designation">
                    <Option value="Teacher">Teacher</Option>
                    <Option value="Driver">Driver</Option>
                    <Option value="Transport Admin">Transport Admin</Option>
                    <Option value="Inventory Admin">Inventory Admin</Option>
                    <Option value="School Admin">School Admin</Option>
                    <Option value="HR Admin">HR Admin Admin</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ width: "100%", marginBottom: 15 }}>
              <Form.Item
                label="Description"
                style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Information!",
                  },
                ]}>
                <TextArea placeholder="Enter Employee Description" rows={5} />
              </Form.Item>
            </Row>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Col style={{ width: "39.5%" }}>
                <Form.Item
                  label="Job Type"
                  style={{ textAlign: "left", marginTop: -20 }}
                  name="jobType"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <Select
                    style={{ marginTop: -25 }}
                    placeholder="Enter Job Type">
                    <Option value="permanenet">Permanenet</Option>
                    {/* <Option value="contractual">Contractual</Option>
                    <Option value="One Time">One Time</Option>
                    <Option value="Internship">Internship</Option> */}
                  </Select>
                </Form.Item>
              </Col>
              <Col style={{ width: "39.5%" }}>
                <Form.Item
                  label="Net Salary"
                  style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                  name="netSalary"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Information!",
                    },
                  ]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Net Salary"
                  />
                </Form.Item>
              </Col>
              <Col style={{ width: "19%" }}>
                <Form.Item shouldUpdate>
                  {() => (
                    <Button
                      style={{ marginTop: 10, width: "100%" }}
                      type="primary"
                      htmlType="submit">
                      Save
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
