import React, { useEffect, useState } from "react";
import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import "./Career.css";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";

function isPastDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  return inputDate < today;
}

let originData = [];
let jobkey = "";
const Career = () => {
  const [form] = Form.useForm();
  const [jobLists, setJobLists] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [applyingTo, setApplyingTo] = useState("");
  const [modal2Open, setModal2Open] = useState(false);

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

  const onApplyFinish = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "resume" && value) {
          formData.append(key, value.fileList[0].originFileObj);
        } else {
          formData.append(key, value);
        }
      });

      formData.append("id", applyingTo.key);
      const response = await fetch("http://localhost:8080/job/apply", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        success("Application submitted successfully");
        form.resetFields();
      } else {
        error(response.message || "Failed to submit application");
      }
      setModal2Open(false);
    } catch (error) {
      error("Failed to submit application");
    }
  };
  useEffect(() => {
    const getJobs = async () => {
      const response = await fetch("http://localhost:8080/job/jobList");
      const responseData = await response.json();
      const data = [];
      for (let i = 0; i < responseData.jobs.length; i++) {
        const tags = responseData.jobs[i].tags.join(", ");
        if (
          responseData.jobs[i].status === "Ongoing" &&
          !isPastDate(responseData.jobs[i].deadline)
        ) {
          data.push({
            key: responseData.jobs[i].id,
            title: responseData.jobs[i].jobName,
            tags: `${tags}, ${responseData.jobs[i].jobType}`,
            description: responseData.jobs[i].description,
            deadline: responseData.jobs[i].deadline,
            status: responseData.jobs[i].status,
          });
        }
      }
      originData = data;
      setJobLists([...data]);
    };
    getJobs();
  }, []);

  return (
    <div className="LandingPageCareerClass">
      {contextHolder}
      <div className="CareerPageJobList">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={jobLists}
          // footer={
          //   <div>
          //     <b>ant design</b> footer part
          //   </div>
          // }
          style={{
            marginTop: 0,
            overflow: "auto",
            // height: 300,
            textAlign: "left",
            alignItems: "center",
          }}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              actions={[
                <p>
                  <ClockCircleOutlined /> Deadline: {item.deadline}
                </p>,
                <p>{item.status}</p>,
                <Popconfirm
                  title="Sure want to apply?"
                  onConfirm={() => {
                    setApplyingTo(item);
                    jobkey = item.key;
                    setModal2Open(true);
                  }}>
                  <Button
                    type="ghost"
                    style={{ background: "rgb(3, 201, 136)", color: "white" }}>
                    Apply
                  </Button>
                </Popconfirm>,
              ]}
              extra={
                <img
                  width={200}
                  style={{
                    borderRadius: 10,
                  }}
                  alt="logo"
                  src="https://static.vecteezy.com/system/resources/previews/015/600/160/original/we-are-hiring-job-and-company-vacancy-offer-icon-vector.jpg"
                />
              }>
              <List.Item.Meta
                //   avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.tags}
              />
              {item.description}
            </List.Item>
          )}
        />
      </div>
      <Modal
        title={`Title: ${applyingTo.title}`}
        centered
        width={1000}
        footer={null}
        open={modal2Open}
        onCancel={() => {
          setModal2Open(false);
          form.resetFields();
        }}>
        <Form form={form} onFinish={onApplyFinish} layout="vertical">
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "33%" }}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%" }}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%" }}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Select>
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "33%" }}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%" }}>
              <Form.Item
                initialValue="+251"
                label="Mobile"
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "33%" }}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col style={{ width: "49.3%" }}>
              <Form.Item
                label="Education"
                name="education"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col style={{ width: "49.3%" }}>
              <Form.Item
                label="Experiance"
                name="experiance"
                rules={[
                  {
                    required: true,
                    message: "field is required",
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Form.Item
              style={{ width: "100%" }}
              label="Cover Letter"
              name="coverLetter"
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}>
              <TextArea rows={6} />
            </Form.Item>
          </Row>
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Col>
              <Form.Item
                style={{ width: "100%" }}
                label="Resume"
                name="resume"
                rules={[
                  {
                    required: true,
                    message: "Field is required",
                  },
                ]}>
                <Upload
                  accept=".pdf"
                  beforeUpload={(file) => {
                    // Add additional checks if needed
                    const isPDF = file.type === "application/pdf";
                    if (!isPDF) {
                      message.error("Please upload a PDF file");
                    }
                    return false;
                  }}
                  maxCount={1}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col style={{ marginTop: 30 }}>
              <Form.Item shouldUpdate>
                <Button htmlType="submit" type="primary">
                  Submit Application
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Career;
