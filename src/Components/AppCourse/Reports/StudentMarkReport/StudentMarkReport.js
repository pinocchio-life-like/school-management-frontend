import { Button, Drawer, Form, Select, Table, Typography } from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "./StudentMarkReport.css";
import { render } from "react-dom";

const { Option } = Select;
const yearOptions = [
  { value: 2023, label: 2023 },
  { value: 2022, label: 2022 },
  { value: 2021, label: 2021 },
];

const drawerColumn = [
  {
    title: "Course Name",
    dataIndex: "courseName",
  },
  {
    title: "Semister",
    dataIndex: "semister",
  },
  {
    title: "10%",
    dataIndex: "mark1",
  },
  {
    title: "10%",
    dataIndex: "mark2",
  },
  {
    title: "10%",
    dataIndex: "mark3",
  },
  {
    title: "15%",
    dataIndex: "mark4",
  },
  {
    title: "5%",
    dataIndex: "mark5",
  },
  {
    title: "50%",
    dataIndex: "final",
  },
  {
    title: "Total",
    dataIndex: "total",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
];
let drawerData = [];

let GroupData = [];
let CourseData = [];

const dataSource = [];
const columns = [];

let originData = [];

const StudentMarkReport = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchForm] = Form.useForm();
  const [xScroll, setXScroll] = useState("fixed");
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [drawerTableData, setDrawerTableData] = useState([]);

  useEffect(() => {
    const getMarks = async () => {
      const response = await fetch("http://localhost:8080/mark/markList");
      const responseData = await response.json();
      originData = responseData.marks;

      const groupResponse = await fetch(
        "http://localhost:8080/course/offeredCourses"
      );
      const groupData = await groupResponse.json();
      GroupData = groupData.coursesGroup;

      const courseResponse = await fetch(
        "http://localhost:8080/course/courseBreakDown"
      );
      const courseData = await courseResponse.json();
      CourseData = courseData.courses;
    };
    getMarks();
  }, []);

  const onFinish = (values) => {
    localStorage.setItem("semister", values.semister);
    const data = [];
    for (let i = 0; i < originData.length; i++) {
      if (
        originData[i].grade === values.grade &&
        originData[i].section === values.section &&
        originData[i].year === String(values.year)
      ) {
        data.push(originData[i]);
      }
    }

    const header = GroupData.find((data) => {
      return data.grade === values.grade;
    });

    const result = [];

    for (const marks of data) {
      let existingMarks = result.find((p) => p.markId === marks.markId);
      if (!existingMarks) {
        existingMarks = {
          markId: marks.markId,
          studentName: marks.studentName,
          years: marks.year,
          grade: marks.grade,
          section: marks.section,
          data: [],
        };
        result.push(existingMarks);
      }
      let course = CourseData.find((data) => {
        return data.courseId === marks.courseId;
      });
      existingMarks.data.push({
        courseId: marks.courseId,
        courseName: course.courseName,
        firstSemister: marks.firstSemister,
        secondSemister: marks.secondSemister,
        firstGrade:
          values.semister === "firstSemister"
            ? marks.firstGrade
            : marks.secondGrade,
        // secondGrade: marks.secondGrade,
        finalGrade: marks.finalGrade,
      });
    }

    const { columns, dataSource } = generateTable([header], result);

    if (xScroll === "fixed") {
      columns[0].fixed = true;
      columns[1].fixed = true;
      columns[2].fixed = true;
      columns[columns.length - 1].fixed = "right";
    }

    setTableHeaders(columns);
    setTableData(dataSource);
  };
  const showDrawer = (record) => {
    // const grade = record.class.slice(0, 7);
    // const section = record.class.slice(8, 9);
    // const data = drawerData.filter((data) => {
    //   return data.class === grade && data.section === section;
    // });
    // setDrawerTableData([...data]);
    console.log(record);
    const data = [];

    for (let i = 0; i < record.data.length; i++) {
      const semister = localStorage.getItem("semister");
      console.log(semister);
      if (semister === "firstSemister") {
        data.push({
          courseName: record.data[i].courseName,
          semister: "First Semister",
          mark1: record.data[i].firstSemister[0].mark1,
          mark2: record.data[i].firstSemister[0].mark1,
          mark3: record.data[i].firstSemister[0].mark1,
          mark4: record.data[i].firstSemister[0].mark1,
          mark5: record.data[i].firstSemister[0].mark1,
          final: record.data[i].firstSemister[0].final,
          total: record.data[i].firstGrade,
          status: Number(record.data[i].firstGrade) >= 50 ? "Passed" : "Failed",
        });
      }
      if (semister === "secondSemister") {
        data.push({
          courseName: record.data[i].courseName,
          semister: "Second Semister",
          mark1: record.data[i].secondSemister[0].mark1,
          mark2: record.data[i].secondSemister[0].mark1,
          mark3: record.data[i].secondSemister[0].mark1,
          mark4: record.data[i].secondSemister[0].mark1,
          mark5: record.data[i].secondSemister[0].mark1,
          final: record.data[i].secondSemister[0].final,
          total: record.data[i].firstGrade,
          status: Number(record.data[i].firstGrade) >= 50 ? "Passed" : "Failed",
        });
      }
    }
    setDrawerTableData([...data]);
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const generateTable = (data, values) => {
    // set the fixed width for each subject header

    const columns = [
      {
        title: "Student Name",
        dataIndex: "studentName",
        key: "name",
        width: 80,
      },
      {
        title: "Grade",
        dataIndex: "grade",
        key: "grade",
        width: 90,
      },
      {
        title: "Section",
        dataIndex: "section",
        key: "section",
        width: 80,
      },
      ...data[0].offered.map((subject, index) => ({
        title: subject,
        dataIndex: subject,
        key: subject,
        width: 80,
        render: (_, record) => {
          return record.data[index].firstGrade;
        },
      })),
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        width: 80,
        render: (_, record) => {
          let total = 0;
          for (let i = 0; i < record.data.length; i++) {
            total += record.data[i].firstGrade;
          }
          return total;
        },
      },
      {
        title: "Average",
        dataIndex: "average",
        key: "average",
        width: 85,
        render: (_, record) => {
          let total = 0;
          for (let i = 0; i < record.data.length; i++) {
            total += record.data[i].firstGrade;
          }
          return total / record.data.length;
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        width: 45,
        render: (_, record) => {
          return record.students === 0 ? (
            <Typography.Link disabled={true}>
              <EyeInvisibleOutlined />
            </Typography.Link>
          ) : (
            <Typography.Link
              onClick={() => {
                showDrawer(record);
              }}>
              <EyeOutlined />
            </Typography.Link>
          );
        },
      },
    ];

    const dataSource = [];
    for (let i = 0; i < values.length; i++) {
      dataSource.push({
        key: values[i].markId,
        studentName: values[i].studentName,
        year: values[i].years,
        grade: values[i].grade,
        section: values[i].section,
        data: values[i].data,
      });
    }

    return { columns, dataSource };
  };

  const scroll = {};
  scroll.x = "100%";

  const tableProps = {
    // loading,
    scroll,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          textAlign: "left",
          marginBottom: 10,
          justifyContent: "space-between",
          marginTop: 0,
          width: "100%",
        }}>
        <Title style={{ marginTop: 0 }} level={4}>
          Student Mark Report
        </Title>
        <div>
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
            <Form.Item noStyle name="semister" required>
              <Select
                // onChange={onChangeDate}
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}
                placeholder="Semister">
                <Option value="firstSemister">First Semister</Option>
                <Option value="secondSemister">Second Semister</Option>
                <Option value="yearly">Whole Year</Option>
              </Select>
            </Form.Item>
            {/* {periodRender} */}
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

      <Table
        className="attendanceTable"
        {...(tableData.length > 0 ? tableProps : "")}
        columns={tableHeaders}
        dataSource={tableData}
        pagination={true}
      />
      <Drawer
        title="Marks"
        placement="right"
        onClose={onClose}
        width="90%"
        open={openDrawer}>
        <Table
          dataSource={drawerTableData}
          columns={drawerColumn}
          size="small"
        />
      </Drawer>
    </div>
  );
};

export default StudentMarkReport;
