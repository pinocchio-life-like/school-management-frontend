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

const data = [
  {
    name: "Jan",
    Teachers: 40,
    Drivers: 24,
    Admins: 24,
  },
  {
    name: "Feb",
    Teachers: 30,
    Drivers: 18,
    Admins: 22,
  },
  {
    name: "Mar",
    Teachers: 20,
    Drivers: 98,
    Admins: 22,
  },
  {
    name: "Apr",
    Teachers: 27,
    Drivers: 38,
    Admins: 20,
  },
  {
    name: "May",
    Teachers: 10,
    Drivers: 48,
    Admins: 21,
  },
  {
    name: "Jun",
    Teachers: 90,
    Drivers: 38,
    Admins: 25,
  },
  {
    name: "Jul",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
  {
    name: "Aug",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
  {
    name: "Sep",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
  {
    name: "Oct",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
  {
    name: "Nov",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
  {
    name: "Dec",
    Teachers: 30,
    Drivers: 43,
    Admins: 21,
  },
];

function PayrollReportBar() {
  return (
    <BarChart
      width={900}
      height={280}
      data={data}
      margin={{
        top: 20,
        bottom: 0,
      }}>
      <CartesianGrid strokeDasharray="0 1" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="Drivers" fill="#5DADE2" />
      <Bar yAxisId="right" dataKey="Teachers" fill="#82E0AA" />
      <Bar yAxisId="right" dataKey="Admins" fill="#FF6B6B" />
    </BarChart>
  );
}

export default PayrollReportBar;
