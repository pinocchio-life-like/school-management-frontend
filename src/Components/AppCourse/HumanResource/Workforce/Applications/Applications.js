import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "./Applications.css";
import Title from "antd/es/typography/Title";

import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  Form,
  List,
  Modal,
  Skeleton,
  Space,
  Tabs,
  Typography,
  message,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
function isPastDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  return inputDate < today;
}

let originData = [];
const Applications = () => {
  const [interviewDateForm] = Form.useForm();
  const [modal2Open, setModal2Open] = useState(false);
  const [jobLists, setJobLists] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedApplication, setSelectedApplication] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setLoading(true);
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

  useEffect(() => {
    const getApplications = async () => {
      const response = await fetch("http://localhost:8080/job/jobList");
      const responseData = await response.json();

      console.log(responseData);
      const data = [];
      for (let i = 0; i < responseData.jobs.length; i++) {
        if (
          responseData.jobs[i].status === "Ongoing" &&
          !isPastDate(responseData.jobs[i].deadline)
        ) {
          if (responseData.jobs[i].applicants.length) {
            for (let j = 0; j < responseData.jobs[i].applicants.length; j++) {
              if (
                responseData.jobs[i].applicants[j].applicationStatus ===
                "Pending"
              ) {
                data.push({
                  id: responseData.jobs[i]._id,
                  key: responseData.jobs[i].applicants[j].email,
                  jobName: responseData.jobs[i].jobName,
                  jobType: responseData.jobs[i].jobType,
                  name: `${responseData.jobs[i].applicants[j].firstName} ${responseData.jobs[i].applicants[j].lastName}`,
                  firstName: responseData.jobs[i].applicants[j].firstName,
                  lastName: responseData.jobs[i].applicants[j].lastName,
                  coverLetter: responseData.jobs[i].applicants[j].coverLetter,
                  gender: responseData.jobs[i].applicants[j].gender,
                  dob: responseData.jobs[i].applicants[j].dob,
                  education: responseData.jobs[i].applicants[j].education,
                  experiance: responseData.jobs[i].applicants[j].experiance,
                  email: responseData.jobs[i].applicants[j].email,
                  mobile: responseData.jobs[i].applicants[j].mobile,
                  address: responseData.jobs[i].applicants[j].address,
                  appliedOn: responseData.jobs[i].applicants[j].appliedOn,
                  resume: `http://localhost:8080/${responseData.jobs[i].applicants[j].resume}`,
                  status: responseData.jobs[i].applicants[j].applicationStatus,
                });
              }
            }
          }
        }
      }
      originData = data;
      setJobLists([...data]);
    };
    getApplications();
  }, []);

  const onInterviewSetFinish = async (values) => {
    setModal2Open(false);
    let date = new Date(values.interviewDate);
    let interviewDate = date.toLocaleDateString("es-CL");

    try {
      const response = await fetch(
        `http://localhost:8080/job/setInterview/${selectedApplication.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewDate: interviewDate,
            email: selectedApplication.email,
          }),
        }
      );

      const responseData = await response.json();
      success(responseData.message);
      if (responseData.code === 404 || responseData.code === 500) {
        throw new Error(responseData.message);
      }
    } catch (err) {
      error(err);
    }
  };
  return (
    <div>
      {contextHolder}
      <div className="ApplicationsContainer">
        <div className="ApplicationsBoard">
          <Title
            className="ApplicationsTitle"
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
            Applications List
          </Title>
        </div>
        <div className="ApplicationsList">
          <List
            className="ApplicationsListing"
            dataSource={jobLists}
            style={{
              marginTop: 0,
              overflow: "auto",
              height: 400,
              textAlign: "left",
            }}
            renderItem={(item, whatever) => (
              <List.Item key={item.email} style={{}}>
                <List.Item.Meta
                  title={
                    <Typography.Link
                      onClick={() => {
                        setTimeout(() => {
                          setLoading(false);
                        }, 4000);
                        setSelectedApplication(item);
                        showDrawer();
                      }}>
                      {item.name}
                    </Typography.Link>
                  }
                  description={item.email}
                />
                <List.Item.Meta
                  title={<Typography.Link>Applied On</Typography.Link>}
                  description={item.appliedOn}
                />
                <List.Item.Meta
                  title={<Typography.Link>Phone Number</Typography.Link>}
                  description={item.mobile}
                />
                <List.Item.Meta
                  title={<Typography.Link>Status</Typography.Link>}
                  description={item.status}
                />
              </List.Item>
            )}
          />
        </div>
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
                            {selectedApplication.name}
                          </Title>
                        </div>
                        <div>
                          <Title
                            level={5}
                            style={{
                              color: "black",
                              marginTop: 5,
                            }}>
                            Applied On: {selectedApplication.appliedOn}
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
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "center",
                          }}>
                          <Button
                            type="ghost"
                            style={{
                              borderRadius: 20,
                              background: "salmon",
                              color: "white",
                              fontWeight: 500,
                              letterSpacing: 1,
                              marginRight: 10,
                            }}>
                            Reject
                          </Button>
                          <Button
                            onClick={() => {
                              setModal2Open(true);
                            }}
                            type="ghost"
                            style={{
                              borderRadius: 20,
                              background: "#03C988",
                              color: "white",
                              fontWeight: 500,
                              letterSpacing: 1,
                            }}>
                            Accept
                          </Button>
                        </div>
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
                        <div style={{ fontWeight: 480 }}>Applied Job</div>
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
                            <div>{selectedApplication.jobName}</div>
                            <div style={{ fontWeight: 400 }}>Permanenet</div>
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
                              {selectedApplication.status}
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
                            {selectedApplication.mobile}
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
                          <div style={{ marginLeft: 8 }}>
                            {" "}
                            {selectedApplication.email}
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
                            <EnvironmentOutlined />
                          </div>
                          <div style={{ marginLeft: 8 }}>
                            {" "}
                            {selectedApplication.address}
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
                            <div>{selectedApplication.firstName}</div>
                          </div>
                          <div>
                            <div>Last Name</div>
                            <div>{selectedApplication.lastName}</div>
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
                            <div>{selectedApplication.gender}</div>
                          </div>
                          {/* <div>
                            <div>Date Of Birth</div>
                            <div>{selectedApplication.dob}</div>
                          </div> */}
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
                        Cover Later
                      </div>
                      <div>
                        <Skeleton loading={loading} active />
                        {!loading && (
                          <p style={{ fontSize: 13 }}>
                            {selectedApplication.coverLetter}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          fontSize: 22,
                          fontWeight: 550,
                        }}>
                        Education
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "80%",
                        }}>
                        <div>{selectedApplication.education}</div>
                        {/* <div>2008 - 2011</div> */}
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          fontSize: 22,
                          fontWeight: 550,
                        }}>
                        Experiances
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "80%",
                        }}>
                        <div>{selectedApplication.experiance}</div>
                        {/* <div>April 2012 - May 2014</div> */}
                      </div>
                      <div style={{ marginTop: 20 }}>
                        <Typography.Link
                          href={selectedApplication.resume}
                          target="_blank">
                          See {selectedApplication.name}'s' Resume
                        </Typography.Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              {/* <Tabs.TabPane tab="Resume" key="2">
                <div>
                  <div
                    style={{
                      marginLeft: 80,
                      height: "90vh",
                      background: "#f1f1f1",
                    }}>
                    <DocViewer
                      theme={{
                        primary: "#5296d8",
                        secondary: "#ffffff",
                        tertiary: "#5296d899",
                        textPrimary: "#ffffff",
                        textSecondary: "#5296d8",
                        textTertiary: "#00000099",
                        disableThemeScrollbar: true,
                      }}
                      // style={{ height: 800 }}
                      documents={selectedApplication.resume}
                      pluginRenderers={DocViewerRenderers}
                    />
                  </div>
                </div>
              </Tabs.TabPane> */}
            </Tabs>
          }
          headerStyle={{ background: "#f1f1f1", color: "black", height: 42 }}
          bodyStyle={{ background: "#f1f1f1" }}
          placement="right"
          onClose={onClose}
          width="90%"
          open={open}
          style={{ color: "black" }}
          extra={
            <Space>
              <Typography.Link onClick={() => {}}>
                <strong>{selectedApplication.status} Application</strong>
              </Typography.Link>
            </Space>
          }></Drawer>
        <Modal
          title="Set Office Interview Date"
          centered
          open={modal2Open}
          onOk={() => {
            interviewDateForm.submit();
          }}
          onCancel={() => setModal2Open(false)}>
          <Form form={interviewDateForm} onFinish={onInterviewSetFinish}>
            <Form.Item
              label="Interview Date"
              rules={[
                {
                  required: true,
                  message: "Please Set Interview Date!",
                },
              ]}
              name="interviewDate"
              style={{ width: "100%", textAlign: "left", marginTop: 20 }}>
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Applications;
