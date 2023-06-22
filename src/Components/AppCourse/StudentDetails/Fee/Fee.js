import { Table, Tag } from "antd";
import React from "react";
const columns = [
  {
    title: "Fees Code",
    dataIndex: "fecode",
    width: 200,
  },
  {
    title: "Due Date",
    dataIndex: "duedate",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "tags",
    width: 120,
    render: (value, record) => {
      if (value === "Not Paid") {
        return (
          <>
            <Tag color="red">Not Paid</Tag>
          </>
        );
      } else {
        return <Tag color="green">Paid</Tag>;
      }
    },
    // render: (_, { tags }) => (
    //      <>
    //        {tags.map((tag) => {
    //          let color = tag.length > 5 ? 'geekblue' : 'green';
    //          if (tag === 'loser') {
    //            color = 'volcano';
    //          }
    //          return (
    //            <Tag color={color} key={tag}>
    //              {tag.toUpperCase()}
    //            </Tag>
    //          );
    //        })}
    //      </>
    //    ),
  },
  {
    title: "Paid",
    dataIndex: "paid",
    width: 120,
  },
  {
    title: "Balance",
    dataIndex: "balance",

    width: 120,
  },
];
const data = [
  {
    fecode: "admission-fees",
    duedate: "04/01/2022 ",
    status: "paid",

    paid: "150",
    balance: "4000",
  },
  {
    fecode: "may-month-fees",
    duedate: "04/01/2022 ",
    status: "Not Paid",
    paid: "150",
    balance: "4000",
  },
  {
    fecode: "jun-month-fees",
    duedate: "04/01/2022 ",
    status: "Not Paid",
    paid: "150",
    balance: "4000",
  },
  {
    fecode: "jul-month-fees",
    duedate: "04/01/2022 ",
    status: "Not Paid",
    paid: "150",
    balance: "4000",
  },
  {
    fecode: "admission-fees",
    duedate: "04/01/2022 ",
    status: "paid",

    paid: "150",
    balance: "4000",
  },
  {
    fecode: "may-month-fees",
    duedate: "04/01/2022 ",
    status: "Not Paid",
    paid: "150",
    balance: "4000",
  },
  {
    fecode: "admission-fees",
    duedate: "04/01/2022 ",
    status: "paid",

    paid: "150",
    balance: "4000",
  },
  {
    fecode: "may-month-fees",
    duedate: "04/01/2022 ",
    status: "Not Paid",
    paid: "150",
    balance: "4000",
  },
];
const Fee = () => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          y: 500,
          // x: '100vw',
        }}
        pagination
      />
    </div>
  );
};

export default Fee;
