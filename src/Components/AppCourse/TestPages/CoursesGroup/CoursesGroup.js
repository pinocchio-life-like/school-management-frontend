import {
  Button,
  Checkbox,
  Col,
  Form,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import "./CoursesGroup.css";

//original Data
const originData = [
  {
    key: Math.random(),
    courseName: `Grade 1 Courses Group`,
    notOffered: (
      <div>
        <div>All Offered</div>
      </div>
    ),
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
    courseName: `Grade 2 Courses Group`,
    notOffered: (
      <div>
        <div>Music</div>
        <div>Informal English</div>
      </div>
    ),
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
    courseName: `Grade 8 Courses Group `,
    notOffered: (
      <div>
        <div>Literature</div>
        <div>Computer Programming</div>
      </div>
    ),
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
const CoursesGroup = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [recordBeingEdited, setRecordBeingEdited] = useState("");
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [containerCss, setContainerCss] = useState("CourseGroupCSS");

  //   console.log(courses);
  const [tableData, setTableData] = useState([...originData]);
  const onFinish = (values) => {
    console.log(recordBeingEdited.courses);
    const indexValue = tableData.indexOf(recordBeingEdited);
    console.log(values);
    const courses = values.courses.map((course) => {
      return <div>{course}</div>;
    });
    const notOffered = offeredCourses.map((nonOffered) => {
      return nonOffered.props.children.props.value;
    });
    for (let i = 0; i < values.courses.length; i++) {
      const indexValue = notOffered.indexOf(values.courses[i]);
      notOffered.splice(indexValue, 1);
    }
    const notOfferedAgain = notOffered.map((course) => {
      return <div>{course}</div>;
    });
    console.log(notOffered);
    tableData.splice(indexValue, 1, {
      key: tableData[indexValue].key,
      courseName: recordBeingEdited.courseName,
      notOffered: <div>{notOfferedAgain}</div>,
      courses: <div>{courses}</div>,
    });
    setTableData([...tableData]);
  };
  //delete Course Group
  const deleteCourseGroup = (record) => {
    const index = tableData.indexOf(record);
    tableData.splice(index, 1);
    setTableData([...tableData]);
  };
  //on change checkbox
  const onChangeCheckBox = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  //Table Columns
  const columns = [
    {
      title: "Course Group Name",
      dataIndex: "courseName",
      width: "16%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Offered Courses",
      dataIndex: "courses",
      width: "18%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Not Offered",
      dataIndex: "notOffered",
      width: "14%",
      editable: true,
      Assignable: true,
    },
    {
      width: "5%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Typography.Link
              //   disabled={editingKey !== ""}
              onClick={() => {
                setRecordBeingEdited(record);
                const courses = [];
                for (let i = 0; i < record.courses.props.children.length; i++) {
                  courses.push(record.courses.props.children[i].props.children);
                }
                const notOfferedCourses = [];
                for (
                  let i = 0;
                  i < record.notOffered.props.children.length;
                  i++
                ) {
                  notOfferedCourses.push(
                    record.notOffered.props.children[i].props.children
                  );
                }
                const offeredAntNotOffered = [...courses, ...notOfferedCourses];
                const offer = offeredAntNotOffered.map((course) => {
                  return (
                    <Row>
                      <Checkbox value={course}>{course}</Checkbox>
                    </Row>
                  );
                });

                setOfferedCourses(offer);
                setEditing(true);
                setContainerCss("CourseGroupCSSOnEdit");
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
  //merged Columns
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
        inputType: col.dataIndex === "notOffered" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        // editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <div className={containerCss}>
        <div className="CourseGroupTitle">
          <Title
            level={3}
            style={{ textAlign: "left", marginTop: 5, marginBottom: 10 }}>
            Course Group List
          </Title>
        </div>
        <div className="CourseGroupSearchBar">
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: 5,
              marginTop: 7,
              marginRight: 5,
            }}>
            <Search
              style={{ marginLeft: "30%" }}
              placeholder="input search text"
              //   onSearch={onSearch}
              // onChange={onSearchChange}
              // onChange=
              enterButton
            />
          </div>
        </div>
        {editing ? (
          <>
            <div className="EditCourseGroup">
              <Form
                className="CourseGroupList"
                style={{
                  justifyContent: "left",
                  marginTop: 17,
                  marginRight: 15,
                }}
                form={addForm}
                name="horizontal_login"
                layout="vertical"
                onFinish={onFinish}>
                <Form.Item
                  label={
                    <>
                      <span
                        style={{
                          color: "red",
                          fontSize: "20px",
                          paddingTop: "5px",
                          marginRight: "2px",
                        }}>
                        *
                      </span>
                      {` Course Group Name`}
                    </>
                  }
                  style={{
                    after: { content: "*", color: "red" },
                    minWidth: 200,
                    textAlign: "left",
                    "&::after": {
                      content: "*",
                      color: "red",
                    },
                  }}
                  rules={[
                    {
                      required: false,
                      message: "Please input course name!",
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
                    }}
                    // readOnly
                    // defaultValue=
                    // type="text"
                    // placeholder="Course Id"
                  >
                    <strong>{recordBeingEdited.courseName}</strong>
                  </div>
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
                    <Col>{offeredCourses}</Col>
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
            <div className="CourseGroupTableOnEdit">
              <Form form={form} component={false}>
                <Table
                  style={{ marginTop: 10 }}
                  //   bordered
                  dataSource={tableData}
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  pagination={{
                    onChange: deleteCourseGroup,
                  }}
                />
              </Form>
            </div>
          </>
        ) : (
          <div className="CourseGroupTable">
            <Form form={form} component={false}>
              <Table
                style={{ marginTop: 10 }}
                //   bordered
                dataSource={tableData}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                  onChange: deleteCourseGroup,
                }}
              />
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesGroup;
