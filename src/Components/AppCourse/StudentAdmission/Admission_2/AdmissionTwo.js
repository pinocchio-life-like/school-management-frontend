import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import Title from "antd/es/typography/Title";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./AdmissionTwo.css";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const globalDate = new Date();
let globalToday = globalDate.getFullYear();
globalToday = `${globalToday}`.slice(2);
const dateFormat = "YYYY-MM-DD";
const { Option } = Select;
const { Panel } = Collapse;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

let originalData = [];
const AdmissionTwo = () => {
  const [form] = Form.useForm();
  const [existingList, setExistingList] = useState([]);
  const [searchForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [signupButtonClick, setSignupButtonClick] = useState("");
  const [isExists, setIsExists] = useState(false);
  const [searchedStudent, setSearchedStudent] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const handleCancel = () => setPreviewOpen(false);
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/admission/studentsList`
        );
        const responseData = await response.json();
        if (responseData.code === 404) {
          throw new Error("No students found");
        }
        originalData = responseData.students;
      } catch (err) {
        setSearchIsLoading(false);
        error("Check for your internet connection and try again");
        return;
      }
    };
    getStudents();
  }, []);
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
  const handleChange = async ({ fileList: newFileList }) => {
    // const ouputted = newFileList[0];
    // console.log(ouputted);
    setFileList(newFileList);
  };
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
  const onFinish = async (values) => {
    setRegisterLoading(true);
    // console.log(fileList[0]);
    // if (!fileList[0].url && !fileList[0].preview) {
    //   fileList[0].preview = await getBase64(fileList[0].originFileObj);
    // }
    // const imageUrl = fileList[0].preview;
    // const formData = new FormData();
    // formData.append("firstName", values.firstName);
    // formData.append("lastName", values.lastName);
    // formData.append("gender", values.gender);
    // formData.append("religion", values.religion);
    // formData.append("admissionNumber", values.admissionNumber);
    // formData.append("grade", values.grade);
    // formData.append("section", values.section);
    // formData.append("rollNumber", values.rollNumber);
    // formData.append("parentFirstName", values.parentFirstName);
    // formData.append("parentLastName", values.parentLastName);
    // formData.append("relation", values.relation);
    // formData.append("phoneNumber", values.phoneNumber);
    // formData.append("email", values.email);
    // formData.append("province", values.province);
    // formData.append("street", values.street);
    // formData.append("houseNumber", values.houseNumber);
    // formData.append("siblingGrade", values.siblingGrade);
    // formData.append("siblingSection", values.siblingSection);
    // formData.append("siblingName", values.siblingName);
    // formData.append("studentProfile", imageUrl);
    // console.log(fileList);

    let date = new Date(values.birthDate);
    let dob = date.toLocaleDateString("es-CL");

    try {
      const response = await fetch("http://localhost:8080/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admissionNumber: generatedId,
          ...values,
          birthDate: dob,
        }),
      });
      const responseData = await response.json();
      setRegisterLoading(false);
      if (responseData.code === 404) {
        error("Email Already Exists");
        form.resetFields();
      } else {
        success("Successfully Registered");
        form.resetFields();
        await fetch(`http://localhost:8080/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: `${values.firstName} ${values.lastName}`,
            userType: "Student",
            email: values.email,
            password: values.email,
            userId: generatedId,
            dob: dob,
            mobile: values.phoneNumber,
            address: `${values.province}, ${values.street}`,
          }),
        });
      }
      setGeneratedId("");
    } catch (err) {
      setRegisterLoading(false);
      error("Check for your internet connection and try again");
    }
  };
  const onExistingFinish = async (values) => {
    setSearchIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/admission/updateStudent",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admissionNumber: searchedStudent.admissionNumber,
            ...values,
          }),
        }
      );
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.code === 404) {
        // form.resetFields();
        throw new Error("Couldn't update Student Data");
      }
      setSearchIsLoading(false);
      success("Student Registered Successfully");
    } catch (err) {
      setSearchIsLoading(false);
      error("Check for your internet connection and try again");
    }
    setGeneratedId("");
  };
  const onSearch = async (value) => {
    setGeneratedId("");
    searchForm.resetFields();
    setSearchIsLoading(true);

    const theStudent = originalData.find((student) => {
      return student.admissionNumber === value;
    });
    if (theStudent) {
      setIsExists(true);
      setSearchedStudent(theStudent);
      setSearchIsLoading(false);
    } else {
      setIsExists(false);
      setSearchIsLoading(false);
      error("Student Does Not Exist");
    }
  };

  return (
    <div>
      <div className="wholeAdmissionTwoContainer">
        <div
          className={`admissionTwoContainer ${signupButtonClick}`}
          id="admissionTwoContainer">
          <div className="form-admissionTwoContainer sign-up-admissionTwoContainer">
            <div>
              <Title
                className="admissionHOne"
                level={3}
                style={{
                  textAlign: "left",
                  marginTop: 5,
                  marginLeft: 25,
                }}>
                Student Admission
              </Title>
              <div
                style={{
                  display: "flex",
                  textAlign: "left",
                  marginBottom: 5,
                }}>
                <Search
                  style={{ marginLeft: 25, marginRight: 12 }}
                  placeholder="Enter Admission Number to Search!"
                  onSearch={onSearch}
                  // enterButton
                />
              </div>
            </div>
            <Form
              form={searchForm}
              onFinish={onExistingFinish}
              className="admissionForm">
              <Spin spinning={searchIsLoading}>
                <div className="social-admissionTwoContainer">
                  {isExists ? (
                    <div>
                      <>
                        <div style={{ marginTop: -15, display: "flex" }}>
                          <div style={{ width: "78%" }}>
                            <>
                              <div
                                style={{ marginTop: "10px", display: "flex" }}>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>
                                    First Name
                                  </div>
                                  <Form.Item
                                    initialValue={`${searchedStudent.firstName}`}
                                    style={{ textAlign: "left" }}
                                    name="firstNameExisiting">
                                    <Input
                                      style={{ width: "100%" }}
                                      placeholder="First Name"
                                      size="middle"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>
                                    Last Name
                                  </div>
                                  <Form.Item
                                    initialValue={`${searchedStudent.lastName}`}
                                    style={{ textAlign: "left" }}
                                    name="lastNameExisiting"
                                    rules={[
                                      {
                                        required: true,
                                        message: "field is required",
                                      },
                                    ]}>
                                    <Input
                                      placeholder="Last Name"
                                      size="middle"
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ display: "flex" }}>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>
                                    Gender
                                  </div>
                                  <Form.Item
                                    initialValue={`${searchedStudent.gender}`}
                                    style={{ textAlign: "left" }}
                                    name="genderExisiting"
                                    rules={[
                                      {
                                        required: true,
                                        message: "field is required",
                                      },
                                    ]}>
                                    <Select placeholder="Gender" size="middle">
                                      <Option value="Male">Male</Option>
                                      <Option value="Female">Female</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>
                                    Birth Date
                                  </div>
                                  <Form.Item
                                    initialValue={dayjs(
                                      `${searchedStudent.birthDate}`,
                                      dateFormat
                                    )}
                                    style={{ textAlign: "left" }}
                                    name="birthDateExisiting"
                                    rules={[
                                      {
                                        required: true,
                                        message: "field is required",
                                      },
                                    ]}>
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      placeholder="Birth Date"
                                    />
                                  </Form.Item>
                                </Col>
                              </div>
                              <div style={{ display: "flex" }}>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>
                                    Religion
                                  </div>
                                  <Form.Item
                                    initialValue={`${searchedStudent.religion}`}
                                    style={{ textAlign: "left" }}
                                    name="religionExisiting"
                                    rules={[
                                      {
                                        required: true,
                                        message: "field is required",
                                      },
                                    ]}>
                                    <Input
                                      placeholder="Religion"
                                      size="middle"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  style={{ width: "50%", marginLeft: "15px" }}>
                                  <div style={{ textAlign: "left" }}>Class</div>
                                  <Form.Item
                                    initialValue={`${searchedStudent.grade}`}
                                    style={{ textAlign: "left" }}
                                    name="gradeExisiting"
                                    rules={[
                                      {
                                        required: true,
                                        message: "field is required",
                                      },
                                    ]}>
                                    <Select placeholder="Class" size="middle">
                                      <Option value="Grade 1">Grade 1</Option>
                                      <Option value="Grade 2">Grade 2</Option>
                                      <Option value="Grade 3">Grade 3</Option>
                                      <Option value="Grade 4">Grade 4</Option>
                                      <Option value="Grade 5">Grade 5</Option>
                                      <Option value="Grade 6">Grade 6</Option>
                                      <Option value="Grade 7">Grade 7</Option>
                                      <Option value="Grade 8">Grade 8</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </div>
                            </>
                          </div>
                          <div style={{ width: "22%", marginTop: 17 }}>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  marginLeft: 5,
                                  height: 205,
                                  width: 205,
                                }}>
                                <div className="setUploadSize setSizeClassName">
                                  <ImgCrop rotate>
                                    <Upload
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
                          </div>
                        </div>
                        <div>
                          <Row style={{ marginTop: -5 }}>
                            <Col style={{ width: "37.7%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>
                                Admission Number
                              </div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                rules={[
                                  {
                                    required: false,
                                    message: "field is required",
                                  },
                                ]}>
                                <div
                                  style={{
                                    border: "1px solid #AAE3E2",
                                    height: "33px",
                                    borderRadius: "6px",
                                    textAlign: "left",
                                    paddingTop: "4px",
                                    paddingLeft: "10px",
                                    marginTop: 0,
                                  }}>
                                  <strong>
                                    {searchedStudent.admissionNumber}
                                  </strong>
                                </div>
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "37.7%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>Section</div>
                              <Form.Item
                                initialValue={`${searchedStudent.section}`}
                                style={{ textAlign: "left" }}
                                name="sectionExisiting"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Select placeholder="Section" size="middle">
                                  <Option value="A">A</Option>
                                  <Option value="B">B</Option>
                                  <Option value="C">C</Option>
                                  <Option value="D">D</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "20.1%", marginLeft: "10px" }}>
                              <div style={{ textAlign: "left" }}>
                                Roll Number
                              </div>
                              <Form.Item
                                initialValue={`${searchedStudent.rollNumber}`}
                                style={{ textAlign: "left" }}
                                name="rollNumberExisiting"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Input
                                  placeholder="Roll Number"
                                  size="middle"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <div>
                            <Title
                              level={4}
                              style={{
                                textAlign: "left",
                                marginTop: -10,
                                marginLeft: 15,
                              }}>
                              Parent Guardian information
                            </Title>
                          </div>

                          <div>
                            <Row style={{ marginTop: "0px" }}>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  First Name
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.parentFirstName}`}
                                  style={{ textAlign: "left" }}
                                  name="parentFirstNameExisiting">
                                  <Input
                                    placeholder="First Name"
                                    size="middle"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  Last Name
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.parentLastName}`}
                                  style={{ textAlign: "left" }}
                                  name="parentLastNameExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input
                                    placeholder="Last Name"
                                    size="middle"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "31.9%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  Relation
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.parentRelation}`}
                                  style={{ textAlign: "left" }}
                                  name="parentRelationExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input placeholder="Relation" size="middle" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row style={{ marginTop: "0px" }}>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  Phone Number
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.parentPhoneNumber}`}
                                  style={{ textAlign: "left" }}
                                  name="parentPhoneNumberExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input
                                    style={{ width: "100%" }}
                                    placeholder="Phone Number"
                                    size="middle"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>Email</div>
                                <Form.Item
                                  initialValue={`${searchedStudent.email}`}
                                  style={{ textAlign: "left" }}
                                  name="emailExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input
                                    disabled
                                    type="email"
                                    placeholder="default size"
                                    size="middle"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "31.9%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  Province
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.province}`}
                                  style={{ textAlign: "left" }}
                                  name="provinceExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input placeholder="Province" size="middle" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row style={{ marginTop: "0px" }}>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>Street</div>
                                <Form.Item
                                  initialValue={`${searchedStudent.street}`}
                                  style={{ textAlign: "left" }}
                                  name="streetExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input placeholder="street" size="middle" />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "31.5%", marginLeft: "15px" }}>
                                <div style={{ textAlign: "left" }}>
                                  House Number
                                </div>
                                <Form.Item
                                  initialValue={`${searchedStudent.houseNumber}`}
                                  style={{ textAlign: "left" }}
                                  name="houseNumberExisiting"
                                  rules={[
                                    {
                                      required: true,
                                      message: "field is required",
                                    },
                                  ]}>
                                  <Input
                                    placeholder="default size"
                                    size="middle"
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                style={{ width: "30.5%", marginLeft: "15px" }}>
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
                  ) : (
                    ""
                  )}
                  {contextHolder}
                </div>
              </Spin>
            </Form>
          </div>
          <div className="form-admissionTwoContainer sign-in-admissionTwoContainer">
            <Form form={form} onFinish={onFinish} className="admissionForm">
              <Spin spinning={registerLoading}>
                <div>
                  <div style={{ display: "flex" }}>
                    <div>
                      <Title
                        level={3}
                        style={{
                          textAlign: "left",
                          marginTop: 5,
                          marginLeft: 15,
                        }}>
                        Student Admission
                      </Title>
                    </div>
                    {/* <div style={{ textAlign: "right", marginLeft: 639 }}>
                      <Form.Item shouldUpdate>
                        {() => (
                          <Button
                            style={{ marginTop: 5 }}
                            type="primary"
                            htmlType="submit">
                            Save Student
                          </Button>
                        )}
                      </Form.Item>
                    </div> */}
                  </div>

                  <>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "22%", marginTop: 17 }}>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              marginLeft: 15,
                              height: 205,
                              width: 205,
                            }}>
                            <div className="setUploadSize setSizeClassName">
                              <ImgCrop rotate>
                                <Upload
                                  customRequest={({ file, onSuccess }) => {
                                    setTimeout(() => {
                                      onSuccess("ok");
                                    }, 0);
                                  }}
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
                      </div>
                      <div style={{ width: "78%" }}>
                        <>
                          <div style={{ marginTop: "10px", display: "flex" }}>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>
                                First Name
                              </div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="firstName"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Input
                                  style={{ width: "100%" }}
                                  placeholder="First Name"
                                  size="middle"
                                />
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>Last Name</div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="lastName"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Input placeholder="Last Name" size="middle" />
                              </Form.Item>
                            </Col>
                          </div>
                          <div style={{ display: "flex" }}>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>Gender</div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="gender"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Select placeholder="Gender" size="middle">
                                  <Option value="Male">Male</Option>
                                  <Option value="Female">Female</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>
                                Birth Date
                              </div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="birthDate"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <DatePicker
                                  style={{ width: "100%" }}
                                  placeholder="Birth Date"
                                />
                              </Form.Item>
                            </Col>
                          </div>
                          <div style={{ display: "flex" }}>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>Religion</div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="religion"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Input placeholder="Religion" size="middle" />
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "50%", marginLeft: "15px" }}>
                              <div style={{ textAlign: "left" }}>Class</div>
                              <Form.Item
                                style={{ textAlign: "left" }}
                                name="grade"
                                rules={[
                                  {
                                    required: true,
                                    message: "field is required",
                                  },
                                ]}>
                                <Select
                                  onChange={(value) => {
                                    let rand = Math.random() * 1000;
                                    rand = `${Math.floor(rand)}`;
                                    if (rand.length === 1) {
                                      rand = `00${rand}`;
                                    }
                                    if (rand.length === 2) {
                                      rand = `0${rand}`;
                                    }
                                    if (value === "Grade 1") {
                                      rand = `1ST${rand}${globalToday}`;
                                    } else if (value === "Grade 2") {
                                      rand = `2ND${rand}${globalToday}`;
                                    } else if (value === "Grade 3") {
                                      rand = `3RD${rand}${globalToday}`;
                                    } else {
                                      rand = `${value.slice(
                                        -1
                                      )}TH${rand}${globalToday}`;
                                    }
                                    setGeneratedId(rand);
                                  }}
                                  placeholder="Grade"
                                  size="middle">
                                  <Option value="Grade 1">Grade 1</Option>
                                  <Option value="Grade 2">Grade 2</Option>
                                  <Option value="Grade 3">Grade 3</Option>
                                  <Option value="Grade 4">Grade 4</Option>
                                  <Option value="Grade 5">Grade 5</Option>
                                  <Option value="Grade 6">Grade 6</Option>
                                  <Option value="Grade 7">Grade 7</Option>
                                  <Option value="Grade 8">Grade 8</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </div>
                        </>
                      </div>
                    </div>
                    <div>
                      <Row style={{ marginTop: -5 }}>
                        <Col style={{ width: "21.2%", marginLeft: "15px" }}>
                          <div style={{ textAlign: "left" }}>
                            Admission Number
                          </div>
                          <Form.Item
                            style={{ textAlign: "left" }}
                            rules={[
                              {
                                required: false,
                                message: "field is required",
                              },
                            ]}>
                            <div
                              style={{
                                border: "1px solid #AAE3E2",
                                height: "33px",
                                borderRadius: "6px",
                                textAlign: "left",
                                paddingTop: "4px",
                                paddingLeft: "10px",
                                marginTop: 0,
                              }}>
                              <strong>{generatedId}</strong>
                            </div>
                          </Form.Item>
                        </Col>
                        <Col style={{ width: "37.5%", marginLeft: "8px" }}>
                          <div style={{ textAlign: "left" }}>Section</div>
                          <Form.Item
                            style={{ textAlign: "left" }}
                            name="section"
                            rules={[
                              {
                                required: true,
                                message: "field is required",
                              },
                            ]}>
                            <Select placeholder="Section" size="middle">
                              <Option value="A">A</Option>
                              <Option value="B">B</Option>
                              <Option value="C">C</Option>
                              <Option value="D">D</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col style={{ width: "37.3%", marginLeft: "15px" }}>
                          <div style={{ textAlign: "left" }}>Roll Number</div>
                          <Form.Item
                            style={{ textAlign: "left" }}
                            name="rollNumber"
                            rules={[
                              {
                                required: true,
                                message: "field is required",
                              },
                            ]}>
                            <Input placeholder="Roll Number" size="middle" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <div>
                        <Title
                          level={4}
                          style={{
                            textAlign: "left",
                            marginTop: 0,
                            marginLeft: 15,
                          }}>
                          Parent Guardian information
                        </Title>
                      </div>

                      <div>
                        <Row style={{ marginTop: "0px" }}>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>First Name</div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="parentFirstName"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
                              <Input placeholder="First Name" size="middle" />
                            </Form.Item>
                          </Col>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>Last Name</div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="parentLastName"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
                              <Input placeholder="Last Name" size="middle" />
                            </Form.Item>
                          </Col>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>Relation</div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="parentRelation"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
                              <Input placeholder="Relation" size="middle" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "0px" }}>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>
                              Phone Number
                            </div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="parentPhoneNumber"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
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
                              style={{ textAlign: "left" }}
                              name="email"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
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
                              style={{ textAlign: "left" }}
                              name="province"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
                              <Input placeholder="Province" size="middle" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "0px" }}>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>Street</div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="street"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
                              <Input placeholder="street" size="middle" />
                            </Form.Item>
                          </Col>
                          <Col style={{ width: "30.5%", marginLeft: "15px" }}>
                            <div style={{ textAlign: "left" }}>
                              House Number
                            </div>
                            <Form.Item
                              style={{ textAlign: "left" }}
                              name="houseNumber"
                              rules={[
                                {
                                  required: true,
                                  message: "field is required",
                                },
                              ]}>
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
                    {/* <div style={{ marginTop: 9 }}>
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
                                name="siblingGrade"
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
                            <div style={{ textAlign: "left", margin: 0 }}>
                              Name
                            </div>
                            <Row>
                              <Form.Item
                                name="siblingName"
                                style={{ width: "100%" }}>
                                <Input placeholder="Enter Name" />
                              </Form.Item>
                            </Row>
                          </Col>
                        </Panel>
                      </Collapse>
                    </div> */}
                  </>
                </div>
              </Spin>
            </Form>
          </div>

          <div className="admissionOverlay-admissionTwoContainer">
            <div className="admissionOverlay">
              <div
                className="admissionOverlay-panel admissionOverlay-left"
                style={{ marginTop: 250 }}>
                <h1 className="admissionHOne" style={{ marginTop: -610 }}>
                  Welcome Back!
                </h1>
                <p className="admissionP">
                  Please Search For Id To Check If Already Existing!
                </p>
                <button
                  style={{ marginTop: 330 }}
                  className="admissionButton ghost"
                  id="signIn"
                  onClick={() => {
                    setSignupButtonClick("");
                    setIsExists(false);
                  }}>
                  New Comer
                </button>
              </div>
              <div
                className="admissionOverlay-panel admissionOverlay-right"
                style={{ marginTop: 250 }}>
                <h1 className="admissionHOne" style={{ marginTop: -610 }}>
                  Hello, and Welcome!
                </h1>
                <p className="admissionP">
                  We Appreciate Your Decision To Join Us!
                </p>
                <div>
                  <button
                    style={{ marginTop: 330 }}
                    className="admissionButton ghost "
                    id="signUp"
                    onClick={() => {
                      setSignupButtonClick("right-panel-active");
                    }}>
                    Already Existing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTwo;
