import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"></text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function AttendancePieChart(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

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
        halfDay: 0,
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

  const countAttendance = (data) => {
    const result = {
      Present: 0,
      Absent: 0,
      Late: 0,
      HalfDay: 0,
    };

    for (const item of data) {
      result.Present += item.Present;
      result.Absent += item.Absent;
      result.Late += item.Late;
      result.HalfDay += item.halfDay;
    }

    return result;
  };

  const result = countAttendance(attendanceCounts);

  const data = [
    { name: "Present", value: result.Present },
    { name: "Absent", value: result.Absent },
    { name: "Late", value: result.Late },
    { name: "HalfDay", value: result.HalfDay },
  ];

  return (
    <PieChart width={400} height={400} margin={{ top: -90, left: -10 }}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx={200}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#d84d8d"
        dataKey="value"
        onMouseEnter={onPieEnter}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
export default AttendancePieChart;
