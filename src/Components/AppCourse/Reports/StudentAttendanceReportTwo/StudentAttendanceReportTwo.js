import { Button, Form, Input, message, Select, Table, Typography } from "antd";
import "./StudentAttendanceReportTwo.css";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
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

let StudentData = [];

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

const generateTableData = (year, month, grade, section) => {
  const monthDays = new Date(year, month, 0).getDate();
  const studData = StudentData.filter((data) => {
    return data.grade === grade && data.section === section;
  });
  const data = studData.map((student) => {
    const studentData = {
      key: student.key,
      name: student.name,
      attendance: student.attendance,
    };
    return studentData;
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
        children: "P",
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
        children: "L",
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
        children: "A",
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
        children: "H",
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

const StudentAttendanceReportTwo = () => {
  const [searchForm] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [xScroll, setXScroll] = useState("fixed");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const studentResponse = await fetch(
          "http://localhost:8080/admission/studentsList"
        );
        const studentData = await studentResponse.json();
        if (studentData.code === 404) {
          throw new Error("No students found");
        }
        const attendanceResponse = await fetch(
          "http://localhost:8080/attendance/getAttendance"
        );
        const attendanceData = await attendanceResponse.json();
        if (attendanceData.code === 404) {
          throw new Error("No students found");
        }

        let data = [];
        let attendance = [];
        for (let j = 0; j < attendanceData.attendances.length; j++) {
          const date = formatDate(attendanceData.attendances[j].attendanceDate);
          attendance.push({
            key: date.slice(0, 6),
            attendanceId: attendanceData.attendances[j].attendanceId,
            attendance: attendanceData.attendances[j].attendanceStatus,
            month: date.slice(7, -5),
            year: date.slice(-4),
          });
        }
        for (let i = 0; i < studentData.students.length; i++) {
          let attend = [];
          for (let j = 0; j < attendance.length; j++) {
            if (
              studentData.students[i].admissionNumber ===
              attendance[j].attendanceId
            ) {
              attend.push(attendance[j]);
            }
          }

          data.push({
            key: Math.random(),
            name: `${studentData.students[i].firstName} ${studentData.students[i].lastName}`,
            grade: studentData.students[i].grade,
            section: studentData.students[i].section,
            attendance: attend,
          });
        }
        // console.log(data);
        StudentData = data;
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
    // console.log("Form values:", values);
    const { year, month, grade, section } = values;
    const { data, headers } = generateTableData(year, month, grade, section);
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
          <Title style={{ marginTop: 0 }} level={4}>
            Select Criteria
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
            <Form.Item noStyle name="grade">
              <Select placeholder="Grade" style={{ width: 220 }}>
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
            <Form.Item noStyle name="section">
              <Select
                placeholder="Section"
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="D">D</Option>
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

      {/* {tableData.length > 0 && ( */}
      <Table
        className="attendanceTable"
        {...(tableData.length > 0 ? tableProps : "")}
        columns={tableHeaders}
        dataSource={tableData}
        pagination={true}
      />
      {/* )} */}
    </div>
  );
};

export default StudentAttendanceReportTwo;
