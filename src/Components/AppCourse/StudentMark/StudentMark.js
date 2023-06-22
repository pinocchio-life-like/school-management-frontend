import { Button, Form, InputNumber, message, Select, Table } from "antd";
import "./StudentMark.css";
import Title from "antd/es/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/auth-context";

const { Option } = Select;
let CourseData = [];
let MarkData = [];

const getCourses = async (userId) => {
  const courseResponse = await fetch(
    "http://localhost:8080/course/courseBreakDown"
  );
  const courseData = await courseResponse.json();
  const data = courseData.courses.filter((course) => {
    return course.teacherId === userId;
  });
  CourseData = data;
  return data;
};

const getMarks = async () => {
  const markResponse = await fetch("http://localhost:8080/mark/markList");
  const markData = await markResponse.json();
  MarkData = markData.marks;
  return markData.marks;
};
const StudentMark = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [searchForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);
  const [formsData, setFormsData] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const courses = await getCourses(userId);
      setCourses([...courses]);
      const marks = await getMarks();
      setMarks([...marks]);

      const teachResponse = await fetch(
        "http://localhost:8080/teacher/teacherList"
      );
      const teachResponseData = await teachResponse.json();
      const teacherData = teachResponseData.teachers;

      let data = [];
      for (let i = 0; i < teacherData.length; i++) {
        for (let j = 0; j < teacherData[i].grade.length; j++) {
          if (teacherData[i].teacherId === userId && teacherData[i].grade[j]) {
            data.push(
              <Option key={Math.random()} value={teacherData[i].grade[j]}>
                {teacherData[i].grade[j]}
              </Option>
            );
          }
        }
      }
      setOptions([...data]);
    };
    getData();
  }, []);

  const handleInputChange = async (record, dataIndex, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.key === item.key);
    const item = newData[index];
    item[dataIndex] = value;
    item.total = parseFloat(
      Number(
        (
          item.mark1 +
          item.mark2 +
          item.mark3 +
          item.mark4 +
          item.mark5 +
          item.final
        ).toFixed(2)
      )
    );
    setDataSource(newData);
    let first = [];
    let second = [];
    let firstG = formsData.semister === "firstSemister" ? item.total : 0;
    let secondG = formsData.semister === "secondSemister" ? item.total : 0;

    if (marks.length > 0) {
      const { firstSemister, secondSemister, firstGrade, secondGrade } =
        marks.find((data) => {
          return data.markId === item.key && data.courseId === formsData.course;
        });
      first = firstSemister;
      second = secondSemister;
      firstG = firstGrade;
      secondG = secondGrade;
    }
    const dbData = {
      markId: item.key,
      studentName: item.name,
      courseId: formsData.course,
      firstSemister:
        formsData.semister === "firstSemister"
          ? [
              {
                mark1: item.mark1,
                mark2: item.mark2,
                mark3: item.mark3,
                mark4: item.mark4,
                mark5: item.mark5,
                final: item.final,
              },
            ]
          : first,
      secondSemister:
        formsData.semister === "secondSemister"
          ? [
              {
                mark1: item.mark1,
                mark2: item.mark2,
                mark3: item.mark3,
                mark4: item.mark4,
                mark5: item.mark5,
                final: item.final,
              },
            ]
          : second,
      finalGrade: Number((firstG + secondG) / 2).toFixed(3),
      firstGrade: formsData.semister === "firstSemister" ? item.total : firstG,
      secondGrade:
        formsData.semister === "secondSemister" ? item.total : secondG,
      year: `${formsData.year}`,
      grade: formsData.grade,
      section: formsData.section,
    };
    await fetch("http://localhost:8080/mark/markList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dbData),
    });
  };

  const columns = [
    { title: "Student Name", dataIndex: "name" },
    {
      title: "10%",
      dataIndex: "mark1",
      render: (text, record, index) => {
        return (
          <InputNumber
            value={record.mark1}
            formatter={(value) => {
              if (value > 10) {
                return "0";
              } else if (value < 0) {
                return "0";
              }
              return value ? value.toString() : "";
            }}
            parser={(value) => {
              if (value === "10" || value === "0") {
                return parseInt(value, 10);
              }
              return value ? parseFloat(value) : "";
            }}
            onChange={(value) => {
              if (value > 10) {
                value = 0;
              } else if (value < 0) {
                value = 0;
              }
              handleInputChange(record, "mark1", value);
            }}
          />
        );
      },
    },
    {
      title: "10%",
      dataIndex: "mark2",
      render: (text, record, index) => (
        <InputNumber
          value={record.mark2}
          formatter={(value) => {
            if (value > 10) {
              return "0";
            } else if (value < 0) {
              return "0";
            }
            return value ? value.toString() : "";
          }}
          parser={(value) => {
            if (value === "10" || value === "0") {
              return parseInt(value, 10);
            }
            return value ? parseFloat(value) : "";
          }}
          onChange={(value) => {
            if (value > 10) {
              value = 0;
            } else if (value < 0) {
              value = 0;
            }
            handleInputChange(record, "mark2", value);
          }}
        />
      ),
    },
    {
      title: "10%",
      dataIndex: "mark3",
      render: (text, record, index) => (
        <InputNumber
          value={record.mark3}
          formatter={(value) => {
            if (value > 10) {
              return "0";
            } else if (value < 0) {
              return "0";
            }
            return value ? value.toString() : "";
          }}
          parser={(value) => {
            if (value === "10" || value === "0") {
              return parseInt(value, 10);
            }
            return value ? parseFloat(value) : "";
          }}
          onChange={(value) => {
            if (value > 10) {
              value = 0;
            } else if (value < 0) {
              value = 0;
            }
            handleInputChange(record, "mark3", value);
          }}
        />
      ),
    },
    {
      title: "15%",
      dataIndex: "mark4",
      render: (text, record, index) => (
        <InputNumber
          value={record.mark4}
          formatter={(value) => {
            if (value > 15) {
              return "0";
            } else if (value < 0) {
              return "0";
            }
            return value ? value.toString() : "";
          }}
          parser={(value) => {
            if (value === "15" || value === "0") {
              return parseInt(value, 10);
            }
            return value ? parseFloat(value) : "";
          }}
          onChange={(value) => {
            if (value > 15) {
              value = 0;
            } else if (value < 0) {
              value = 0;
            }
            handleInputChange(record, "mark4", value);
          }}
        />
      ),
    },
    {
      title: "5%",
      dataIndex: "mark5",
      render: (text, record, index) => (
        <InputNumber
          value={record.mark5}
          formatter={(value) => {
            if (value > 5) {
              return "0";
            } else if (value < 0) {
              return "0";
            }
            return value ? value.toString() : "";
          }}
          parser={(value) => {
            if (value === "5" || value === "0") {
              return parseInt(value, 10);
            }
            return value ? parseFloat(value) : "";
          }}
          onChange={(value) => {
            if (value > 5) {
              value = 0;
            } else if (value < 0) {
              value = 0;
            }
            handleInputChange(record, "mark5", value);
          }}
        />
      ),
    },
    {
      title: "Final (50%)",
      dataIndex: "final",
      render: (text, record, index) => (
        <InputNumber
          value={record.final}
          formatter={(value) => {
            if (value > 50) {
              return "0";
            } else if (value < 0) {
              return "0";
            }
            return value ? value.toString() : "";
          }}
          parser={(value) => {
            if (value === "50" || value === "0") {
              return parseInt(value, 10);
            }
            return value ? parseFloat(value) : "";
          }}
          onChange={(value) => {
            if (value > 50) {
              value = 0;
            } else if (value < 0) {
              value = 0;
            }
            handleInputChange(record, "final", value);
          }}
        />
      ),
    },
    {
      title: "Mark (100%)",
      dataIndex: "total",
      render: (text, record, index) => (
        <InputNumber value={record.total} disabled={true} />
      ),
    },
  ];

  //error message
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const onFinish = async (values) => {
    const mark = await getMarks();
    setMarks([...mark]);

    let date = new Date();
    date = date.getFullYear();
    setFormsData({ ...values, year: date });
    const tData = mark.filter((data) => {
      return (
        values.grade === data.grade &&
        values.section === data.section &&
        values.course === data.courseId
      );
    });

    let theData = [];

    if (values.semister === "firstSemister") {
      theData = {
        key: tData[0].markId,
        name: tData[0].studentName,
        mark1: tData[0].firstSemister[0].mark1,
        mark2: tData[0].firstSemister[0].mark2,
        mark3: tData[0].firstSemister[0].mark3,
        mark4: tData[0].firstSemister[0].mark4,
        mark5: tData[0].firstSemister[0].mark5,
        final: tData[0].firstSemister[0].final,
        total:
          tData[0].firstSemister[0].mark1 +
          tData[0].firstSemister[0].mark2 +
          tData[0].firstSemister[0].mark3 +
          tData[0].firstSemister[0].mark4 +
          tData[0].firstSemister[0].mark5 +
          tData[0].firstSemister[0].final,
      };
    }
    if (values.semister === "secondSemister") {
      theData = {
        key: tData[0].markId,
        name: tData[0].studentName,
        mark1: tData[0].secondSemister[0].mark1,
        mark2: tData[0].secondSemister[0].mark2,
        mark3: tData[0].secondSemister[0].mark3,
        mark4: tData[0].secondSemister[0].mark4,
        mark5: tData[0].secondSemister[0].mark5,
        final: tData[0].secondSemister[0].final,
        total:
          tData[0].secondSemister[0].mark1 +
          tData[0].secondSemister[0].mark2 +
          tData[0].secondSemister[0].mark3 +
          tData[0].secondSemister[0].mark4 +
          tData[0].secondSemister[0].mark5 +
          tData[0].secondSemister[0].final,
      };
    }
    setDataSource([theData]);
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
          <Title level={4}>Select Criteria</Title>
        </div>
        <div
          style={{
            textAlign: "left",
            marginBottom: 20,
            marginTop: 24.5,
            // width: "80%",
            // marginLeft: 49,
          }}>
          <Form form={searchForm} onFinish={onFinish}>
            <Form.Item noStyle name="grade">
              <Select
                onChange={(value) => {
                  localStorage.setItem("grade", value);
                }}
                placeholder="Grade"
                style={{ width: 220 }}>
                {options}
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
            <Form.Item noStyle name="course" required>
              <Select
                style={{
                  marginLeft: 5,
                  width: 220,
                  textAlign: "left",
                }}
                placeholder="Subject">
                {courses.map((course) => {
                  const grade = localStorage.getItem("grade");
                  return course.grade === grade &&
                    course.offered === "Offered" ? (
                    <Option key={Math.random()} value={`${course.courseId}`}>
                      {course.courseName}
                    </Option>
                  ) : (
                    []
                  );
                })}
              </Select>
            </Form.Item>
            {/* {periodRender} */}
            <Form.Item noStyle name="semister" required>
              <Select
                style={{
                  width: 220,
                  textAlign: "left",
                  marginLeft: 5,
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
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowClassName={(record) =>
          record.total < 50 ? "red-row" : record.total >= 50 ? "green-row" : ""
        }
      />
    </div>
  );
};

export default StudentMark;
