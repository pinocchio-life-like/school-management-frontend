import {
  Button,
  Checkbox,
  Col,
  Form,
  message,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import "./CourseGroup.css";

//original Data
let originData = [];
const CourseGroup = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [recordBeingEdited, setRecordBeingEdited] = useState("");
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [containerCss, setContainerCss] = useState("CourseGroupCSS");
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [originalData, setOriginalData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const getCourseGroup = async () => {
      const response = await fetch(
        "http://localhost:8080/course/offeredCourses"
      );
      const responseData = await response.json();

      try {
        if (responseData.code === 404) {
          throw new Error("Internet Connection Problem");
        }

        const courseGroup = responseData.coursesGroup;
        setOriginalData(courseGroup);
        const data = [];
        for (let i = 0; i < courseGroup.length; i++) {
          const offered = [];
          for (let j = 0; j < courseGroup[i].offered.length; j++) {
            offered.push(
              <div key={Math.random()}>{courseGroup[i].offered[j]}</div>
            );
          }

          const notOffered = [];
          for (let j = 0; j < courseGroup[i].notOffered.length; j++) {
            notOffered.push(
              <div key={Math.random()}>{courseGroup[i].notOffered[j]}</div>
            );
          }
          data.push({
            key: courseGroup[i].id,
            courseName: courseGroup[i].courseGroupName,
            notOffered: <div key={Math.random()}>{notOffered}</div>,
            courses: <div key={Math.random()}>{offered}</div>,
          });
        }
        originData = data.map((data) => data);
        setTableData([...originData]);
      } catch (err) {
        error("Check for your internet connection");
      }
    };
    getCourseGroup();
  }, []);

  // Message handler
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

  const onFinish = async (values) => {
    setIsSaving(true);
    let indexValue;
    const offeredId = [];
    const notOffered = [];
    let grade;
    for (let i = 0; i < originalData.length; i++) {
      if (originalData[i].id === recordBeingEdited.key) {
        indexValue = i;
        grade = originalData[i].grade;
        originalData[i].offered.forEach((offer) => {
          notOffered.push(offer);
        });
        originalData[i].notOffered.forEach((notOffer) => {
          notOffered.push(notOffer);
        });
      }
      for (let j = 0; j < values.courses.length; j++) {
        for (let k = 0; k < originalData[i].offeredId.length; k++) {
          if (originalData[i].offered[k] === values.courses[j]) {
            offeredId.push(originalData[i].offeredId[k]);
          }
        }
        let index = notOffered.indexOf(values.courses[j]);
        notOffered.splice(index, 1);
      }
    }
    const courseGroup = {
      courseGroupName: recordBeingEdited.courseName,
      offered: values.courses,
      offeredId: offeredId,
      notOffered: notOffered,
      grade: grade,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/course/offerCourses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseGroup),
        }
      );
      const responseData = await response.json();

      if (responseData.code === 404) {
        throw new Error("Couldnt Offer Course");
      }
      setIsSaving(false);
      success("The Selected Courses Are Offered Successfully");
      addForm.resetFields();
      setContainerCss("CourseGroupCSS");
      setEditing(false);
    } catch (err) {
      setIsSaving(false);
      setContainerCss("CourseGroupCSS");
      setEditing(false);
      error("Couldnt Offer Course");
    }
    const courses = values.courses.map((course) => {
      return <div key={Math.random()}>{course}</div>;
    });
    const notOfferedAgain = notOffered.map((course) => {
      return <div key={Math.random()}>{course}</div>;
    });
    tableData.splice(indexValue, 1, {
      key: tableData[indexValue].key,
      courseName: recordBeingEdited.courseName,
      notOffered: <div key={Math.random()}>{notOfferedAgain}</div>,
      courses: <div key={Math.random()}>{courses}</div>,
    });
    setTableData([...tableData]);
  };
  //delete Course Group
  const deleteCourseGroup = async (record) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8080/course/courseGroup/${record.key}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Couldnt delete, check your internet");
      }
      success("Deleted Successfully");
      const index = originData.indexOf(record);
      originData.splice(index, 1);
      setTableData([...originData]);
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      error("Check your Internet and try again");
    }
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
                      <Checkbox key={Math.random()} value={course}>
                        {course}
                      </Checkbox>
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
              <a onClick={() => {}}>Delete</a>
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
      {contextHolder}
      <Spin spinning={isSaving}>
        <div className={containerCss}>
          <div className="CourseGroupTitle">
            <Title level={3} style={{ textAlign: "left", marginBottom: 10 }}>
              Course Group List
            </Title>
          </div>
          <div className="CourseGroupSearchBar">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 27,
              }}>
              {/* <Search
                style={{ marginLeft: "30%" }}
                placeholder="input search text"
                  onSearch={onSearch}
                onChange={onSearchChange}
                onChange=
                enterButton
              /> */}
            </div>
          </div>
          {editing ? (
            <>
              <div className="EditCourseGroup">
                <Form
                  className="CourseGroupList"
                  style={{ justifyContent: "left", marginTop: 17 }}
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
      </Spin>
    </div>
  );
};

export default CourseGroup;
