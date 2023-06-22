import {
  Avatar,
  Button,
  Card,
  Form,
  Image,
  Input,
  List,
  Skeleton,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  LoginOutlined,
  UsergroupAddOutlined,
  FrownOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Filler,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";

import { Bar, Radar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);
const data = [
  "Brooklyn Simmons 100%",
  "Cody Japan",
  "Marvin Mchkney",
  "Ariene Manoy",
  "Kristin Watson",
];
const count = 4;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const StudentAttendanceReport = () => {
  const [list, setList] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);

  return (
    <div>
      <div
        style={{
          marginTop: 10,
          height: 140,
          border: "1px solid black",
          borderRadius: 5,
          justifyContent: "center",
          display: "flex",
          background: "#16213E",
        }}>
        <Form
          style={{
            marginTop: 20,
            display: "flex",
            height: "24%",
            width: "100%",
            justifyContent: "center",
          }}>
          <Form.Item noStyle>
            <Input style={{ width: "30%" }} />
          </Form.Item>
          <Form.Item noStyle>
            <Input style={{ marginLeft: 10, width: "30%" }} />
          </Form.Item>
          <Form.Item noStyle>
            <Button style={{ marginLeft: 10 }}>Filter</Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: -50 }}>
          <Card
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              width: 260,
              height: 100,
              textAlign: "left",
            }}>
            <Typography.Text>
              <UsergroupAddOutlined
                style={{
                  fontSize: 50,
                  borderRadius: 4,
                  padding: 3,
                  color: "#16213E",
                }}
              />
              <div style={{ color: "#16213E", marginTop: -60, marginLeft: 65 }}>
                <span style={{ fontSize: 24 }}>
                  <strong>52</strong>
                </span>
                <span style={{ display: "block" }}>Total Students</span>
              </div>
            </Typography.Text>
          </Card>
          <Card
            style={{
              backgroundColor: "#1C82AD",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              marginLeft: 10,
              width: 260,
              height: 100,
              textAlign: "left",
            }}>
            <Typography.Text>
              <LoginOutlined
                style={{
                  fontSize: 50,
                  background: "white",
                  borderRadius: 4,
                  padding: 3,
                  color: "#16213E",
                }}
              />
              <div style={{ color: "white", marginTop: -60, marginLeft: 65 }}>
                <span style={{ fontSize: 24 }}>
                  <strong>42</strong>
                </span>
                <span style={{ display: "block" }}>Present Today</span>
              </div>
            </Typography.Text>
          </Card>
          <Card
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              marginLeft: 10,
              width: 260,
              height: 100,
              textAlign: "left",
            }}>
            <Typography.Text>
              <FrownOutlined
                style={{
                  fontSize: 50,
                  borderRadius: 4,
                  padding: 3,
                  color: "#16213E",
                }}
              />
              <div style={{ color: "#16213E", marginTop: -60, marginLeft: 65 }}>
                <span style={{ fontSize: 24 }}>
                  <strong>5</strong>
                </span>
                <span style={{ display: "block" }}>Absent Today</span>
              </div>
            </Typography.Text>
          </Card>
          <Card
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              marginLeft: 10,
              width: 260,
              height: 100,
              textAlign: "left",
            }}>
            <Typography.Text>
              <FieldTimeOutlined
                style={{
                  fontSize: 50,
                  borderRadius: 4,
                  padding: 3,
                  color: "#16213E",
                }}
              />
              <div style={{ color: "#16213E", marginTop: -60, marginLeft: 65 }}>
                <span style={{ fontSize: 24 }}>
                  <strong>3</strong>
                </span>
                <span style={{ display: "block" }}>Late Students</span>
              </div>
            </Typography.Text>
          </Card>
        </div>
        <div
          style={{
            height: 800,
            border: "1px solid #ccc",
            zIndex: -10,
            marginTop: -53,
            background: "#F5F5F5",
            textAlign: "left",
          }}>
          <div style={{ marginTop: 70, display: "flex" }}>
            <div
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                width: "50%",
                background: "white",
                marginLeft: 15,
              }}>
              <LineChart />
            </div>
            <div
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                width: "60%",
                background: "white",
                marginLeft: 10,
                marginRight: 20,
              }}>
              <BarChart />
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 15 }}>
            <div
              style={{
                marginLeft: 15,
                background: "white",
                width: "33%",
                paddingBottom: 10,
                paddingLeft: 15,
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              }}>
              <DoughnutChart />
            </div>
            <div
              style={{
                marginLeft: 15,
                background: "white",
                width: "31.7%",
                paddingBottom: 10,
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              }}>
              <List
                header={
                  <strong style={{ paddingLeft: 15 }}>Top Attendees</strong>
                }
                size="small"
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                  <List.Item>
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active>
                      <List.Item.Meta
                        avatar={<Avatar src={item.picture.large} />}
                        title={
                          <a href="https://ant.design">{item.name?.last}</a>
                        }
                        description="Last 30 Days"
                      />
                      <div>100%</div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
            <div
              style={{
                marginLeft: 15,
                background: "white",
                width: "30%",
                paddingBottom: 10,
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
              }}>
              <RadarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LineChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Attendance Report",
      },
    },
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Absent",
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Present",
        data: labels.map(() => Math.round(Math.random() * 100)),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
};
const BarChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Absent By Class",
      },
    },
  };

  const labels = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
  ];

  const data = {
    labels,
    datasets: [
      //   {
      //     label: "Female",
      //     data: labels.map(() => Math.round(Math.random() * 20)),
      //     backgroundColor: "rgba(255, 99, 132, 0.5)",
      //   },
      {
        label: "Students",
        data: labels.map(() => Math.round(Math.random() * 20)),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

const DoughnutChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Absents By Gender",
      },
    },
  };
  const data = {
    labels: ["Female", "Male"],
    datasets: [
      {
        label: "# of Absent",
        data: [12, 19],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return <Doughnut data={data} options={options} />;
};
const RadarChart = () => {
  const data = {
    labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
    datasets: [
      {
        label: "Female Weekly Absents",
        data: [2, 9, 3, 5, 2, 3],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Male Weekly Absents",
        data: [7, 2, 4, 1, 9, 0],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  return <Radar data={data} />;
};
export default StudentAttendanceReport;
