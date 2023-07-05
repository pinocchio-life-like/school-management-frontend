import React, { useEffect, useState } from "react";
import "./EmployeeList.css";
import Title from "antd/es/typography/Title";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tabs,
  Typography,
  message,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;
const handleKeyPress = (e) => {
  const charCode = e.which ? e.which : e.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    e.preventDefault();
  }
};

const EmployeeList = () => {
  const [form] = Form.useForm();
  const [leaveForm] = Form.useForm();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [onRecord, setOnRecord] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updated, setUpdated] = useState(false);
  const [count, setCount] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const response = await fetch(
        "http://localhost:8080/employee/employeeList"
      );
      const responseData = await response.json();
      const data = [];
      let totalEmp = 0;
      let leaveEmp = 0;
      let activeEmp = 0;
      let suspendedEmp = 0;
      for (let i = 0; i < responseData.employees.length; i++) {
        totalEmp = totalEmp + 1;

        if (responseData.employees[i].status === "On leave") {
          leaveEmp = leaveEmp + 1;
        }
        if (responseData.employees[i].status === "Active") {
          activeEmp = activeEmp + 1;
        }
        if (responseData.employees[i].status === "Suspended") {
          suspendedEmp = suspendedEmp + 1;
        }
        data.push({
          key: responseData.employees[i].employeeId,
          employeeName: `${responseData.employees[i].firstName} ${responseData.employees[i].lastName}`,
          firstName: responseData.employees[i].firstName,
          lastName: responseData.employees[i].lastName,
          gender: responseData.employees[i].gender,
          employeeId: responseData.employees[i].employeeId,
          description: responseData.employees[i].description,
          email: responseData.employees[i].email,
          designation: responseData.employees[i].designation,
          jobType: responseData.employees[i].jobType,
          dob: responseData.employees[i].dob,
          phoneNumber: responseData.employees[i].phoneNumber,
          salary: responseData.employees[i].netSalary,
          address: `${responseData.employees[i].city}, ${responseData.employees[i].street}`,
          city: responseData.employees[i].city,
          street: responseData.employees[i].street,
          status: responseData.employees[i].status,
          startDate: responseData.employees[i].startDate,
          endDate: responseData.employees[i].endDate,
          employeeImage:
            "https://ichef.bbci.co.uk/news/800/cpsprodpb/F07C/production/_116946516_af324088-7b4f-424e-b35e-e95ebe5d1c9d.jpg",
        });
      }
      setTableData([...data]);
      setCount({
        totalEmp: totalEmp,
        leaveEmp: leaveEmp,
        activeEmp: activeEmp,
        suspendedEmp: suspendedEmp,
      });
    };
    getEmployees();
  }, [updated]);

  const showDrawer = (record) => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOnRecord([]);
    setOpenDrawer(false);
  };

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
    date = date.toLocaleDateString("es-CL");
    try {
      const response = await fetch(
        `http://localhost:8080/employee/employeeList/${onRecord.key}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ ...values, dob: date }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw Error("failed");
      }
      success("Employee Updated Successfully");
      form.resetFields();
      setOnRecord([]);
      setOpenDrawer(false);
      setUpdated((prev) => !prev);
    } catch (err) {
      error("Check yout Internet and try Again!");
    }
  };
  const leaveFinish = async (values) => {
    let startDate = new Date(values.leavePeriod[0]);
    startDate = startDate.toLocaleDateString("es-CL");

    let endDate = new Date(values.leavePeriod[1]);
    endDate = endDate.toLocaleDateString("es-CL");
    try {
      const response = await fetch(
        `http://localhost:8080/employee/employeeLeave/${onRecord.key}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            startDate: startDate,
            endDate: endDate,
            leaveReason: values.leaveReason,
            designation: onRecord.designation,
            jobType: onRecord.jobType,
            employeeName: onRecord.employeeName,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw Error("failed");
      }
      success("Employee Sent to Leave");
      leaveForm.resetFields();
      setModal2Open(false);
      setUpdated((prev) => !prev);
    } catch (err) {
      error("Check yout Internet and try Again!");
    }
  };
  const onSuspend = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/employee/employeeSuspend/${onRecord.key}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ suspend: "suspend" }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw Error("failed");
      }
      success("Employee Suspended");
      setUpdated((prev) => !prev);
      setOpenDrawer(false);
    } catch (err) {
      error("Check yout Internet and try Again!");
    }
  };

  const onActivate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/employee/employeeActivate/${onRecord.key}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ suspend: "activate" }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw Error("failed");
      }
      success("Employee Activated");
      setUpdated((prev) => !prev);
      setOpenDrawer(false);
    } catch (err) {
      error("Check yout Internet and try Again!");
    }
  };

  const endLeave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/employee/endLeave/${onRecord.key}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ status: "Active" }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw Error("failed");
      }
      success("Leave Ended Successfully");
      setUpdated((prev) => !prev);
      setOpenDrawer(false);
    } catch (err) {
      error("Check yout Internet and try Again!");
    }
  };
  const column = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeId",
    },
    {
      title: "DOB",
      dataIndex: "dob",
    },
    {
      title: "Mobile Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Job type",
      dataIndex: "jobType",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Salary",
      dataIndex: "salary",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "4%",
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                setOnRecord({ ...record });
                showDrawer(record);
              }}>
              <EyeOutlined />
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                title="Delete Employee?"
                onConfirm={async () => {
                  const response = await fetch(
                    `http://localhost:8080/employee/employeeList/${record.key}`,
                    {
                      method: "DELETE",
                    }
                  );
                  const responseData = await response.json();
                  if (responseData.status === 404) {
                    message.error("Employee Delete Failed");
                    tableData.splice(tableData.indexOf(record), 1);
                    setTableData(tableData);
                    return;
                  }
                  message.success("Employee Deleted Successfully");
                }}>
                <DeleteOutlined style={{ marginLeft: 5 }} />
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      {contextHolder}
      <div className="EmployeeListContainer">
        <div className="PayrollListHeader">
          <div style={{ textAlign: "left" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Employee List
            </Title>
          </div>
          <div>
            {/* <div>
              <Select
                style={{
                  width: 220,
                  textAlign: "left",
                  marginRight: 10,
                }}
                placeholder="Designation">
                <Option value="Teacher">Teacher</Option>
                <Option value="Transport Manager">Transport Manager</Option>
                <Option value="Inventory Manager">Inventory Manager</Option>
                <Option value="Driver">Driver</Option>
              </Select>
            </div> */}
          </div>
        </div>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#5DADE2" }}>
                  <div className="LeaveReportCardTitle">Employees</div>
                  <div className="LeaveReportCardNumber">{count.totalEmp}</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#FFA500" }}>
                  <div className="LeaveReportCardTitle">Active</div>
                  <div className="LeaveReportCardNumber">{count.activeEmp}</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#82E0AA" }}>
                  <div className="LeaveReportCardTitle">On leave</div>
                  <div className="LeaveReportCardNumber">{count.leaveEmp}</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#FF6B6B" }}>
                  <div className="LeaveReportCardTitle">Suspended</div>
                  <div className="LeaveReportCardNumber">
                    {count.suspendedEmp}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Table
          style={{ marginTop: 20 }}
          size="small"
          dataSource={tableData}
          columns={column}
          pagination={{ pageSize: 13 }}
        />
        <Drawer
          title={
            <Tabs type="card" style={{ height: 36 }}>
              <Tabs.TabPane tab="Profile Details" key="1">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "107.5%",
                  }}>
                  <div
                    style={{
                      width: "25%",
                      background: "white",
                      height: "90vh",
                      borderRadius: 8,
                    }}>
                    <div>
                      <div
                        style={{
                          marginTop: 20,
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}>
                        <Avatar
                          size={90}
                          src="https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg"
                        />
                        <div>
                          <Title
                            level={3}
                            style={{
                              color: "black",
                              marginTop: 15,
                            }}>
                            {onRecord.employeeName}
                          </Title>
                        </div>
                        <div>
                          <Title
                            level={5}
                            style={{
                              color: "black",
                              marginTop: 5,
                            }}>
                            Started On: {onRecord.startDate}
                          </Title>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 20,
                          }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 50,
                              width: 50,
                              borderRadius: "100%",
                              marginRight: 10,
                              background: "#f1f1f1",
                            }}>
                            <MailOutlined />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 50,
                              width: 50,
                              borderRadius: "100%",
                              marginRight: 10,
                              background: "#f1f1f1",
                            }}>
                            <CalendarOutlined />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 50,
                              width: 50,
                              borderRadius: "100%",
                              background: "#f1f1f1",
                            }}>
                            <PhoneOutlined />
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 15,
                            width: "100%",
                            border: "0.2px solid #f1f1f1",
                          }}></div>

                        {onRecord.status === "On leave" ? (
                          <Button
                            type="primary"
                            style={{
                              marginTop: 10,
                              // background: "#FF8551",
                              height: 40,
                              borderRadius: 9,
                              color: "white",
                              fontWeight: 700,
                            }}>
                            <Popconfirm
                              title="Sure want to end leave?"
                              onConfirm={() => {
                                endLeave();
                              }}>
                              End Leave
                            </Popconfirm>
                          </Button>
                        ) : (
                          <div
                            style={{
                              marginTop: 10,
                              display: "flex",
                              justifyContent: "center",
                            }}>
                            {onRecord.status === "Suspended" ? (
                              <Button
                                type="primary"
                                style={{
                                  borderRadius: 20,
                                  background: "#03C988",
                                  color: "white",
                                  fontWeight: 500,
                                  letterSpacing: 1,
                                  marginLeft: 6,
                                }}>
                                <Popconfirm
                                  onConfirm={() => {
                                    onActivate();
                                  }}
                                  title="Sure Want to Activate?">
                                  Activate
                                </Popconfirm>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  disabled={
                                    onRecord.status === "Suspended" ||
                                    onRecord.status === "On leave"
                                  }
                                  type="primary"
                                  style={{
                                    borderRadius: 20,
                                    background: "#03C988",
                                    color: "white",
                                    fontWeight: 500,
                                    letterSpacing: 1,
                                  }}
                                  onClick={() => {
                                    setModal2Open(true);
                                  }}>
                                  Leave
                                </Button>
                                <Button
                                  disabled={
                                    onRecord.status === "Suspended" ||
                                    onRecord.status === "On leave"
                                  }
                                  type="primary"
                                  style={{
                                    borderRadius: 20,
                                    background: "salmon",
                                    color: "white",
                                    fontWeight: 500,
                                    letterSpacing: 1,
                                    marginLeft: 6,
                                  }}>
                                  <Popconfirm
                                    onConfirm={() => {
                                      onSuspend();
                                    }}
                                    title="Sure Want to Suspend?">
                                    Suspend
                                  </Popconfirm>
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        <div
                          style={{
                            marginTop: 10,
                            width: "100%",
                            border: "0.2px solid #f1f1f1",
                          }}></div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 40,
                        }}>
                        <div style={{ fontWeight: 480 }}></div>
                        <div
                          style={{
                            marginTop: 10,
                            background: "#f1f1f1",
                            height: 60,
                            marginRight: 40,
                            borderRadius: 9,
                          }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              textAlign: "left",
                              marginLeft: 10,
                              paddingTop: 6,
                            }}>
                            <div>{onRecord.designation}</div>
                            <div style={{ fontWeight: 400 }}>
                              {onRecord.jobType}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "space-between",
                            marginRight: 40,
                            border: "1px solid #f1f1f1",
                            borderRadius: 6,
                          }}>
                          <div style={{ marginLeft: 5 }}>Status</div>
                          <div
                            style={{
                              marginRight: 5,
                              display: "flex",
                              justifyContent: "center",
                            }}>
                            <div
                              style={{
                                background: "#FC7300",
                                marginTop: 7,
                                width: 8,
                                height: 8,
                                borderRadius: "100%",
                                marginRight: 3,
                              }}></div>
                            <div style={{ fontWeight: 400 }}>
                              {onRecord.status}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          width: "100%",
                          border: "0.2px solid #f1f1f1",
                        }}></div>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 40,
                        }}>
                        <div>Contact Details</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 35,
                              width: 35,
                              borderRadius: "100%",
                              background: "#f1f1f1",
                            }}>
                            <PhoneOutlined />
                          </div>
                          <div style={{ marginLeft: 8 }}>
                            {" "}
                            +251{onRecord.phoneNumber}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 35,
                              width: 35,
                              borderRadius: "100%",
                              background: "#f1f1f1",
                            }}>
                            <MailOutlined />
                          </div>
                          <div style={{ marginLeft: 8 }}>{onRecord.email}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 35,
                              width: 35,
                              borderRadius: "100%",
                              background: "#f1f1f1",
                            }}>
                            <EnvironmentOutlined />
                          </div>
                          <div style={{ marginLeft: 8 }}>
                            {onRecord.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "73%",
                      background: "white",
                      height: "90vh",
                      borderRadius: 8,
                    }}>
                    <div style={{ margin: 40 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 22, fontWeight: 550 }}>
                          Personal Details
                        </div>
                        <div
                          style={{
                            marginTop: 20,
                            width: "50%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}>
                          <div>
                            <div>First Name</div>
                            <div>{onRecord.firstName}</div>
                          </div>
                          <div>
                            <div>Last Name</div>
                            <div>{onRecord.lastName}</div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 20,
                            width: "52%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}>
                          <div>
                            <div>Gender</div>
                            <div>{onRecord.gender}</div>
                          </div>
                          <div>
                            <div>Date Of Birth</div>
                            <div>{onRecord.dob}</div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          width: "100%",
                          border: "0.2px solid #f1f1f1",
                        }}></div>
                      <div
                        style={{
                          marginTop: 20,
                          fontSize: 22,
                          fontWeight: 550,
                        }}>
                        Description
                      </div>
                      <div>
                        <p style={{ fontSize: 13 }}>{onRecord.description}</p>
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          fontSize: 22,
                          fontWeight: 550,
                        }}>
                        Designation
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "80%",
                        }}>
                        <div>{onRecord.designation}</div>
                        <div>{onRecord.designation}</div>
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          fontSize: 22,
                          fontWeight: 550,
                        }}>
                        Work Duration
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "80%",
                        }}>
                        <div>Start-End</div>
                        <div>
                          {onRecord.startDate} - {onRecord.endDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Edit Employee" key="2">
                <div>
                  <div
                    style={{
                      marginLeft: 80,
                      height: "90vh",
                      background: "white",
                      borderRadius: 8,
                      padding: 20,
                    }}>
                    <Title
                      level={3}
                      style={{
                        textAlign: "left",
                        marginTop: 0,
                        fontWeight: 580,
                        letterSpacing: 1,
                      }}>
                      Edit Employee
                    </Title>
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
                            initialValue={onRecord.firstName}
                            label="First Name"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={onRecord.lastName}
                            label="Last Name"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={dayjs(
                              `${onRecord.dob}`,
                              "DD-MM-YYYY"
                            )}
                            label="Date Of Birth"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Information!",
                              },
                            ]}
                            name="dob"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}>
                            <DatePicker
                              style={{ width: "100%" }}
                              format="DD-MM-YYYY"
                            />
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
                            initialValue={onRecord.gender}
                            label="Gender"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={onRecord.email}
                            label="Email"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={onRecord.phoneNumber}
                            label="Phone Number"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Information!",
                              },
                            ]}
                            name="phoneNumber"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}>
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
                            initialValue={onRecord.city}
                            label="City"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={onRecord.street}
                            label="Street"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
                            initialValue={onRecord.designation}
                            label="Designation"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Information!",
                              },
                            ]}
                            name="designation"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}>
                            <Select placeholder="Select Designation">
                              <Option value="Teacher">Teacher</Option>
                              <Option value="Driver">Driver</Option>
                              <Option value="Transport Admin">
                                Transport Admin
                              </Option>
                              <Option value="Inventory Admin">
                                Inventory Admin
                              </Option>
                              <Option value="School Admin">School Admin</Option>
                              <Option value="HR Admin">HR Admin Admin</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row style={{ width: "100%", marginBottom: 15 }}>
                        <Form.Item
                          initialValue={onRecord.description}
                          label="Description"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            marginTop: -20,
                          }}
                          name="description"
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Information!",
                            },
                          ]}>
                          <TextArea
                            placeholder="Enter Employee Description"
                            rows={5}
                          />
                        </Form.Item>
                      </Row>
                      <Row
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}>
                        <Col style={{ width: "39.5%" }}>
                          <Form.Item
                            initialValue={onRecord.jobType}
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
                              <Option value="contractual">Contractual</Option>
                              <Option value="One Time">One Time</Option>
                              <Option value="Internship">Internship</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col style={{ width: "39.5%" }}>
                          <Form.Item
                            initialValue={onRecord.salary}
                            label="Net Salary"
                            style={{
                              width: "100%",
                              textAlign: "left",
                              marginTop: -20,
                            }}
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
              </Tabs.TabPane>
            </Tabs>
          }
          headerStyle={{ background: "#f1f1f1", color: "black", height: 42 }}
          bodyStyle={{ background: "#f1f1f1" }}
          placement="right"
          onClose={onClose}
          width="87%"
          open={openDrawer}
          style={{ color: "black" }}
          extra={
            <Space>
              <Typography.Link onClick={() => {}}>
                Employee <strong>{onRecord.employeeName}</strong>
              </Typography.Link>
            </Space>
          }></Drawer>
        <Modal
          title="Set Leave Period"
          centered
          open={modal2Open}
          onOk={() => {
            leaveForm.submit();
          }}
          onCancel={() => setModal2Open(false)}>
          <Form form={leaveForm} onFinish={leaveFinish}>
            <Form.Item
              label="Leave Period"
              rules={[
                {
                  required: true,
                  message: "Please Set Leave Period!",
                },
              ]}
              name="leavePeriod"
              style={{ width: "100%", textAlign: "left", marginTop: 20 }}>
              <RangePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              label="Reason"
              style={{
                width: "100%",
                textAlign: "left",
              }}
              name="leaveReason"
              rules={[
                {
                  required: true,
                  message: "Please Enter Reason!",
                },
              ]}>
              <TextArea placeholder="Enter Leave Reason" rows={5} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeList;
