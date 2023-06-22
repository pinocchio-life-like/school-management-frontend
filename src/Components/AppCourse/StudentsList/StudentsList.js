import {
  Button,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentsList.css";
const { Option } = Select;


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {dataIndex === "grade" ? (
            <Select disabled placeholder="Cannot Edit">
              <Option value="Grade 1">Grade 1</Option>
              <Option value="Grade 2">Grade 2</Option>
              <Option value="Grade 3">Grade 3</Option>
            </Select>
          ) : dataIndex === "status" ? (
            <Input readOnly />
          ) : dataIndex === "coursesId" ? (
            <Select placeholder="Cannot Edit" disabled />
          ) : (
            <Input />
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const StudentsList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [studentsList, setStudentsList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xScroll, setXScroll] = useState("fixed");
  const [editingKey, setEditingKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const isEditing = (record) => record.key === editingKey;
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  //fetch students data
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
        setStudentsList(responseData.students);
        const originalData = responseData.students;
        const data = originalData.map((data) => {
          return {
            key: data.admissionNumber,
            studentName: `${data.firstName} ${data.lastName}`,
            studentId: data.admissionNumber,
            grade: data.grade,
            section: data.section,
            dob: data.birthDate.slice(0, 10),
            parentName: `${data.parentFirstName} ${data.parentLastName}`,
            mobileNumber: data.parentPhoneNumber,
            address: `${data.province}, ${data.street}, ${data.houseNumber}`,
            studentImage:
              "https://photos.psychologytoday.com/6f3c2e5c-deeb-4e31-ad7a-47d4df3a2c2e/2/320x400.jpeg",
          };
        });
        setTableData(data);
        console.log(responseData.students);
      } catch (err) {
        // setSearchIsLoading(false);
        error("Check for your internet connection and try again");
        return;
      }
    };
    getStudents();
  }, []);
  //Edit Student Start
  const edit = (record) => {
    form.setFieldsValue({
      courseName: "",
      grade: "",
      courseId: "",
      teacher: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  //error message
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  //Save Edit Record
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  //delete Student
  const deleteStudent = (record) => {
    const indexValue = tableData.indexOf(record);
    tableData.splice(indexValue, 1);
    setTableData([...tableData]);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
  //columns
  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      width: 200,
      editable: true,
      Assignable: true,
      render: (_, record) => {
        // console.log(record);
        return (
          <div>
            <Image
              style={{ borderRadius: 10, padding: 5 }}
              alt="hello"
              width={45}
              height={45}
              src={record.studentImage}
            />
            <span style={{ marginLeft: 10 }}>{record.studentName}</span>
          </div>
        );
      },
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      width: 130,
      editable: true,
      Assignable: true,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: 100,
      editable: true,
      Assignable: true,
    },
    {
      title: "Section",
      dataIndex: "section",
      width: 100,
      editable: true,
      Assignable: true,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      width: 110,
      editable: true,
      Assignable: true,
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      width: 140,
      editable: true,
      Assignable: true,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      width: 140,
      editable: true,
      Assignable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: 250,
      editable: true,
      Assignable: true,
    },
    // {
    //   title: "Teacher",
    //   dataIndex: "teacher",
    //   width: "30%",
    //   editable: true,
    //   Assignable: true,
    // },
    {
      width: 120,
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure want to delete?"
              onConfirm={() => {
                deleteStudent(record);
              }}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const hasSelected = selectedRowKeys.length > 0;
  //merged columns
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
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  if (xScroll === "fixed") {
    mergedColumns[0].fixed = true;
    mergedColumns[mergedColumns.length - 1].fixed = "right";
  }
  const scroll = {};
  scroll.x = "100vw";

  const tableProps = {
    loading,
    scroll,
  };
  //cancel edit
  const cancel = () => {
    setEditingKey("");
  };
  return (
    <div>
      {contextHolder}
      <div className="StudentsListConatiner">
        <div className="StudentListTitle">
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
        <div className="StudentListSearch">
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: 5,
              marginTop: 8,
            }}>
            <Search
              style={{
                // border: "1px solid blue",
                // borderRadius: 8,
                marginLeft: "30%",
                marginRight: 5,
              }}
              placeholder="input search text"
              // onSearch={onSearch}
              // onChange={onSearchChange}
              // onChange=
              enterButton
            />
          </div>
        </div>
        <div className="ActionsTab">
          <div
            style={{
              display: "flex-end",
              textAlign: "right",
              marginBottom: 5,
              marginTop: 20,
              marginRight: 5,
            }}>
            <Button
              onClick={() => {
                navigate("/studentRegistration");
              }}
              type="primary"
              style={{ marginLeft: 5 }}>
              Register New Student
            </Button>
          </div>
        </div>
        <div className="ReloadAndSelectCount">
          <div
            style={{
              display: "flex",
              textAlign: "left",
              marginBottom: 5,
              marginTop: 20,
            }}>
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}>
              Reload
            </Button>
            <span
              style={{
                marginLeft: 8,
                marginTop: 6,
              }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div>
        </div>
        <div className="StudentListTableContainer">
          <Form form={form} component={false}>
            <Table
              style={{ zIndex: -100 }}
              {...tableProps}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered={false}
              rowSelection={rowSelection}
              dataSource={tableData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={true}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
