import { Button, DatePicker, Form, Radio, Space, Table, message } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import "./EmployeeAttendace.css";
import dayjs from "dayjs";
const date = new Date();
const today = date.toLocaleDateString("es-CL");
let attendanceDate = today;

const columns = [
  {
    title: "#",
    key: "index",
    width: "2%",
    render: (item, record, i) => {
      return `${(i += 1)}`;
    },
  },
  {
    title: "Name",
    dataIndex: "employeeName",
    width: "16%",
  },
  {
    title: "Emplyee ID",
    dataIndex: "employeeId",
    width: "18%",
  },
  {
    title: "Designation",
    dataIndex: "designation",
    width: "14%",
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
            name={`${record.employeeId}`}
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
const EmployeeAttendance = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getEmployees = async () => {
      const response = await fetch(
        "http://localhost:8080/employee/employeeList"
      );
      const responseData = await response.json();
      const data = [];
      for (let i = 0; i < responseData.employees.length; i++) {
        if (responseData.employees[i].status === "Active") {
          data.push({
            key: responseData.employees[i].employeeId,
            employeeName: `${responseData.employees[i].firstName} ${responseData.employees[i].lastName}`,
            firstName: responseData.employees[i].firstName,
            lastName: responseData.employees[i].lastName,
            employeeId: responseData.employees[i].employeeId,
            designation: responseData.employees[i].designation,
            status: responseData.employees[i].status,
          });
        }
      }
      setTableData([...data]);
    };
    getEmployees();
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

  const onAttendanceFinish = async (values) => {
    let attendance = [];
    Object.entries(values).forEach(([key, value]) => {
      console.log(key, value);
      attendance.push({
        employeeId: key,
        attendanceDate: attendanceDate,
        attendanceStatus: value,
      });
    });
    try {
      const response = await fetch(
        "http://localhost:8080/employee/attendance",
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
      <div className="EmployeeAttendaceClass">
        <div className="EmployeeAttendanceHeader">
          <div>
            <Title
              level={4}
              style={{
                marginLeft: 5,
                textAlign: "left",
                marginTop: 0,
              }}>
              Employee Attendance
            </Title>
          </div>
          <div className="DateAndSubmitAttendance">
            <div>
              <DatePicker
                onChange={(value) => {
                  let date = new Date(value);
                  attendanceDate = date.toLocaleDateString("es-CL");
                }}
                defaultValue={dayjs(today, "DD-MM-YYYY")}
                style={{ marginRight: 5 }}
                format="DD-MM-YYYY"
              />
            </div>
            <div>
              <Button
                onClick={() => {
                  form.submit();
                }}
                htmlType="submit"
                type="primary"
                style={{}}>
                Save Attendance
              </Button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Form form={form} onFinish={onAttendanceFinish}>
            <Table
              scroll={{ y: 540 }}
              size="small"
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
