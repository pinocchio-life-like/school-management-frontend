import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {
  Button,
  Space,
  Table,
  Form,
  Select,
  Typography,
  Popconfirm,
  message,
  Checkbox,
  Col,
  Row,
  Spin,
} from "antd";
import Title from "antd/es/typography/Title";
// import { EditFilled, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./ClassList.css";

const { Option } = Select;

let originData = [];

// Editable Cell

const ClassList = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  // const [editForm] = Form.useForm();
  // const [editingKey, setEditingKey] = useState("");
  // const [isEditing, setIsEditing] = useState(false);
  // const [recordBeingEdited, setRecordBeingEdited] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [filteredData, setFilteredData] = useState();
  const [onloading, setOnloading] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const getClasses = async () => {
      const response = await fetch("http://localhost:8080/class/classList");
      const responseData = await response.json();
      setOriginalData(responseData.classes);
      const data = [];
      for (let i = 0; i < responseData.classes.length; i++) {
        let sections = [];
        for (let j = 0; j < responseData.classes[i].section.length; j++) {
          sections.push(
            <p key={Math.random()}>{responseData.classes[i].section[j]}</p>
          );
        }
        data.push({
          key: responseData.classes[i].id,
          grade: responseData.classes[i].grade,
          section: <>{sections}</>,
        });
      }
      originData = data.map((data) => data);
      setFilteredData([...originData]);
    };
    getClasses();
  }, []);
  // edit start start
  // const edit = (record) => {
  //   for (let i = 0; i < originalData.length; i++) {
  //     if (originalData[i].id === record.key) {
  //       setRecordBeingEdited(originalData[i]);
  //     }
  //   }
  //   console.log(isEditing);
  //   setEditingKey(record.key);
  // };
  //edit start end

  //cancel edit
  // cancel edit || assign end
  //Save Edit start

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
  const deleteCourse = async (record) => {
    setOnloading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/class/classList/${record.key}`,
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
      setFilteredData([...originData]);
      setOnloading(false);
    } catch (err) {
      setOnloading(false);
      error("Check your Internet and try again");
    }
  };
  //table columns data

  const columns = [
    {
      title: "Class Name",
      dataIndex: "grade",
      width: "42%",
    },
    {
      title: "Sections",
      dataIndex: "section",
      width: "42%",
    },
    {
      width: "10%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* <Typography.Link
              // disabled={editingKey !== ""}
              onClick={() => {
                setIsEditing(true);
                edit(record);
              }}>
              Edit
            </Typography.Link> */}
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

  //columns merge start

  const onFinish = async (values) => {
    setOnloading(true);
    try {
      const response = await fetch("http://localhost:8080/class/classList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Check internet Connection");
      }
      success("Course Successfully Registered");
      let sections = [];
      for (let i = 0; i < responseData.classes.section.length; i++) {
        sections.push(
          <p key={Math.random()}>{responseData.classes.section[i]}</p>
        );
      }
      for (let i = 0; i < originData.length; i++) {
        if (originData[i].grade === responseData.classes.grade) {
          addForm.resetFields();
          setOnloading(false);
          return;
        }
      }
      originData.push({
        key: responseData.classes.id,
        grade: responseData.classes.grade,
        section: <>{sections}</>,
      });
      setFilteredData([...originData]);
      addForm.resetFields();
      setOnloading(false);
    } catch (err) {
      setOnloading(false);
      error("Check Your internet connection and try again");
      addForm.resetFields();
    }
  };

  return (
    <div>
      <Spin spinning={onloading}>
        <div className="CourseListCSS classImadeForTeacher">
          {contextHolder}
          <div className="CourseAddContainer">
            <div className="CourseAddTitle">
              <Title
                level={3}
                style={{ textAlign: "left", marginBottom: 10, marginTop: -10 }}>
                Add Class
              </Title>
            </div>
            <Form
              style={{ justifyContent: "left", marginTop: 0 }}
              form={addForm}
              name="horizontal_login"
              layout="vertical"
              onFinish={onFinish}>
              <Form.Item
                name="grade"
                label="Class Name"
                style={{ minWidth: 320, textAlign: "left", marginTop: 0 }}
                rules={[
                  {
                    required: true,
                    message: "Please select grade!",
                  },
                ]}>
                <Select style={{ marginTop: -25 }} placeholder="Select Grade">
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
                label="Section"
                style={{ minWidth: 250, textAlign: "left", marginTop: -20 }}
                name="section"
                rules={[
                  {
                    required: true,
                    message: "Please select grade!",
                  },
                ]}>
                <Checkbox.Group>
                  <Col>
                    <Row>
                      <Checkbox value="A">A</Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="B">B</Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="C">C</Checkbox>
                    </Row>
                    <Row>
                      <Checkbox value="D">D</Checkbox>
                    </Row>
                  </Col>
                </Checkbox.Group>
              </Form.Item>
              <div className="coursesIdaveButton">
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
              <Title
                level={3}
                style={{ textAlign: "left", marginBottom: 10, marginTop: -10 }}>
                Class List
              </Title>
            </div>
            <div className="CourseListTable">
              <div>
                <Form form={form} component={false}>
                  <Table
                    style={{ marginTop: 25 }}
                    bordered
                    dataSource={filteredData}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                  />
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};
export default ClassList;
