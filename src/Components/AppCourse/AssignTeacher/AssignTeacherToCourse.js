import {
  Button,
  Space,
  Table,
  Input,
  Form,
  Select,
  Typography,
  Popconfirm,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import "./AssignTeacherToCourse.css";
const { Search } = Input;
const { Option } = Select;

let originData = [];
let originalData = [];
let courseData = [];
let tableRecord = [];

const convertData = (data) => {
  tableRecord = data;
  let result = {
    key: data.key,
    teacherName: data.teacherName,
    grade: { props: { children: [] } },
    status: data.status,
  };
  data.grade.forEach((grade, index) => {
    let gradeCourses = data.coursesId[index];
    let gradeSections = [];
    data.assignedTo.forEach((item) => {
      if (gradeCourses.includes(item.coursesId)) {
        gradeSections.push(...item.sections);
      }
    });
    result.grade.props.children.push(
      <li key={Math.random()} style={{ marginLeft: -20, display: "inline" }}>
        {grade}
      </li>
    );

    gradeCourses.forEach((course, courseIndex) => {
      let sections = [];
      gradeSections.forEach((item) => {
        if (item.coursesId === course) {
          sections.push(item.sections.join(" "));
        }
      });
      result.grade.props.children.push(
        <li key={Math.random()}>
          {course} {sections.join(", ")}
        </li>
      );
    });
  });
  return result;
};
const AssignTeacherToCourse = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [containerCss, setContainerCss] = useState("FullTableContainerCss");
  const [messageApi, contextHolder] = message.useMessage();
  const [sectionsForEachGrade, setSectionsForEachGrade] = useState([]);
  const [tableData, setTableData] = useState(originData);

  useEffect(() => {
    const getClasses = async () => {
      const response = await fetch("http://localhost:8080/teacher/teacherList");
      const responseData = await response.json();

      const courseResponse = await fetch(
        "http://localhost:8080/course/courseBreakDown"
      );
      const coursesData = await courseResponse.json();
      courseData = coursesData.courses;
      const data = [];
      const originaldata = [];
      for (let i = 0; i < responseData.teachers.length; i++) {
        let grade = [];
        let normalGrade = [];
        let insideCourse = [];
        for (let k = 0; k < responseData.teachers[i].coursesId.length; k++) {
          const course = [];
          for (let j = 0; j < courseData.length; j++) {
            for (
              let l = 0;
              l < responseData.teachers[i].coursesId[k].length;
              l++
            ) {
              if (
                courseData[j].grade === responseData.teachers[i].grade[k] &&
                courseData[j].courseId ===
                  responseData.teachers[i].coursesId[k][l]
              ) {
                course.push(courseData[j].courseName);
              }
            }
          }
          insideCourse.push({
            coursesId: responseData.teachers[i].coursesId[k],
            grade: responseData.teachers[i].grade[k],
            courseName: course,
          });
        }
        for (let j = 0; j < insideCourse.length; j++) {
          const courseName = [];
          const courseId = [];
          for (let l = 0; l < insideCourse[j].courseName.length; l++) {
            courseName.push(
              <li key={Math.random()}>{insideCourse[j].courseName[l]}</li>
            );
            courseId.push(insideCourse[j].coursesId[l]);
          }
          grade.push(
            <>
              <ul>
                <li
                  key={Math.random()}
                  style={{ marginLeft: -20, display: "inline" }}>
                  {insideCourse[j].grade}
                </li>
                {courseName}
              </ul>
            </>
          );
          normalGrade.push(insideCourse[j].grade);
        }

        let coursesId = [];
        let normalID = [];
        for (let j = 0; j < responseData.teachers[i].coursesId.length; j++) {
          coursesId.push(
            <p key={Math.random()}>{responseData.teachers[i].coursesId[j]}</p>
          );
          normalID.push(responseData.teachers[i].coursesId[j]);
        }
        const listValues = [];
        for (
          let n = 0;
          n < responseData.teachers[i].assignedTo[0].length;
          n++
        ) {
          listValues.push(
            <li key={Math.random()}>
              {responseData.teachers[i].assignedTo[0][n]}
            </li>
          );
        }

        data.push({
          key: responseData.teachers[i].teacherId,
          teacherName: responseData.teachers[i].teacherName,
          grade: grade,
          coursesId: <>{coursesId}</>,
          competitionalLevel: responseData.teachers[i].competitionalLevel,
          status:
            responseData.teachers[i].status === "Not Assigned" ? (
              "Not Assigned"
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {listValues}
              </ul>
            ),
          assignedTo: responseData.teachers[i].assignedTo,
        });

        originaldata.push({
          key: responseData.teachers[i].teacherId,
          teacherName: responseData.teachers[i].teacherName,
          grade: normalGrade,
          coursesId: normalID,
          competitionalLevel: responseData.teachers[i].competitionalLevel,
          status: responseData.teachers[i].status,
          assignedTo: responseData.teachers[i].assignedTo,
        });
      }
      originalData = originaldata.map((data) => data);
      originData = data.map((data) => data);
      setTableData([...originData]);
    };
    getClasses();
  }, [editing]);

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

  //on Assingn Finish
  const onFinish = async (values) => {
    const record = tableRecord;
    let data = [];
    const assignedTo = [];
    data.teacherId = record.key;
    data.teacherName = record.teacherName;
    Object.entries(values).forEach(([key, value]) => {
      if (String(key) === "grade") {
        data.grade = value;
      }
      if (String(key).slice(1) === "Courses") {
        assignedTo.push(value);
      }
    });
    data.coursesId = record.coursesId;
    data.assignedTo = assignedTo;
    const { competitionalLevel } = originalData.find((data) => {
      return data.key === record.key;
    });
    data.competitionalLevel = competitionalLevel;
    data.status = assignedTo[0].length === 0 ? "Not Assigned" : "Assigned";

    try {
      await fetch("http://localhost:8080/teacher/teacherList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: data.teacherId,
          teacherName: data.teacherName,
          competitionalLevel: data.competitionalLevel,
          grade: data.grade,
          status: data.status,
          coursesId: data.coursesId,
          assignedTo: assignedTo,
        }),
      });
      success("Teacher Successfully Assigned");
    } catch (err) {
      error("Check your Internet and try Again");
      return;
    }

    const listValues = [];
    for (let n = 0; n < assignedTo[0].length; n++) {
      listValues.push(<li key={Math.random()}>{assignedTo[0][n]}</li>);
    }

    data.status =
      assignedTo[0].length === 0 ? (
        "Not Assigned"
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>{listValues}</ul>
      );
    tableData.splice(tableData.indexOf(tableRecord), 1, data);
    setTableData([...tableData]);
    setEditing(false);
    setContainerCss("FullTableContainerCss");
  };
  //table columns data

  const columns = [
    {
      title: "Teacher Name",
      dataIndex: "teacherName",
      width: "21%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Grade, Course And Section",
      dataIndex: "grade",
      width: "35%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Assigned To",
      dataIndex: "status",
      width: "15%",
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
              // disabled={editing}
              // disabled={editingKey !== ""}
              onClick={() => {
                tableRecord = record;
                const teacherNameRender = (
                  <Form.Item
                    initialValue={record.teacherName}
                    label="Teacher Name"
                    style={{ minWidth: 200 }}
                    name={`teacherName`}>
                    <Input
                      disabled
                      style={{ marginTop: -25 }}
                      // onChange={onCourseNameChange}
                      type="text"
                      placeholder="Course Name"
                    />
                  </Form.Item>
                );
                setEditing(true);
                setContainerCss("OnAssignTeacherContainer");
                const indexVal = originData.indexOf(record);
                let theData = convertData(originalData[indexVal]);

                let grade = theData.grade;

                const gradeValues = grade.props.children.map(
                  (child, index) => child.props.children
                );

                let currentIndex = -1;
                const result = [];
                gradeValues.forEach((value) => {
                  if (String(value) && String(value).startsWith("Grade")) {
                    currentIndex++;
                    result[currentIndex] = { grade: value, courses: [] };
                  } else if (result[currentIndex]) {
                    let [course] = value;
                    let courseObj = { course };
                    result[currentIndex].courses.push(courseObj);
                  }
                });

                const courseDefaultValue = [];
                const GradeCourseSection = [];
                const gradeDefaultValue = [];
                const grad = [];
                const options = [];
                for (let i = 0; i < result.length; i++) {
                  grad.push(result[i].grade);
                  const courseForGradeInOne = [];
                  const insideCourses = [];
                  for (let j = 0; j < result[i].courses.length; j++) {
                    for (let l = 0; l < courseData.length; l++) {
                      if (
                        result[i].courses[j].course === courseData[l].courseId
                      ) {
                        options.push({
                          courseName: courseData[l].courseName,
                          grade: result[i].grade,
                          courseId: courseData[l].courseId,
                        });
                      }
                    }
                    insideCourses.push(result[i].courses[j].course);
                    const { courseName } = courseData.find((data) => {
                      return result[i].courses[j].course === data.courseId;
                    });

                    courseForGradeInOne.push({
                      courses: result[i].courses[j].course,
                      sections: result[i].courses[j].sections,
                      courseName: courseName,
                    });
                  }
                  courseDefaultValue.push(insideCourses);
                  GradeCourseSection.push({
                    grade: result[i].grade,
                    courses: courseForGradeInOne,
                  });
                }
                gradeDefaultValue.push(
                  <Form.Item
                    initialValue={grad}
                    label="Grade"
                    style={{
                      minWidth: 200,
                      textAlign: "left",
                      marginTop: -20,
                    }}
                    name={`grade`}>
                    <Select
                      disabled
                      mode="multiple"
                      style={{ marginTop: -25 }}
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
                );
                const gradeRender = [];
                for (let i = 0; i < GradeCourseSection.length; i++) {
                  const option = [];
                  for (let j = 0; j < options.length; j++) {
                    if (options[j].grade === GradeCourseSection[i].grade) {
                      option.push(
                        <Option
                          key={Math.random()}
                          value={`${options[j].courseId}`}>
                          {options[j].courseName}
                        </Option>
                      );
                    }
                  }
                  gradeRender.push(
                    <>
                      <Form.Item
                        initialValue={courseDefaultValue[i]}
                        label={`${GradeCourseSection[i].grade} Courses`}
                        style={{
                          minWidth: 200,
                          textAlign: "left",
                          marginTop: -20,
                        }}
                        name={`${GradeCourseSection[i].grade.substring(
                          6,
                          7
                        )}Courses`}>
                        <Select
                          // disabled
                          mode="multiple"
                          allowClear
                          style={{ marginTop: -25 }}
                          placeholder="Select Courses">
                          {option}
                        </Select>
                      </Form.Item>
                    </>
                  );
                }

                const wholeFormRender = [];
                wholeFormRender.push(
                  <Form
                    style={{ justifyContent: "left", marginTop: -12 }}
                    form={addForm}
                    name="horizontal_login"
                    layout="vertical"
                    onFinish={onFinish}>
                    {teacherNameRender}
                    {gradeDefaultValue}
                    {gradeRender}
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
                );
                setSectionsForEachGrade(wholeFormRender);
                // grade.length = 0;
                addForm.resetFields();
              }}>
              Assign
            </Typography.Link>
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

  //Delete handler
  const deleteCourse = (record) => {
    const indexValue = tableData.indexOf(record);
    tableData.splice(indexValue, 1);
    setTableData([...tableData]);
  };

  return (
    <>
      {contextHolder}
      <div className={containerCss}>
        <div className="AssignTeacherTitle" style={{ marginBottom: 15 }}>
          <Title
            level={3}
            style={{ textAlign: "left", marginLeft: 5, marginTop: 10 }}>
            Teachers List
          </Title>
        </div>
        <div
          className="CourseListTitleAndSearchBar"
          style={{ marginBottom: 15 }}>
          <div className="CourseGroupSearchBar">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 0,
                marginTop: 10,
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
        </div>
        {editing ? (
          <>
            <div className="AssignTeacherForm">{sectionsForEachGrade}</div>
            <div className="OnAssignTeacherTable">
              <Table
                style={{ marginTop: 15 }}
                //   bordered
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
                // pagination={{
                //   onChange: deleteCourseGroup,
                // }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="FullTableCss">
              <Form form={form} component={false}>
                <Table
                  style={{ marginTop: 15 }}
                  //   bordered
                  dataSource={tableData}
                  columns={columns}
                  rowClassName="editable-row"
                  // pagination={{
                  //   onChange: deleteCourseGroup,
                  // }}
                />
              </Form>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default AssignTeacherToCourse;
