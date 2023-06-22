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

const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function AttendanceBarChart(props) {
  function countAttendanceByMonthYear(data, year, monthOptions) {
    const attendanceCounts = {};

    // Initialize attendance counts for all months
    monthOptions.forEach((monthOption) => {
      const { value, label } = monthOption;
      const monthName = label.slice(0, 3);
      attendanceCounts[monthOption.label] = {
        name: monthName,
        Present: 0,
        Absent: 0,
        Late: 0,
      };
    });

    // Iterate through each object in the array
    data.forEach((obj) => {
      // Iterate through attendance array of each object
      obj.attendance.forEach((attendance) => {
        // Check if the attendance year matches the desired year
        if (attendance.year === year) {
          // Check if the attendance month exists in monthOptions
          const monthOption = monthOptions.find(
            (option) => option.label === attendance.month
          );
          if (monthOption) {
            // Increment the count for the corresponding attendance attribute and month
            const count =
              attendanceCounts[monthOption.label][attendance.attendance];
            attendanceCounts[monthOption.label][attendance.attendance] =
              count + 1;
          }
        }
      });
    });

    return Object.values(attendanceCounts);
  }

  const attendanceCounts = countAttendanceByMonthYear(
    props.attendance,
    props.year,
    monthOptions
  );

  let data = attendanceCounts;

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
      <Bar yAxisId="left" dataKey="Absent" fill="#5DADE2" />
      <Bar yAxisId="right" dataKey="Present" fill="#82E0AA" />
      <Bar yAxisId="right" dataKey="Late" fill="#FF6B6B" />
    </BarChart>
  );
}

export default AttendanceBarChart;
