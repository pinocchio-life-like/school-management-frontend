import { Button, Form, Select, Table, Typography } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
const { Option } = Select;
const { Text } = Typography;
const originData = [
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 1",
    classNext: "Class 2",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 1",
    classNext: "Class 2",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 2",
    classNext: "Class 3",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 2",
    classNext: "Class 3",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2022-09-02",
    classStart: "Class 3",
    classNext: "Class 4",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 3",
    classNext: "Class 3",
    status: "Failed",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 4",
    classNext: "Class 5",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2022-09-02",
    classStart: "Class 4",
    classNext: "Class 5",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 5",
    classNext: "Class 6",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2021-09-02",
    classStart: "Class 5",
    classNext: "Class 5",
    status: "Failed",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
  {
    key: Math.random(),
    admissionNumber: "76543",
    studentName: "Olivier Giroud",
    gender: "Male",
    admissionDate: "2022-09-02",
    classStart: "Class 6",
    classNext: "Class 5",
    status: "Promoted",
    guardianName: "Giroud Shaquil",
    guardianPhone: "+987653456",
  },
];
const columns = [
  {
    title: "Admission Number",
    dataIndex: "admissionNumber",
  },
  {
    title: "Student Name",
    dataIndex: "studentName",
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "Admission Date",
    dataIndex: "admissionDate",
  },
  {
    title: "Class Start",
    dataIndex: "classStart",
  },
  {
    title: "Next Class",
    dataIndex: "classNext",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Guardian Name",
    dataIndex: "guardianName",
  },
  {
    title: "Guardian Phone",
    dataIndex: "guardianPhone",
  },
];
const StudentHistory = () => {
  const [searchForm] = Form.useForm();
  const [filteredData, setFilteredData] = useState([]);
  const onFinish = (values) => {
    const data = originData.filter((data) => {
      let date = new Date(data.admissionDate);
      date = date.getFullYear();
      return (
        values.admissionDate === `${date}` && values.class === data.classStart
      );
    });
    setFilteredData([...data]);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Title level={4} style={{ textAlign: "left", marginTop: 0 }}>
            Student History
          </Title>
        </div>
        <Form
          form={searchForm}
          onFinish={onFinish}
          style={{ display: "flex", textAlign: "left" }}>
          <Form.Item noStyle name="class">
            <Select placeholder="Class" style={{ width: 220 }}>
              <Option value="Class 1">Class 1</Option>
              <Option value="Class 2">Class 2</Option>
              <Option value="Class 3">Class 3</Option>
              <Option value="Class 4">Class 4</Option>
              <Option value="Class 5">Class 5</Option>
              <Option value="Class 6">Class 6</Option>
              <Option value="Class 7">Class 7</Option>
              <Option value="Class 8">Class 8</Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle name="admissionDate">
            <Select
              placeholder="Admission Year"
              style={{ width: 220, marginLeft: 10 }}>
              <Option value="2021">2021</Option>
              <Option value="2022">2022</Option>
              <Option value="2023">2023</Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle>
            <Button style={{ marginLeft: 10 }} type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginTop: 15 }}>
        <Table
          size="small"
          dataSource={filteredData}
          columns={columns}
          summary={(tableData) => {
            let total = 0,
              male = 0,
              female = 0,
              promoted = 0,
              failed = 0;
            tableData.forEach((data) => {
              if (data.gender === "Male") {
                male++;
              } else if (data.gender === "Female") {
                female++;
              }
              if (data.status === "Promoted") {
                promoted++;
              } else if (data.status === "Failed") {
                failed++;
              }
            });
            total = female + male;
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    <Text type="danger">Total: {total}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">Male: {male}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">Female: {female}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">Promoted: {promoted}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">Failed: {failed}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default StudentHistory;
