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

function LeaveBarChart(props) {
  let data = [
    {
      name: "Jan",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Feb",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Mar",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Apr",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "May",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Jun",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Jul",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Aug",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Sep",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Oct",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Nov",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
    {
      name: "Dec",
      Teachers: 0,
      Drivers: 0,
      Admins: 0,
    },
  ];
  for (let i = 0; i < props.designation.length; i++) {
    for (let j = 0; j < props.designation[i].leaves.length; j++) {
      const dateStr = props.designation[i].leaves[j].startDate;
      const dateParts = dateStr.split("-");
      const month = parseInt(dateParts[1], 10) - 1; // Months in JavaScript are zero-based
      const date = new Date(dateParts[2], month, dateParts[0]);
      const monthName = date.toLocaleString("default", { month: "short" });
      const startDate = props.designation[i].leaves[j].startDate;
      let year = new Date(startDate).getFullYear();
      year = year.toString();
      if (
        props.designation[i].designation === "Teacher" &&
        year === props.year
      ) {
        const monthData = data.find((item) => item.name === monthName);
        if (monthData) {
          monthData.Teachers += 1;
        }
      } else if (
        props.designation[i].designation === "Driver" &&
        year === props.year
      ) {
        const monthData = data.find((item) => item.name === monthName);
        if (monthData) {
          monthData.Drivers += 1;
        }
      } else if (year === props.year) {
        const monthData = data.find((item) => item.name === monthName);
        if (monthData) {
          monthData.Admins += 1;
        }
      }
    }
  }
  console.log(data);

  return (
    <BarChart
      width={900}
      height={300}
      data={data}
      margin={{
        top: 40,
        // right: 10,
        // left: -20,
        bottom: 5,
      }}>
      <CartesianGrid strokeDasharray="0 1" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="Teachers" fill="#5DADE2" />
      <Bar yAxisId="right" dataKey="Drivers" fill="#82E0AA" />
      <Bar yAxisId="right" dataKey="Admins" fill="#FF6B6B" />
    </BarChart>
  );
}

export default LeaveBarChart;
