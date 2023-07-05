import { Drawer, Table, Typography } from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const drawerColumn = [
  {
    title: "Admission Number",
    dataIndex: "admissionNumber",
  },
  {
    title: "Student Name",
    dataIndex: "studentName",
  },
  {
    title: "Class",
    dataIndex: "class",
  },
  {
    title: "Father Name",
    dataIndex: "fatherName",
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Mobile Numner",
    dataIndex: "mobileNumber",
  },
];
let drawerData = [];
const ClassAndSectionReport = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [drawerTableData, setDrawerTableData] = useState([]);
  useEffect(() => {
    const getClasses = async () => {
      try {
        const studentResponse = await fetch(
          "http://localhost:8080/admission/studentsList"
        );
        const studentResponseData = await studentResponse.json();
        if (studentResponseData.code === 404) {
          throw new Error("No students found");
        }
        const studentData = studentResponseData.students;
        const classResponse = await fetch(
          "http://localhost:8080/class/classList"
        );
        const classResponseData = await classResponse.json();
        const classData = classResponseData.classes;
        const data = [];
        for (let i = 0; i < classData.length; i++) {
          for (let j = 0; j < classData[i].section.length; j++) {
            let studentCount = 0;
            for (let k = 0; k < studentData.length; k++) {
              if (
                studentData[k].grade === classData[i].grade &&
                studentData[k].section === classData[i].section[j]
              ) {
                studentCount++;
              }
            }
            data.push({
              key: Math.random(),
              roomNumber: "2353",
              class: `${classData[i].grade}(${classData[i].section[j]})`,
              students: studentCount,
            });
          }
        }
        setTableData(data);
        const dData = studentData.map((data) => {
          return {
            key: Math.random(),
            admissionNumber: data.admissionNumber,
            studentName: `${data.firstName} ${data.lastName}`,
            class: `${data.grade}(${data.section})`,
            fatherName: `${data.parentFirstName} ${data.parentLastName}`,
            dob: data.birthDate.slice(0, 10),
            gender: data.gender,
            mobileNumber: data.parentPhoneNumber,
            section: data.section,
          };
        });
        drawerData = dData;
        // setOriginalData(responseData.classes);
        // const data = originalData.map((data) => {
        //   return {
        //     key: data.admissionNumber,
        //     studentName: `${data.firstName} ${data.lastName}`,
        //     studentId: data.admissionNumber,
        //     grade: data.grade,
        //     section: data.section,
        //     dob: data.birthDate.slice(0, 10),
        //     parentName: `${data.parentFirstName} ${data.parentLastName}`,
        //     mobileNumber: data.parentPhoneNumber,
        //     address: `${data.province}, ${data.street}, ${data.houseNumber}`,
        //   };
        // });
        // for (let i = 0; i < classResponseData.classes.length; i++) {
        //   let sections = [];
        //   for (
        //     let j = 0;
        //     j < classResponseData.classes[i].section.length;
        //     j++
        //   ) {
        //     sections.push(
        //       <p key={Math.random()}>
        //         {classResponseData.classes[i].section[j]}
        //       </p>
        //     );
        //   }
        //   classdata.push({
        //     key: classResponseData.classes[i].id,
        //     grade: classResponseData.classes[i].grade,
        //     section: <>{sections}</>,
        //   });
        // }
        // classData = classdata.map((data) => data);
        // setFilteredData([...originData]);
      } catch (err) {
        // setSearchIsLoading(false);
        // error("Check for your internet connection and try again");
        return;
      }
    };
    getClasses();
  }, []);
  const showDrawer = (record) => {
    const grade = record.class.slice(0, 7);
    const section = record.class.slice(8, 9);
    const data = drawerData.filter((data) => {
      return data.class === grade && data.section === section;
    });
    setDrawerTableData([...data]);
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const columns = [
    {
      title: "Room Number",
      dataIndex: "roomNumber",
    },
    {
      title: "Class",
      dataIndex: "class",
    },
    {
      title: "Students",
      dataIndex: "students",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "4%",
      render: (_, record) => {
        return record.students === 0 ? (
          <Typography.Link disabled={true}>
            <EyeInvisibleOutlined />
          </Typography.Link>
        ) : (
          <Typography.Link
            onClick={() => {
              showDrawer(record);
            }}>
            <EyeOutlined />
          </Typography.Link>
        );
      },
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          textAlign: "left",
          marginBottom: 10,
          justifyContent: "space-between",
          marginTop: 0,
          width: "100%",
        }}>
        <Title style={{ marginTop: 0 }} level={4}>
          Class And Section Report
        </Title>
        {/* <div>
          <Search
            enterButton
            placeholder="input search text"
            onSearch={onSearch}
            style={{
              width: 230,
            }}
          />
        </div> */}
      </div>
      <Table size="small" dataSource={tableData} columns={columns} />
      <Drawer
        title="Student List"
        placement="right"
        onClose={onClose}
        width="90%"
        open={openDrawer}>
        <Table dataSource={drawerData} columns={drawerColumn} size="small" />
      </Drawer>
    </div>
  );
};

export default ClassAndSectionReport;
