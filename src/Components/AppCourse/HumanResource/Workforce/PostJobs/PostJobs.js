import React from "react";
import "./PostJobs.css";
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
const PostJobs = () => {
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
    console.log(values);
    let date = new Date(values.deadline);
    let deadline = date.toLocaleDateString("es-CL");

    try {
      const response = await fetch("http://localhost:8080/job/jobList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, deadline: deadline }),
      });
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Check internet Connection");
      }
      form.resetFields();
      success("Course Successfully Registered");
    } catch (err) {
      error("Check Your internet connection and try again");
    }
  };
  return (
    <div className="PostJobsContainer">
      {contextHolder}
      <div className="JobPostBoard">
        <Title
          className="JobPostTitle"
          level={1}
          style={{
            color: "aliceblue",
            textAlign: "center",
            width: "100vw",
            lineHeight: "25vh",
            marginTop: 0,
            fontWeight: 800,
            letterSpacing: 5,
          }}>
          Post Vacancies
        </Title>
      </div>
      <div className="JobDescriptionWrite">
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
            <Col style={{ width: "70%" }}>
              <Form.Item
                label="Job Name"
                style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                name="jobName"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Information!",
                  },
                ]}>
                <Input placeholder="Enter Job Name" />
              </Form.Item>
            </Col>
            <Col style={{ width: "29%" }}>
              <Form.Item
                label="Application Deadline"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Information!",
                  },
                ]}
                name="deadline"
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
            <Col style={{ width: "70%" }}>
              <Form.Item
                label="Tags"
                style={{ width: "100%", textAlign: "left", marginTop: -20 }}
                name="tags"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Information!",
                  },
                ]}>
                <Select
                  mode="tags"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Tags Mode"
                />
              </Form.Item>
            </Col>
            <Col style={{ width: "29%" }}>
              <Form.Item
                label="Designation"
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginTop: -18,
                }}
                name="designation"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Information!",
                  },
                ]}>
                <Select
                  style={{ marginTop: -25 }}
                  placeholder="Select Designation">
                  <Option value="Teacher">Teacher</Option>
                  <Option value="Transport Manager">Transport Manager</Option>
                  <Option value="Inventory Manager">Inventory Manager</Option>
                  <Option value="Driver">Driver</Option>
                  {/* <Option value="Grade 5">Grade 5</Option>
                  <Option value="Grade 6">Grade 6</Option>
                  <Option value="Grade 7">Grade 7</Option>
                  <Option value="Grade 8">Grade 8</Option> */}
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
              <TextArea placeholder="Enter Job Description" rows={5} />
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
                <Select style={{ marginTop: -25 }} placeholder="Enter Job Type">
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
  );
};

export default PostJobs;
