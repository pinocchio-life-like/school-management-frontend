import {
  Button,
  Form,
  Image,
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
import "./AdmitForYear.css";
// const Year = new Date();
// const CalenderYear = Year.getFullYear();
let originData = [];

const AdmitForYear = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xScroll, setXScroll] = useState("fixed");
  const [editingKey, setEditingKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

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
        const originalData = responseData.students;
        console.log(responseData.students);
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
            admissionStatus: `${data.admissionStatus}`,
          };
        });
        originData = data;
        // setTableData(data);
      } catch (err) {
        // setSearchIsLoading(false);
        error("Check for your internet connection and try again");
        return;
      }
    };
    getStudents();
  }, []);

  //error message
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  //error message
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  //on single admit
  const onSingleAdmit = async (record) => {
    try {
      const date = new Date();
      let year = date.getFullYear();
      year = `${year}`;
      await fetch("http://localhost:8080/calender/individual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admissionNumber: record.key,
          year: year,
          grade: record.grade,
        }),
      });
      let index;
      for (let i = 0; i < originData.length; i++) {
        if (originData[i].studentId === record.key) {
          index = i;
        }
      }
      originData.splice(index, 1, {
        key: record.key,
        studentName: `${record.studentName}`,
        studentId: record.key,
        grade: record.grade,
        section: record.section,
        dob: record.dob,
        parentName: `${record.parentName}`,
        mobileNumber: record.mobileNumber,
        address: `${record.address}`,
        studentImage:
          "https://photos.psychologytoday.com/6f3c2e5c-deeb-4e31-ad7a-47d4df3a2c2e/2/320x400.jpeg",
        admissionStatus: `admitted`,
      });
      success("Admitted Successfully");
      setTableData([...originData]);
    } catch (err) {
      error("Couldnt admit, check your Internet");
    }
  };
  const onExpelHandler = async (record) => {
    try {
      const date = new Date();
      let year = date.getFullYear();
      year = `${year}`;
      await fetch("http://localhost:8080/calender/expel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admissionNumber: record.key,
          year: year,
          grade: record.grade,
        }),
      });
      let index;
      for (let i = 0; i < originData.length; i++) {
        if (originData[i].studentId === record.key) {
          index = i;
        }
      }
      originData.splice(index, 1, {
        key: record.key,
        studentName: `${record.studentName}`,
        studentId: record.key,
        grade: record.grade,
        section: record.section,
        dob: record.dob,
        parentName: `${record.parentName}`,
        mobileNumber: record.mobileNumber,
        address: `${record.address}`,
        studentImage:
          "https://photos.psychologytoday.com/6f3c2e5c-deeb-4e31-ad7a-47d4df3a2c2e/2/320x400.jpeg",
        admissionStatus: `not admitted`,
      });
      success("Expelled Successfully");
      setTableData([...originData]);
    } catch (err) {
      error("Couldnt admit, check your Internet");
    }
  };
  //columns
  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      width: 200,
      render: (_, record) => {
        // console.log(record);
        return (
          <div>
            <Image
              style={{ borderRadius: 10, padding: 2 }}
              alt="hello"
              width={35}
              height={35}
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
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: 100,
    },
    {
      title: "Section",
      dataIndex: "section",
      width: 100,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      width: 110,
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      width: 140,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      width: 140,
    },
    {
      title: "address",
      dataIndex: "address",
      width: 250,
    },
    {
      width: 80,
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return record.admissionStatus === "admitted" ? (
          <Space size="middle">
            <Typography.Link>
              <Popconfirm
                title="Sure want to Expel?"
                onConfirm={() => {
                  onExpelHandler(record);
                }}>
                <a>expel</a>
              </Popconfirm>
            </Typography.Link>
          </Space>
        ) : (
          <Space size="middle">
            <Typography.Link>
              <Popconfirm
                title="Sure want to Admit?"
                onConfirm={() => {
                  onSingleAdmit(record);
                }}>
                <a>admit</a>
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  if (xScroll === "fixed") {
    columns[0].fixed = true;
    columns[columns.length - 1].fixed = "right";
  }
  const scroll = {};
  scroll.x = "100vw";

  const tableProps = {
    loading,
    scroll,
  };
  const onSelectSearch = (value) => {
    setSearchKey(value);
    const data = originData.filter((filtered) => {
      return filtered.grade === value;
    });
    setTableData([...data]);
  };
  const onSectionSelect = (value) => {
    if (searchKey) {
      const data = originData.filter((filtered) => {
        return filtered.grade === searchKey && filtered.section === value;
      });
      setTableData([...data]);
    } else {
      error("Select Grade first to search section");
    }
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
            <Select
              onSelect={onSelectSearch}
              showSearch
              style={{
                width: 270,
                marginLeft: "10%",
              }}
              placeholder="Select Grade"
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
            <Select
              onSelect={onSectionSelect}
              showSearch
              style={{
                width: 270,
                marginLeft: 5,
              }}
              placeholder="Select Section"
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
                  value: "A",
                  label: "A",
                },
                {
                  value: "B",
                  label: "B",
                },
                {
                  value: "C",
                  label: "C",
                },
                {
                  value: "D",
                  label: "D",
                },
              ]}
            />
            <Search
              style={{ width: 270, marginLeft: 5, marginRight: 5 }}
              placeholder="Or Input student ID"
              //   onSearch={onSearch}
              //   onChange={onSearchChange}
            />
          </div>
        </div>
        <div className="StudentListTableContainer">
          <Form form={form} component={false}>
            <Table
              style={{ zIndex: -100, marginTop: 10 }}
              {...tableProps}
              bordered={false}
              // rowSelection={rowSelection}
              dataSource={tableData}
              columns={columns}
              rowClassName="editable-row"
              pagination={true}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdmitForYear;
