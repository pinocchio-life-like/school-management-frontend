import { Button, Card, Col, Form, Row, Select, Table, message } from "antd";
import Title from "antd/es/typography/Title";
import "../../../Reports/StudentAttendanceReportTwo/StudentAttendanceReportTwo.css";
import React, { useState } from "react";
import AttendanceBarChart from "./AttendanceBarChart/AttendanceBarChart";
import AttendancePieChart from "./AttendancePieChart/AttendancePieChart";
import { useEffect } from "react";
const { Option } = Select;
const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
const yearOptions = [
  { value: 2023, label: 2023 },
  { value: 2022, label: 2022 },
  { value: 2021, label: 2021 },
];

const getHeader = (date) => {
  const day = new Date(date).toLocaleString("en-us", { weekday: "short" });
  // Set background color to salmon for weekend days
  const bgColor = day === "Sat" || day === "Sun" ? "salmon" : "";
  return {
    // parseInt(day).toString().padStart(2, "0");
    key: Math.random(),
    title: `${day.substring(0, 3)} ${date
      .getDate()
      .toString()
      .padStart(2, "0")}`,
    dataIndex: `date-${date.getDate()}`,
    render: (_, record) => {
      let attendance = "";
      for (let i = 0; i < record.attendance.length; i++) {
        if (
          record.attendance[i].key ===
          `${day.substring(0, 3)} ${date.getDate().toString().padStart(2, "0")}`
        ) {
          attendance = record.attendance[i].attendance;
        }
      }
      return {
        key: Math.random(),
        children: !!bgColor ? "" : attendance,
        props: {
          style: { backgroundColor: bgColor },
        },
      };
    },
  };
};
let EmployeeData = [];
const generateTableData = (year, month, designation) => {
  const monthDays = new Date(year, month, 0).getDate();

  const monthValue = monthOptions.find((date) => {
    return date.value === month;
  });

  let empolData = [];
  if (designation === "All") {
    empolData = EmployeeData.map((data) => {
      return data;
    });
  } else {
    empolData = EmployeeData.filter((data) => {
      for (let i = 0; i < data.attendance.length; i++) {
        return (
          data.designation === designation &&
          data.attendance[i].month === monthValue.label &&
          data.attendance[i].year === year.toString()
        );
      }
    });
  }

  const data = empolData.map((employee) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    for (let i = 0; i < employee.attendance.length; i++) {
      if (employee.attendance[i].attendance === "Present") {
        present += 1;
      }
      if (employee.attendance[i].attendance === "Late") {
        late += 1;
      }
      if (employee.attendance[i].attendance === "Absent") {
        absent += 1;
      }
      if (employee.attendance[i].attendance === "HalfDay") {
        halfDay += 1;
      }
    }
    const employeeData = {
      key: employee.key,
      name: employee.name,
      attendance: employee.attendance,
      present: present,
      late: late,
      absent: absent,
      halfDay: halfDay,
    };
    return employeeData;
  });

  // Add headers with the first three letters of each date name
  const headers = [
    {
      dataIndex: "name",
      title: "Name",
      width: 200,
    },
    {
      title: "P",
      dataIndex: "p",
      width: 40,
      render: (_, record) => ({
        children: record.present,
        props: {
          style: { backgroundColor: "" },
        },
      }),
    },
    {
      title: "L",
      dataIndex: "l",
      width: 40,
      render: (_, record) => ({
        children: record.late,
        props: {
          style: { backgroundColor: "" },
        },
      }),
    },
    {
      title: "A",
      dataIndex: "a",
      width: 40,
      render: (_, record) => ({
        children: record.absent,
        props: {
          style: { backgroundColor: "" },
        },
      }),
    },
    {
      title: "H",
      dataIndex: "h",
      width: 40,
      render: (_, record) => ({
        children: record.halfDay,
        props: {
          style: { backgroundColor: "" },
        },
      }),
    },
  ].concat(
    Array.from({ length: monthDays }, (_, index) => {
      const date = new Date(year, month - 1, index + 1);
      return getHeader(date);
    })
  );

  return { data, headers };
};

function formatDate(dateString) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [day, month, year] = dateString.split("-").map((str) => parseInt(str));

  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = daysOfWeek[dateObj.getDay()];
  let dayOfMonth = parseInt(day).toString().padStart(2, "0");
  const monthOfYear = monthsOfYear[dateObj.getMonth()];
  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${monthOfYear} ${year}`;

  return formattedDate;
}

const AttendanceReport = () => {
  const [searchForm] = Form.useForm();
  const [xScroll, setXScroll] = useState("fixed");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedYear, setSelectedYear] = useState("2023");
  const [attendanceStatusCounts, setAttendanceStatusCounts] = useState({});
  useEffect(() => {
    const getAttendance = async () => {
      try {
        const employeeResponse = await fetch(
          "http://localhost:8080/employee/employeeList"
        );
        const employeeData = await employeeResponse.json();
        if (employeeData.code === 404) {
          throw new Error("No Employees found");
        }
        const attendanceResponse = await fetch(
          "http://localhost:8080/employee/getAttendance"
        );
        const attendanceData = await attendanceResponse.json();

        if (attendanceData.code === 404) {
          throw new Error("No employees found");
        }

        let theData = [];
        let attendance = [];
        for (let j = 0; j < attendanceData.attendances.length; j++) {
          const date = formatDate(attendanceData.attendances[j].attendanceDate);
          attendance.push({
            key: date.slice(0, 6),
            attendanceId: attendanceData.attendances[j].employeeId,
            attendance: attendanceData.attendances[j].attendanceStatus,
            month: date.slice(7, -5),
            year: date.slice(-4),
          });
        }

        for (let i = 0; i < employeeData.employees.length; i++) {
          let attend = [];
          for (let j = 0; j < attendance.length; j++) {
            if (
              employeeData.employees[i].employeeId ===
              attendance[j].attendanceId
            ) {
              attend.push(attendance[j]);
            }
          }

          theData.push({
            key: Math.random(),
            name: `${employeeData.employees[i].firstName} ${employeeData.employees[i].lastName}`,
            designation: employeeData.employees[i].designation,
            attendance: attend,
          });
        }

        setAttendanceStatusCounts({
          present: attendanceData.attendanceStatusCounts.Present,
          absent: attendanceData.attendanceStatusCounts.Absent,
          late: attendanceData.attendanceStatusCounts.Late,
          halfDay: attendanceData.attendanceStatusCounts.HalfDay,
        });

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const designation = "All";

        const { data, headers } = generateTableData(year, month, designation);
        if (xScroll === "fixed") {
          headers[0].fixed = true;
          headers[1].fixed = true;
          headers[2].fixed = true;
          headers[3].fixed = true;
          headers[4].fixed = true;
          headers[headers.length - 1].fixed = "right";
        }

        EmployeeData = theData;
        console.log(data);

        setTableData(data);
        setTableHeaders(headers);
      } catch (err) {
        error("Check your Internet Connection and try agian!");
      }
    };
    getAttendance();
  }, []);
  //error message
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const onFinish = (values) => {
    const { year, month, designation } = values;
    const { data, headers } = generateTableData(year, month, designation);
    if (xScroll === "fixed") {
      headers[0].fixed = true;
      headers[1].fixed = true;
      headers[2].fixed = true;
      headers[3].fixed = true;
      headers[4].fixed = true;
      headers[headers.length - 1].fixed = "right";
    }
    setTableData(data);
    setTableHeaders(headers);
  };
  const scroll = {};
  scroll.x = "200vw";

  const tableProps = {
    // loading,
    scroll,
  };
  return (
    <div>
      {contextHolder}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <div
          style={{
            textAlign: "left",
            marginBottom: 10,
            marginTop: 0,
            // width: "15%",
          }}>
          <Title style={{ marginTop: 0 }} level={3}>
            Attendance Report
          </Title>
        </div>
        <div
          style={{
            textAlign: "left",
            marginBottom: 20,
            marginTop: 0,
            // width: "80%",
            // marginLeft: 49,
          }}>
          <Form form={searchForm} onFinish={onFinish}>
            <Form.Item noStyle name="designation">
              <Select
                placeholder="Designation"
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}>
                <Option value="All">All</Option>
                <Option value="Teacher">Teacher</Option>
                <Option value="Driver">Driver</Option>
                <Option value="Administrators">Administrators</Option>
              </Select>
            </Form.Item>
            <Form.Item noStyle name="month" required>
              <Select
                // onChange={onChangeDate}
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}
                placeholder="month">
                {monthOptions.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* {periodRender} */}
            <Form.Item noStyle name="year" required>
              <Select
                onChange={(value) => {
                  setSelectedYear(value.toString());
                }}
                style={{
                  width: 220,
                  textAlign: "left",
                  marginLeft: 5,
                }}
                placeholder="Year">
                {yearOptions.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              <Button
                style={{
                  marginLeft: 10,
                }}
                type="primary"
                htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>
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
                <div className="LeaveReportCardTitle">Present</div>
                <div className="LeaveReportCardNumber">
                  {attendanceStatusCounts.present}
                </div>
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
                <div className="LeaveReportCardTitle">Absent</div>
                <div className="LeaveReportCardNumber">
                  {attendanceStatusCounts.absent}
                </div>
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
                <div className="LeaveReportCardTitle">Late</div>
                <div className="LeaveReportCardNumber">
                  {attendanceStatusCounts.late}
                </div>
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
                <div className="LeaveReportCardTitle">Half-Day</div>
                <div className="LeaveReportCardNumber">
                  {attendanceStatusCounts.halfDay}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 10 }} className="JobStatisticsCardContainer">
        <div style={{ width: "68%" }} className="JobChartDiv">
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 250,
              width: "100%",
              borderTopLeftRadius: 0,
            }}>
            <AttendanceBarChart attendance={tableData} year={selectedYear} />
          </Card>
        </div>
        <div style={{ width: "32%" }}>
          <Card
            style={{
              height: 250,
              width: "100%",
              borderTopRightRadius: 0,
            }}>
            <AttendancePieChart attendance={tableData} year={selectedYear} />
          </Card>
        </div>
      </div>
      <Table
        className="attendanceTable"
        {...(tableData.length > 0 ? tableProps : "")}
        columns={tableHeaders}
        dataSource={tableData}
        pagination={{ pageSize: 4 }}
        style={{ marginTop: 30 }}
        size="small"
      />
    </div>
  );
};

export default AttendanceReport;
