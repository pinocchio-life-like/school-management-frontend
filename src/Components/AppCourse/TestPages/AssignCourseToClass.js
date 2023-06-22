import { useLocation } from "react-router-dom";
import {
  Button,
  Space,
  Table,
  Input,
  Form,
  Select,
  Typography,
  Col,
  Row,
  message,
  Checkbox,
  Popconfirm,
} from "antd";
import Title from "antd/es/typography/Title";
// import { EditFilled, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./CourseList.css";
import { Group } from "antd/es/avatar";
// import CourseSearchForm from "./CourseSearchForm/CourseSearchForm";
const { Search } = Input;
const { Option } = Select;

const originData = [
  {
    key: Math.random(),
    courseName: `Grade 1st Course Group`,
    grade: "Grade 1-A \nGrade 1-B\nGrade 1-C",
    courses: (
      <div>
        <div>Mathemathics</div>
        <div>English</div>
        <div>Physical Education</div>
        <div>Chemistry</div>
      </div>
    ),
  },
  {
    key: Math.random(),
    courseName: `Grade 2nd Course Group`,
    grade: "Grade 2-A \nGrade 2-B \nGrade 2-C",
    courses: (
      <div>
        <div>Mathemathics</div>
        <div>English</div>
        <div>Physical Education</div>
        <div>Chemistry</div>
      </div>
    ),
  },
  {
    key: Math.random(),
    courseName: `Grade 8th Course Group `,
    grade: "Grade 8-A \nGrade 8-B \nGrade 8-C",
    courses: (
      <div>
        <div>Mathemathics</div>
        <div>English</div>
        <div>Physical Education</div>
        <div>Chemistry</div>
      </div>
    ),
  },
];

// Editable Cell

const AssignCourseToClass = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [assignedCourses, setAssignedCourses] = useState(
    location.state.selectedRowsData.map((courses) => {
      return (
        <Row span={8}>
          <Checkbox value={courses.courseName}>{courses.courseName}</Checkbox>
        </Row>
      );
    })
  );
  const isEditing = (record) => record.key === editingKey;
  const [filteredData, setFilteredData] = useState(originData);

  // edit start start
  const edit = (record) => {
    isEditing(record);

    let recordCourses = [];
    const recordCourseLength = record.courses.props.children.length;
    for (let i = 0; i < recordCourseLength; i++) {
      recordCourses.push(record.courses.props.children[i].props.children);
    }
    // console.log(recordCourses);
    console.log(record.courses.props.children[0].props.children);
    setAssignedCourses(
      recordCourses.map((courses) => {
        return (
          <Row span={8}>
            <Checkbox value={courses}>{courses}</Checkbox>
          </Row>
        );
      })
    );
  };
  //edit start end
  //cancel edit
  const deleteCourseGroup = (record) => {
    const index = originData.indexOf(record);
    originData.splice(index, 1);
    setFilteredData([...originData]);
  };
  // cancel edit || assign end
  //Save Edit start
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...filteredData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setFilteredData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setFilteredData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const GroupExistsWarning = () => {
    messageApi.open({
      type: "error",
      content: "Course Group Already Exists!",
    });
  };
  //Assign Courses to class

  //table columns data

  const columns = [
    {
      title: "Course Group Name",
      dataIndex: "courseName",
      width: "25%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Grade-Section",
      dataIndex: "grade",
      width: "10%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Courses",
      dataIndex: "courses",
      width: "14%",
      editable: true,
      Assignable: true,
    },
    {
      width: "15%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => {
                setEditingKey(() => record.key);
                isEditing(record);
                edit(record);
              }}>
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure want to delete?"
              onConfirm={() => {
                deleteCourseGroup(record);
              }}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  //table columns end

  //columns merge start

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    } else if (!col.Assignable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "grade" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // columns merge end

  // const [expandable, setExpandable] = useState(true);

  const onFinish = (values) => {
    const courseGroupTitle = originData.map((title) => {
      return title.courseName;
    });
    console.log(courseGroupTitle);
    for (let i = 0; i < courseGroupTitle.length; i++) {
      if (values.courseGroupName === courseGroupTitle[i] && !editingKey) {
        GroupExistsWarning();
        return;
      }
    }

    if (editingKey) {
      console.log(values.courseGroupName);
      const courses = values.courses;
      const SelectedCourses = courses.map((course) => {
        return <div>{course}</div>;
      });
      const section = values.sections;
      const gradeAndSection = section.map((grade) => {
        return (
          <div>
            {values.grade}-{grade}
          </div>
        );
      });

      const keyList = originData.map((key) => {
        return key.key;
      });
      const recordIndex = keyList.indexOf(editingKey);
      console.log("record index: ", recordIndex);

      originData.splice(recordIndex, 1, {
        key: Math.random(),
        courseName: `${values.courseGroupName}`,
        grade: <>{gradeAndSection}</>,
        courses: <>{SelectedCourses}</>,
      });
      setFilteredData([...originData]);
      setEditingKey("");
    } else {
      console.log(values.courseGroupName);
      const courses = values.courses;
      const SelectedCourses = courses.map((course) => {
        return <div>{course}</div>;
      });
      const section = values.sections;
      const gradeAndSection = section.map((grade) => {
        return (
          <div>
            {values.grade}-{grade}
          </div>
        );
      });
      originData.push({
        key: Math.random(),
        courseName: `${values.courseGroupName}`,
        grade: <>{gradeAndSection}</>,
        courses: <>{SelectedCourses}</>,
      });
      setFilteredData([...originData]);
    }
  };
  const onChangeCheckBox = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  // const onGradeSelectChange = (value) => {
  //   const gradeforId = value
  //     .substring(value.length - 1, value.length)
  //     .toUpperCase();
  //   setsectionsValue(`${courseNameForId}${gradeforId}`);
  // };
  // const onCourseNameChange = (e) => {
  //   const courseName = e.target.value;
  //   setCourseNameForId(() => {
  //     return courseName.substring(0, 4).toUpperCase();
  //   });
  //   setsectionsValue(() => {
  //     return courseName.substring(0, 4).toUpperCase();
  //   });
  // };

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
            Add Course Group
          </Title>
        </div>
        <Form
          className="CourseGroupList"
          style={{ justifyContent: "left", marginTop: 17 }}
          form={addForm}
          name="horizontal_login"
          layout="vertical"
          onFinish={onFinish}>
          <Form.Item
            label="Course Group Name"
            style={{
              minWidth: 250,
              textAlign: "left",
            }}
            name="courseGroupName"
            rules={[
              {
                required: true,
                message: "Please input course name!",
              },
            ]}>
            <Input
              style={{ marginTop: -15 }}
              // onChange={onCourseNameChange}
              type="text"
              placeholder="Course Name"
            />
          </Form.Item>
          <Form.Item
            label="Grade"
            style={{ marginTop: -15, minWidth: 250, textAlign: "left" }}
            name="grade"
            rules={[
              {
                required: true,
                message: "Please select grade!",
              },
            ]}>
            <Select
              style={{ marginTop: -15 }}
              // onSelect={onGradeSelectChange}
              placeholder="Select Grade">
              <Option value="Grade 1">Grade 1</Option>
              <Option value="Grade 2">Grade 2</Option>
              <Option value="Grade 3">Grade 3</Option>
              <Option value="Grade 4">Grade 4</Option>
              <Option value="Grade 5">Grade 5</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Sections"
            style={{ marginTop: -15, minWidth: 250, textAlign: "left" }}
            name="sections"
            rules={[
              {
                required: true,
                message: "Please input sections!",
              },
            ]}>
            <Checkbox.Group
              style={{
                width: "100%",
                marginTop: -10,
              }}
              onChange={onChangeCheckBox}>
              <Col>
                <Col span={8}>
                  <Checkbox value="A">A</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="B">B</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="C">C</Checkbox>
                </Col>
              </Col>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label="Courses"
            style={{ marginTop: -15, minWidth: 250, textAlign: "left" }}
            name="courses"
            rules={[
              {
                required: true,
                message: "Please Select courses!",
              },
            ]}>
            <Checkbox.Group
              style={{
                width: "100%",
                marginTop: -10,
              }}
              onChange={onChangeCheckBox}>
              <Col>{assignedCourses}</Col>
            </Checkbox.Group>
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
            Course Group List
          </Title>
        </div>
        <div className="CourseListTable">
          <div>
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 27,
              }}>
              <Search
                style={{ marginLeft: "48%" }}
                placeholder="input search text"
                onSearch={onSearch}
                onChange={onSearchChange}
                // onChange=
                enterButton
              />
            </div>
            <Form form={form} component={false}>
              <Table
                bordered
                dataSource={filteredData}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                  onChange: deleteCourseGroup,
                }}
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCourseToClass;
