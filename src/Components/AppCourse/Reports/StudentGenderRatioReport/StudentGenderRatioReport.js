import { Table, Typography } from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React from "react";
const { Text } = Typography;
const originData = [
  {
    key: Math.random(),
    class: "Class 1 (A)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 2 (A)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 3 (A)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 4 (A)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 5 (A)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 1 (B)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 2 (B)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 3 (B)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 4 (B)",
    totalBoys: 13,
    totalGirls: 12,
  },
  {
    key: Math.random(),
    class: "Class 5 (B)",
    totalBoys: 13,
    totalGirls: 12,
  },
];
const columns = [
  {
    title: "Class (Section)",
    dataIndex: "class",
  },
  {
    title: "Total Boys",
    dataIndex: "totalBoys",
  },
  {
    title: "Total Girls",
    dataIndex: "totalGirls",
  },
  {
    title: "Total Students",
    dataIndex: "totalStudents",
    render: (_, record) => {
      let total = record.totalBoys + record.totalGirls;
      return total;
    },
  },
  {
    title: "Boy : Girl",
    dataIndex: "boyGirlRatio",
    width: "8%",
    render: (_, record) => {
      let ratio = record.totalGirls / record.totalBoys;
      return `1:${ratio}`.slice(0, 6);
    },
  },
];
const StudentGenderRatioReport = () => {
  return (
    <div>
      <div
        style={{
          textAlign: "left",
          marginBottom: 10,
          marginTop: 0,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Title style={{ marginTop: 0 }} level={4}>
          Class And Section Report
        </Title>
        <div>
          <Search
            enterButton
            placeholder="input search text"
            // onSearch={onSearch}
            style={{
              width: 230,
            }}
          />
        </div>
      </div>
      <Table
        dataSource={originData}
        columns={columns}
        summary={(tableData) => {
          let total = 0;
          let male = 0;
          let female = 0;
          tableData.forEach((data) => {
            male += data.totalBoys;
            female += data.totalGirls;
          });
          total = female + male;
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <Text type="danger"></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text type="danger">Male: {male}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text type="danger">Female: {female}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text type="danger">Total: {total}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
};

export default StudentGenderRatioReport;
