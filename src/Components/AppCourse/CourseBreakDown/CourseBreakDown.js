import { useNavigate } from "react-router-dom";
import {
  Button,
  Space,
  Table,
  Input,
  Form,
  Select,
  Popconfirm,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import "./CourseBreakDown.css";
// import CourseSearchForm from "./CourseSearchForm/CourseSearchForm";
const { Search } = Input;
const { Option } = Select;

let originData = [];

const CourseBreakDown = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [addForm] = Form.useForm();
  const [courseIdValue, setCourseIdValue] = useState("Null");
  const [courseNameForId, setCourseNameForId] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const getCourses = async () => {
      const response = await fetch(
        "http://localhost:8080/course/courseBreakDown"
      );
      const responseData = await response.json();
      originData = responseData.courses;
      setFilteredData(originData);
    };
    getCourses();
  }, []);

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
  //Save edit end
  //delete course
  const deleteCourse = (record) => {
    const index = originData.indexOf(record);
    originData.splice(index, 1);
    setFilteredData([...originData]);
  };
  //table columns data

  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      width: "21%",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: "12%",
    },
    {
      title: "Course Id",
      dataIndex: "courseId",
      width: "14%",
    },
    {
      title: "Teacher",
      dataIndex: "teacherId",
      width: "18%",
    },
    {
      title: "Offered",
      dataIndex: "offered",
      width: "18%",
    },
    {
      width: "8%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Sure want to delete?"
              onConfirm={() => {
                deleteCourse(record);
              }}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  //table columns end

  // const [expandable, setExpandable] = useState(true);

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:8080/course/courseBreakDown",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseName: values.courseName,
            grade: values.grade,
            courseId: courseIdValue,
            offered: "Not Offered",
            teacherId: "Not Assigned",
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Record Already Exists");
      }
      originData.push(responseData.course);
      console.log(responseData);
      setFilteredData([...originData]);
      success("saved Successfully");
      addForm.resetFields();
      setCourseIdValue("Null");
    } catch (err) {
      error("Course Already Exists");
      console.log(err);
    }
    // originData.push({
    //   key: Math.random(),
    //   courseName: `${values.courseName}`,
    //   grade: `${values.grade}`,
    //   courseId: `${courseIdValue}`,
    //   teacher: `Not Assigned`,
    // });
    // setFilteredData([...originData]);
  };
  const onGradeSelectChange = (value) => {
    const gradeforId = value
      .substring(value.length - 1, value.length)
      .toUpperCase();
    setCourseIdValue(`${courseNameForId}G${gradeforId}`);
  };
  const onCourseNameChange = (e) => {
    const courseName = e.target.value;
    setCourseNameForId(() => {
      return courseName.substring(0, 4).toUpperCase();
    });
    setCourseIdValue(() => {
      return courseName.substring(0, 4).toUpperCase();
    });
  };

  const onSearch = (values) => {
    let searchText = values;
    let courseName = filteredData.map((name) => {
      return name.courseName;
    });
    let grade = filteredData.map((grade) => {
      return grade.grade;
    });

    const courseListByName = originData.filter((list, i) => {
      return searchText.toLowerCase() ===
        courseName[i].substring(0, searchText.length).toLowerCase()
        ? list
        : "";
    });

    const courseListByGrade = originData.filter((list, i) => {
      return searchText.toLowerCase() ===
        grade[i].substring(0, searchText.length).toLowerCase()
        ? list
        : "";
    });

    if (courseListByName.length !== 0) {
      setFilteredData(courseListByName);
    } else if (courseListByGrade.length !== 0) {
      setFilteredData(courseListByGrade);
    } else {
      setFilteredData("");
    }
  };

  const onSearchChange = (e) => {
    if (e.target.value.length === 0) setFilteredData(originData);
  };
  return (
    <div className="CourseListCSS">
      {contextHolder}
      <div className="CourseAddContainer">
        <div className="CourseAddTitle">
          <Title level={3} style={{ textAlign: "left", marginBottom: 10 }}>
            Add Course
          </Title>
        </div>
        <Form
          style={{ justifyContent: "left", marginTop: 17 }}
          form={addForm}
          name="horizontal_login"
          layout="vertical"
          onFinish={onFinish}>
          <Form.Item
            label="Course Name"
            style={{ minWidth: 330, marginTop: 9 }}
            name="courseName"
            rules={[
              {
                required: true,
                message: "Please input course name!",
              },
            ]}>
            <Input
              style={{ marginTop: -25 }}
              onChange={onCourseNameChange}
              type="text"
              placeholder="Course Name"
            />
          </Form.Item>
          <Form.Item
            label="Grade"
            style={{ minWidth: 330, textAlign: "left", marginTop: -20 }}
            name="grade"
            rules={[
              {
                required: true,
                message: "Please select grade!",
              },
            ]}>
            <Select
              style={{ marginTop: -25 }}
              onSelect={onGradeSelectChange}
              placeholder="Select Grade">
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
          <Form.Item
            label="Course ID"
            style={{ minWidth: 330, marginTop: -20 }}
            name="courseId"
            rules={[
              {
                required: false,
                message: "Please input courseId!",
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
                marginTop: -10,
              }}>
              <strong>{courseIdValue}</strong>
            </div>
          </Form.Item>

          <div className="CourseSaveButton">
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  style={{ minWidth: 100, marginTop: 5 }}
                  type="primary"
                  htmlType="submit">
                  Save
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="CourseListContainer">
        <div className="CourseListTitle">
          <Title level={3} style={{ textAlign: "left", marginBottom: 10 }}>
            Course List
          </Title>
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: 5,
              marginTop: 27,
            }}>
            <Search
              style={{ marginLeft: "30%" }}
              placeholder="input search text"
              onSearch={onSearch}
              onChange={onSearchChange}
              // onChange=
              enterButton
            />
            <Button
              onClick={() => {
                navigate("/courseOffer");
              }}
              type="primary"
              style={{ marginLeft: 5 }}>
              Offer Courses
            </Button>
          </div>
        </div>
        <div className="CourseListTable">
          <div>
            <Form form={form} component={false}>
              <Table
                bordered
                dataSource={filteredData}
                columns={columns}
                rowClassName="editable-row"
                pagination={true}
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseBreakDown;
