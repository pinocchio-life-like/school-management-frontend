import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import "./CourseOffer.css";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

//data
let originData = [];
const CourseOffer = () => {
  const [addForm] = Form.useForm();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedToOffer, setSelectedToOffer] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      const response = await fetch(
        "http://localhost:8080/course/courseBreakDown"
      );
      const responseData = await response.json();
      originData = responseData.courses.map((data) => {
        return {
          key: data.courseId,
          courseName: data.courseName,
          grade: data.grade,
          courseId: data.courseId,
          offered: data.offered,
          teacherId: data.teacherId,
        };
      });
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
  //columns
  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      width: "25%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: "20%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Course Id",
      dataIndex: "courseId",
      width: "20%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Offered",
      dataIndex: "offered",
      width: "20%",
      editable: true,
      Assignable: true,
    },
    {
      title: "Teacher",
      dataIndex: "teacherId",
      width: "30%",
      editable: true,
      Assignable: true,
    },
  ];
  //select search
  const onSelectSearch = (value) => {
    setSearchKey(value);
    const data = originData.filter((filtered) => {
      return filtered.grade === value;
    });
    setFilteredData([...data]);
    setSelectedToOffer();
  };

  //On finish adding course Group
  const onFinish = async (values) => {
    setIsSaving(true);
    const notOffered = filteredData.map((course) => course.courseName);
    const offeredId = [];
    for (const course of values.courses) {
      const matchingCourse = filteredData.find((c) => c.courseName === course);
      if (matchingCourse) {
        offeredId.push(matchingCourse.courseId);
        notOffered.splice(notOffered.indexOf(course), 1);
      }
    }

    const courseGroup = {
      courseGroupName: `${searchKey} Courses Group`,
      offered: values.courses,
      offeredId: offeredId,
      notOffered: notOffered,
      grade: searchKey,
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
      } else {
        const response = await fetch(
          "http://localhost:8080/course/courseBreakDown"
        );
        const responseData = await response.json();
        originData = responseData.courses.map((data) => {
          return {
            key: data.courseId,
            courseName: data.courseName,
            grade: data.grade,
            courseId: data.courseId,
            offered: data.offered,
            teacherId: data.teacherId,
          };
        });
        const data = originData.filter((filtered) => {
          return filtered.grade === searchKey;
        });
        setFilteredData([...data]);
      }

      setIsSaving(false);
      success("The Selected Courses Are Offered Successfully");
      setSelectedToOffer([]);
      setSelectedRowKeys([]);
      addForm.resetFields();
    } catch (err) {
      setIsSaving(false);
      error("Couldnt Offer Course");
    }

    // success("The Selected Courses Are Offered Successfully");
    // navigate("/courseGroup", { state: { courseGroup } });
    // navigate("/courseGroup", { state: { fromOffer: true } });
  };
  //on change checkbox
  const onChangeCheckBox = (checkedValues) => {
    // console.log("checked = ", checkedValues);
  };
  //on selected row reload
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  //on select Change row selection

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedCourses = [];
    for (let i = 0; i < filteredData.length; i++) {
      // console.log(filteredData[i].key);
      // console.log(filteredData[i].courseId);
      for (let j = 0; j < newSelectedRowKeys.length; j++) {
        if (filteredData[i].key === newSelectedRowKeys[j]) {
          selectedCourses.push(
            <Row>
              <Checkbox key={Math.random()} value={filteredData[i].courseName}>
                {filteredData[i].courseName}
              </Checkbox>
            </Row>
          );
        }
      }
    }
    setSelectedToOffer(selectedCourses);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <Spin spinning={isSaving}>
        <div className="CourseOfferCSS">
          {contextHolder}
          <div className="OfferCourseTitle">
            <Title level={3} style={{ textAlign: "left" }}>
              Offer Courses
            </Title>
          </div>
          <div className="OfferTableName">
            <div className="OfferCourseTitle">
              <Title level={3} style={{ textAlign: "left" }}>
                Courses List
              </Title>
            </div>
          </div>
          <div className="GradeSearchBar">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 27,
              }}>
              <Select
                onSelect={onSelectSearch}
                showSearch
                style={{
                  width: 350,
                  marginLeft: "10%",
                }}
                placeholder="Select Grade To Offer Courses"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  {
                    value: "Grade 1",
                    label: "Grade 1",
                  },
                  {
                    value: "Grade 2",
                    label: "Grade 2",
                  },
                  {
                    value: "Grade 3",
                    label: "Grade 3",
                  },
                  {
                    value: "Grade 4",
                    label: "Grade 4",
                  },
                  {
                    value: "Grade 5",
                    label: "Grade 5",
                  },
                  {
                    value: "Grade 6",
                    label: "Grade 6",
                  },
                  {
                    value: "Grade 7",
                    label: "Grade 7",
                  },
                  {
                    value: "Grade 8",
                    label: "Grade 8",
                  },
                ]}
              />
            </div>
          </div>
          <div className="CourseOfferForm">
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
                  <strong>
                    {searchKey
                      ? `${searchKey} Courses Group`
                      : "Search Grade To Offer Courses To!"}
                  </strong>
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
                  <Col>{selectedToOffer}</Col>
                </Checkbox.Group>
              </Form.Item>
              <div className="CourseSaveButton">
                <Form.Item shouldUpdate>
                  {() => (
                    <Button
                      style={{ minWidth: 100, marginTop: 5 }}
                      type="primary"
                      htmlType="submit">
                      Offer
                    </Button>
                  )}
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className="CourseOfferTable">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 19,
              }}>
              <span
                style={{
                  marginLeft: 8,
                }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </span>
            </div>

            <Form form={form} component={false}>
              <Table
                bordered
                rowSelection={rowSelection}
                dataSource={filteredData}
                columns={columns}
                rowClassName="editable-row"
                pagination={true}
              />
            </Form>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default CourseOffer;
