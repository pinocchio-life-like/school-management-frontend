import {
  Button,
  Form,
  Select,
  Space,
  Popconfirm,
  Table,
  message,
  Row,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
const { Option } = Select;

let originData = [];
let teacherData = [];

const AttendingTeacher = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [tableData, setTableData] = useState(originData);
  const [options, setOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getAttenders = async () => {
      const response = await fetch(
        "http://localhost:8080/teacher/getAttending"
      );
      const responseData = await response.json();
      originData = responseData.attenders;

      const teachResponse = await fetch(
        "http://localhost:8080/teacher/teacherList"
      );
      const teachResponseData = await teachResponse.json();
      teacherData = teachResponseData.teachers;

      setTableData([...originData]);
    };
    getAttenders();
  }, []);
  const onFinish = async (values) => {
    const { grade, teacherId } = values;
    const data = teacherData.find((teacher) => teacher.teacherId === teacherId);

    const toSend = {
      grade: grade,
      teacherId: teacherId,
      teacherName: data.teacherName,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/teacher/setAttending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSend),
        }
      );
      const responseData = await response.json();

      if (responseData.code === 404) {
        error(responseData.message);
        throw new Error("error");
      }
      success("Attender Successfully Added");
    } catch (error) {}
  };

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

  //delete Student
  const deleteTeacher = async (record) => {
    try {
      const response = await fetch(
        `http://localhost:8080/teacher/deleteAttender/${record.teacherId}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Couldnt delete, check your internet");
      }
      const indexValue = tableData.indexOf(record);
      tableData.splice(indexValue, 1);
      setTableData([...tableData]);
      success("Deleted Successfully");
    } catch (error) {
      error("Check Your internet connection and try again");
    }
  };
  const columns = [
    {
      title: "Grade",
      dataIndex: "grade",
    },
    {
      title: "Teacher Name",
      dataIndex: "teacherName",
    },
    {
      title: "Teacher ID",
      dataIndex: "teacherId",
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "7%",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Sure want to delete?"
              onConfirm={() => {
                deleteTeacher(record);
              }}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const onGradeChange = (value) => {
    let data = [];
    for (let i = 0; i < teacherData.length; i++) {
      for (let j = 0; j < teacherData[i].grade.length; j++) {
        if (teacherData[i].grade[j] === value) {
          data.push(teacherData[i]);
        }
      }
    }
    setOptions([...data]);
  };

  return (
    <div>
      {contextHolder}
      <div className="FeesGroupCSS">
        <div className="FeesGroupTitle">
          <Title
            level={3}
            style={{
              marginLeft: 5,
              textAlign: "left",
              marginTop: 5,
              marginBottom: 10,
            }}>
            Assign Attending Teacher
          </Title>
        </div>
        <div className="FeesGroupForm">
          <Form form={addForm} onFinish={onFinish}>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="grade"
                style={{ minWidth: 400, textAlign: "left" }}>
                <Select placeholder="Select Grade" onChange={onGradeChange}>
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
                name="teacherId"
                style={{ minWidth: 400, marginLeft: 20, textAlign: "left" }}>
                <Select placeholder="Select Teacher">
                  {options.map((data) => {
                    return (
                      <Option key={Math.random()} value={data.teacherId}>
                        {data.teacherId}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item style={{ minWidth: 400, marginLeft: 20 }}>
                <Button
                  style={{ minWidth: 400 }}
                  type="primary"
                  htmlType="submit">
                  Assign
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </div>
        <div className="FeesGroupList">
          <div className="FeesGroupTable">
            <Form form={form} component={false}>
              <Table
                size="small"
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
                pagination={false}
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendingTeacher;
