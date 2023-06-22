import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

let data = [
  {
    name: "Jan",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Feb",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Mar",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Apr",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "May",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Jun",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Jul",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Aug",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Sep",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Oct",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Nov",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
  {
    name: "Dec",
    Pending: 0,
    Closed: 0,
    Rejected: 0,
  },
];

function JobBarChart(props) {
  data = props.data;
  return (
    <BarChart
      width={900}
      height={300}
      data={data}
      margin={{
        top: 40,
        // right: 10,
        // left: -20,
        bottom: 0,
      }}>
      <CartesianGrid strokeDasharray="0 1" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="Closed" fill="#5DADE2" />
      <Bar yAxisId="right" dataKey="Pending" fill="#82E0AA" />
      <Bar yAxisId="right" dataKey="Rejected" fill="#FF6B6B" />
    </BarChart>
  );
}

export default JobBarChart;
