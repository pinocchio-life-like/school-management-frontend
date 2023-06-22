import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CollectFees.css";
const { Option } = Select;

let originData = [];
const CollectFees = () => {
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/admission/studentsList"
        );
        const responseData = await response.json();
        if (responseData.code === 404) {
          throw new Error("No students found");
        }

        originData = responseData.students.map((data) => {
          return {
            key: data.admissionNumber,
            grade: data.grade,
            section: data.section,
            admissionNumber: data.admissionNumber,
            studentName: `${data.firstName} ${data.lastName}`,
            fatherName: `${data.parentFirstName} ${data.parentLastName}`,
            phone: data.parentPhoneNumber,
            dob: data.birthDate.slice(0, 10),
          };
        });
      } catch (err) {
        error("Check your Internet Connection please!");
      }
    };
    getStudents();
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
  const onFinish = (values) => {
    const data = originData.filter((filter) => {
      return filter.grade === values.grade && filter.section === values.section;
    });
    setTableData([...data]);
  };
  const columns = [
    {
      title: "Grade",
      dataIndex: "grade",
      width: "10%",
    },
    {
      title: "Section",
      dataIndex: "section",
      width: "10%",
    },
    {
      title: "Admission Number",
      dataIndex: "admissionNumber",
      width: "12%",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      width: "14%",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      width: "14%",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dob",
      width: "14%",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "14%",
    },
    {
      width: "10%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Typography.Link
              onClick={async () => {
                localStorage.setItem("payingStudent", record.key);
                try {
                  await fetch(
                    `http://localhost:8080/fee/feeList/add/${record.key}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify([]),
                    }
                  );
                } catch (err) {
                  error("Check Your Internet Connection And Try Again");
                  return;
                }
              }}>
              <Link to="/addFee">Collect Fess</Link>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      {contextHolder}
      <div className="CollectFeesPageCss">
        <div className="CollectFeesTitle">
          <Title
            level={4}
            style={{
              marginLeft: 5,
              textAlign: "left",
              marginTop: 5,
              marginBottom: 10,
            }}>
            Select Search Criteria
          </Title>
        </div>
        <div className="ClassAndSectionSearch">
          <Form form={form} onFinish={onFinish}>
            <div style={{ display: "flex", textAlign: "left" }}>
              <Form.Item name="grade" style={{ width: "50%" }}>
                <Select placeholder="Select Grade">
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
                name="section"
                style={{ width: "50%", marginLeft: 10 }}>
                <Select placeholder="Select Section">
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginLeft: 10 }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="SearchByKeyword">
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: 5,
              marginTop: 0,
            }}>
            <Search
              style={{
                marginLeft: "10%",
                marginRight: 0,
              }}
              placeholder="input search text"
              onSearch={(value) => {
                console.log(value);
              }}
              // onChange={onSearchChange}
              // onChange=
              enterButton
            />
          </div>
        </div>
        <div className="SearchedStudentsList">
          <div className="SearchedStudentsListTitle">
            <Title
              level={3}
              style={{
                marginLeft: 5,
                textAlign: "left",
                marginTop: 5,
                marginBottom: 10,
              }}>
              Students List
            </Title>
          </div>
          <div className="SearchedStudentsListTable">
            <Form form={tableForm} component={false}>
              <Table
                size="small"
                //   bordered
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
                pagination={
                  {
                    //   onChange: deleteFee,
                  }
                }
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectFees;
