import "./StudentsAttendance.css";

import {
  Button,
  Form,
  Select,
  DatePicker,
  Space,
  Table,
  Radio,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../../../Context/auth-context";
const date = new Date();
const today = date.toLocaleDateString("en-CA");
const { Option } = Select;
let originData = [];
const StudentsAttendance = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [tableData, setTableData] = useState();
  const [formdata, setFormdata] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [gradeOptions, setGradeOptions] = useState([]);
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/admission/studentsList"
        );
        const responseData = await response.json();
        if (responseData.code === 404) {
          throw new Error("No students found");
        }

        const attResponse = await fetch(
          "http://localhost:8080/teacher/getAttending"
        );
        const attResponseData = await attResponse.json();
        const attend = attResponseData.attenders.find(
          (att) => att.teacherId === userId
        );

        setGradeOptions(<Option value={attend.grade}>{attend.grade}</Option>);

        // setStudentsList(responseData.students);
        const originalData = responseData.students;
        const data = originalData.map((data) => {
          return {
            key: data.admissionNumber,
            studentName: `${data.firstName} ${data.lastName}`,
            admissionNumber: data.admissionNumber,
            grade: data.grade,
            section: data.section,
            rollNumber: data.rollNumber,
          };
        });
        originData = data;
        // console.log(responseData.students);
      } catch (err) {
        // setSearchIsLoading(false);
        error("Check for your internet connection and try again");
        return;
      }
    };
    getStudents();
  }, []);
  //success message
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  //error message
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const onFinish = (values) => {
    let date = new Date(values.attendanceDate);
    const data = originData.filter((data) => {
      return data.grade === values.grade && data.section === values.section;
    });
    setTableData([...data]);
    let attendanceDate = date.toLocaleDateString("es-CL");
    setFormdata({
      grade: values.grade,
      section: values.section,
      attendanceDate: attendanceDate,
    });
  };
  const columns = [
    {
      title: "#",
      key: "index",
      width: "1%",
      render: (item, record, i) => {
        return `${(i += 1)}`;
      },
    },
    {
      title: "Name",
      dataIndex: "studentName",
      width: "16%",
      editable: true,
    },
    {
      title: "Admission Number",
      dataIndex: "admissionNumber",
      width: "18%",
      editable: true,
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      width: "14%",
      editable: true,
    },
    {
      width: "21%",
      title: "Attendance",
      dataIndex: "attendance",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Form.Item
              noStyle
              name={`${record.admissionNumber}`}
              initialValue="Present">
              <Radio.Group>
                <Radio value="Present">Present</Radio>
                <Radio value="Late">Late</Radio>
                <Radio value="Absent">Absent</Radio>
                <Radio value="Half Day">Half Day</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        );
      },
    },
  ];

  const onAttendanceFinish = async (values) => {
    let attendance = [];
    Object.entries(values).forEach(([key, value]) => {
      console.log(key, value);
      attendance.push({
        attendanceId: key,
        attendanceDate: formdata.attendanceDate,
        attendanceStatus: value,
        attainingTeacher: "Alemu",
        grade: formdata.grade,
        section: formdata.section,
      });
    });
    try {
      const response = await fetch(
        "http://localhost:8080/attendance/takeAttendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendance),
        }
      );
      const responseData = await response.json();

      if (responseData.code === 404) {
        throw new Error("Couldnt Offer Course");
      }
      success("Attendance Recorded Successfully");
    } catch (err) {
      error("couldnt save attendance, check your internet Connection");
    }
  };
  return (
    <div>
      {contextHolder}
      <div className="FeesGroupCSS">
        <div className="FeesGroupTitle">
          <Title
            level={3}
            style={{
              marginLeft: 5,
              textAlign: "left",
              marginTop: 5,
              marginBottom: 10,
            }}>
            Attendance
          </Title>
        </div>
        <div className="FeesGroupForm">
          <Form
            form={searchForm}
            onFinish={onFinish}
            style={{ display: "flex" }}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}
              name="grade"
              style={{ minWidth: 370, textAlign: "left" }}>
              <Select placeholder="Select Grade">{gradeOptions}</Select>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}
              name="section"
              style={{ minWidth: 370, marginLeft: 15, textAlign: "left" }}>
              <Select placeholder="Select Section">
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="D">D</Option>
              </Select>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "field is required",
                },
              ]}
              initialValue={dayjs(today)}
              name="attendanceDate"
              style={{ marginLeft: 15, textAlign: "left" }}>
              <DatePicker style={{ minWidth: 370 }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item style={{ marginLeft: 25 }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="FeesGroupList">
          <div className="FeesGroupListTitle">
            <Title
              level={4}
              style={{
                marginLeft: 5,
                textAlign: "left",
                marginTop: 5,
                marginBottom: 10,
              }}>
              Students List
            </Title>
          </div>

          <div className="FeesGroupSearch">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 5,
              }}>
              <Button
                onClick={() => {
                  form.submit();
                }}
                htmlType="submit"
                type="primary"
                style={{
                  marginLeft: "78.2%",
                  marginRight: 0,
                }}>
                Save Attendance
              </Button>
            </div>
          </div>
          <div className="FeesGroupTable">
            <Form form={form} onFinish={onAttendanceFinish}>
              <Table
                //   bordered
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendance;
