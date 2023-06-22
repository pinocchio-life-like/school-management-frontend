import Title from "antd/es/typography/Title";
import React from "react";
import "./StudentAdmission.css";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  Collapse,
  Select,
  DatePicker,
  InputNumber,
  Button,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { createBrowserHistory } from "@remix-run/router";
const { Panel } = Collapse;
const { Option } = Select;
const SiblingInfo = <></>;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const StudentAdmission = () => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}>
        Upload
      </div>
    </div>
  );
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div>
      <Form noStyle onFinish={onFinish}>
        <div className="StudentAddmissionContainer">
          <div className="StudentAddmissionTitle">
            <Title
              level={3}
              style={{
                textAlign: "left",
                marginTop: 5,
                marginLeft: 5,
              }}>
              Student Admission
            </Title>
          </div>
          <>
            <div className="PhotoAndSibling">
              <div className="AddPhoto">
                <div className="setSizeClassName">
                  <div className="setUploadSize">
                    <ImgCrop rotate>
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}>
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
                    </ImgCrop>
                  </div>
                </div>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}>
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </div>
              <div className="SiblingInfo" style={{ marginTop: 9 }}>
                <Collapse
                  //   style={{ marginBottom: -30 }}
                  expandIcon={({ isActive }) => (
                    <PlusOutlined rotate={isActive ? 90 : 0} />
                  )}
                  bordered={false}
                  defaultActiveKey={["1"]}
                  onChange={(key) => {
                    console.log(key);
                  }}>
                  <Panel
                    style={{ textAlign: "left" }}
                    header="Add Sibling"
                    key="1">
                    <Col style={{ width: "100%" }}>
                      <div
                        style={{
                          textAlign: "left",
                          margin: 0,
                        }}>
                        Class
                      </div>
                      <Row>
                        <Form.Item
                          name="siblingClass"
                          style={{ width: "100%" }}>
                          <Select
                            style={{ textAlign: "left" }}
                            placeholder="Select Class">
                            <Option value="Grade 1">Grade 1</Option>
                            <Option value="Grade 2">Grade 2</Option>
                            <Option value="Grade 3">Grade 3</Option>
                            <Option value="Grade 4">Grade 4</Option>
                            <Option value="Grade 5">Grade 5</Option>
                            <Option value="Grade 6">Grade 6</Option>
                            <Option value="Grade 7">Grade 7</Option>
                          </Select>
                        </Form.Item>
                      </Row>
                      <div style={{ textAlign: "left", margin: 0 }}>
                        Section
                      </div>
                      <Row>
                        <Form.Item
                          name="siblingSection"
                          style={{ width: "100%" }}>
                          <Select
                            style={{ textAlign: "left", width: "100%" }}
                            placeholder="Select Section">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                          </Select>
                        </Form.Item>
                      </Row>
                      <div style={{ textAlign: "left", margin: 0 }}>Name</div>
                      <Row>
                        <Form.Item name="siblingName" style={{ width: "100%" }}>
                          <Input placeholder="Enter Name" />
                        </Form.Item>
                      </Row>
                    </Col>
                  </Panel>
                </Collapse>
              </div>
            </div>
            <div className="StudentAddForm">
              <>
                <Row style={{ marginTop: "10px" }}>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>First Name</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="firstName">
                      <Input placeholder="First Name" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Last Name</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="lastName"
                      rules={[]}>
                      <Input placeholder="Last Name" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Gender</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="gender"
                      rules={[]}>
                      <Select placeholder="Gender" size="middle">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Birth Date</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="birthDate"
                      rules={[]}>
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Birth Date"
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Religion</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="religion"
                      rules={[]}>
                      <Input placeholder="Religion" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Admission Number</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="admissionNumber"
                      rules={[]}>
                      <Input placeholder="Admission Number" size="middle" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Class</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="class"
                      rules={[]}>
                      <Select placeholder="Class" size="middle">
                        <Option value="Grade 1">Grade 1</Option>
                        <Option value="Grade 2">Grade 2</Option>
                        <Option value="Grade 3">Grade 3</Option>
                        <Option value="Grade 4">Grade 4</Option>
                        <Option value="Grade 5">Grade 5</Option>
                        <Option value="Grade 6">Grade 6</Option>
                        <Option value="Grade 7">Grade 7</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Section</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="section"
                      rules={[]}>
                      <Select placeholder="Section" size="middle">
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                        <Option value="C">C</Option>
                        <Option value="D">D</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Roll Number</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="rollNumber"
                      rules={[]}>
                      <Input placeholder="Roll Number" size="middle" />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            </div>
            <div className="ParentDetail">
              <div className="ParentDetailName">
                <Title
                  level={4}
                  style={{ textAlign: "left", marginTop: 0, marginLeft: 15 }}>
                  Parent Guardian information
                </Title>
              </div>
              <div className="ParentDetailForm">
                <Row style={{ marginTop: "0px" }}>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>First Name</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="parentFirstName">
                      <Input placeholder="First Name" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Last Name</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="parentLastName"
                      rules={[]}>
                      <Input placeholder="Last Name" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Relation</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="parentRelation"
                      rules={[]}>
                      <Input placeholder="Relation" size="middle" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginTop: "0px" }}>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Phone Number</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="parentPhoneNumber"
                      rules={[]}>
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Phone Number"
                        size="middle"
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Email</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="email"
                      rules={[]}>
                      <Input
                        type="email"
                        placeholder="default size"
                        size="middle"
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Province</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="province"
                      rules={[]}>
                      <Input placeholder="Province" size="middle" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginTop: "0px" }}>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>Street</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="street"
                      rules={[]}>
                      <Input placeholder="street" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    <div style={{ textAlign: "left" }}>House Number</div>
                    <Form.Item
                      // label="Courses"
                      style={{ textAlign: "left" }}
                      name="houseNumber"
                      rules={[]}>
                      <Input placeholder="default size" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                    {/* <div style={{ textAlign: "left" }}>Province</div> */}
                    <Form.Item shouldUpdate>
                      {() => (
                        <Button
                          style={{ width: "100%", marginTop: 22 }}
                          type="primary"
                          htmlType="submit">
                          Save Student
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        </div>
      </Form>
    </div>
  );
};

export default StudentAdmission;
