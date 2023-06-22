import { Button, Form, Select, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/auth-context";
import Title from "antd/es/typography/Title";

const { Option } = Select;
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
const teacherColumns = [
  {
    title: "Teacher Name",
    dataIndex: "teacherName",
    width: "21%",
  },
  {
    title: "courses",
    dataIndex: "courses",
    width: "14%",
  },
  {
    title: "Grade",
    dataIndex: "grade",
    width: "12%",
  },
  {
    title: "Competitional Level",
    dataIndex: "competitionalLevel",
    width: "20%",
  },
];
let CourseData = [];

let MarkData = [];

const StudentDashboard = () => {
  const [searchForm] = Form.useForm();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [teacherData, setTeacherData] = useState([]);
  const [markData, setMarkData] = useState([]);

  useEffect(() => {
    const getMarks = async () => {
      const markresponse = await fetch("http://localhost:8080/mark/markList");
      const markresponseData = await markresponse.json();
      const origin = markresponseData.marks;

      const courseResponse = await fetch(
        "http://localhost:8080/course/courseBreakDown"
      );
      const courseData = await courseResponse.json();
      CourseData = courseData.courses;

      const datta = origin.filter((data) => data.markId === userId);
      const grade = datta[0].grade;
      let grader = datta[0].grade;
      grader = `${grader.slice(0, 1)}${grader.slice(-1)}`;

      const tabledata = datta.map((data) => {
        let course = CourseData.find((cour) => {
          return cour.courseId === data.courseId;
        });
        return {
          key: data.id,
          grade: data.grade,
          section: data.section,
          studentName: data.studentName,
          courseName: course.courseName,
          firstSemister: data.firstSemister,
          secondSemister: data.secondSemister,
          firstGrade: data.firstGrade,
          secondGrade: data.secondGrade,
        };
      });
      MarkData = tabledata;

      const response = await fetch("http://localhost:8080/teacher/teacherList");
      const responseData = await response.json();

      const data = [];
      for (let i = 0; i < responseData.teachers.length; i++) {
        let coursesId = [];
        for (let j = 0; j < responseData.teachers[i].coursesId.length; j++) {
          for (
            let k = 0;
            k < responseData.teachers[i].coursesId[j].length;
            k++
          ) {
            if (grader === responseData.teachers[i].coursesId[j][k].slice(-2)) {
              coursesId.push(
                <p style={{ margin: 0 }} key={Math.random()}>
                  {responseData.teachers[i].coursesId[j][k].slice(0, 4)}
                </p>
              );
            }
          }
        }
        data.push({
          key: responseData.teachers[i].teacherId,
          teacherName: responseData.teachers[i].teacherName,
          courses: <>{coursesId}</>,
          grade: grade,
          competitionalLevel: responseData.teachers[i].competitionalLevel,
        });
      }
      setTeacherData([...data]);
    };
    getMarks();
  }, [userId]);

  const onFinish = (values) => {
    const data = [];
    if (values.semister === "firstSemister") {
      for (let i = 0; i < MarkData.length; i++) {
        data.push({
          key: MarkData[i].key,
          courseName: MarkData[i].courseName,
          semister: "First Semister",
          mark1: MarkData[i].firstSemister[0].mark1,
          mark2: MarkData[i].firstSemister[0].mark2,
          mark3: MarkData[i].firstSemister[0].mark3,
          mark4: MarkData[i].firstSemister[0].mark4,
          mark5: MarkData[i].firstSemister[0].mark5,
          final: MarkData[i].firstSemister[0].final,
          total: MarkData[i].firstGrade,
          status: Number(MarkData[i].firstGrade) >= 50 ? "Passed" : "Failed",
        });
      }
    }
    if (values.semister === "secondSemister") {
      for (let i = 0; i < MarkData.length; i++) {
        data.push({
          key: MarkData[i].key,
          courseName: MarkData[i].courseName,
          semister: "Second Semister",
          mark1: MarkData[i].secondSemister[0].mark1,
          mark2: MarkData[i].secondSemister[0].mark2,
          mark3: MarkData[i].secondSemister[0].mark3,
          mark4: MarkData[i].secondSemister[0].mark4,
          mark5: MarkData[i].secondSemister[0].mark5,
          final: MarkData[i].secondSemister[0].final,
          total: MarkData[i].secondGrade,
          status: Number(MarkData[i].secondGrade) >= 50 ? "Passed" : "Failed",
        });
      }
    }
    setMarkData([...data]);
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
            <Form.Item noStyle name="semister" required>
              <Select
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}
                placeholder="Semister">
                <Option value="firstSemister">First Semister</Option>
                <Option value="secondSemister">Second Semister</Option>
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
      <Table
        pagination={false}
        dataSource={markData}
        columns={drawerColumn}
        size="small"
      />
      <Title style={{ marginTop: 40, textAlign: "left" }} level={4}>
        Teachers List
      </Title>
      <Table
        pagination={false}
        dataSource={teacherData}
        columns={teacherColumns}
        size="small"
      />
    </div>
  );
};

export default StudentDashboard;
