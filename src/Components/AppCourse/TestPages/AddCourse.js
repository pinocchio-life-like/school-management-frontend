import { Card, List, Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;
const data = [
  {
    rowSpan: 2,
    key: "1",
    firstName: "John",
    lastName: "Brown",
    grade: (
      <>
        <ul>
          <li>Grade 7</li>
          <ul>
            <li>Mathemathics A B C</li>
            <li>English A C</li>
          </ul>
          <li>Grade 8</li>
          <ul>
            <li>Mathemathics A</li>
            <li>English A C</li>
          </ul>
        </ul>
      </>
    ),
    teacherName: "Alemu Taddese",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    firstName: "Jim",
    lastName: "Green",
    grade: 42,
    teacherName: "Abraham Worku",
    tags: ["loser"],
  },
  {
    key: "3",
    firstName: "Joe",
    lastName: "Black",
    grade: 32,
    teacherName: "Kiflu Abera",
    tags: ["cool", "teacher"],
  },
];
const AddCourse = () => (
  <Table bordered dataSource={data}>
    <Column title="Teacher Name" dataIndex="teacherName" key="address" />
    <Column title="Teacher ID" dataIndex="age" key="firstName" />
    <Column
      title="Grade, Course And Section"
      dataIndex="grade"
      key="firstName"></Column>

    <Column
      title="Action"
      key="action"
      render={(_, record) => (
        <Space size="middle">
          <a>Invite {record.lastName}</a>
          <a>Delete</a>
        </Space>
      )}
    />
  </Table>
);
export default AddCourse;
