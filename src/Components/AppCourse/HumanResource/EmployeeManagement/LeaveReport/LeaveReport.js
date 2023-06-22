import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import "./LeaveReport.css";
import LeaveBarChart from "./LeaveBarChart/LeaveBarChart";
import LeavePieChart from "./LeavePieChart/LeavePieChart";
import Title from "antd/es/typography/Title";
import { EyeOutlined } from "@ant-design/icons";
const { Option } = Select;
const yearOptions = [
  { value: 2023, label: 2023 },
  { value: 2022, label: 2022 },
  { value: 2021, label: 2021 },
];

let dataSource = [];
const LeaveReport = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [modal2Open, setModal2Open] = useState(false);
  const [countLeaves, setCountLeaves] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2023");

  useEffect(() => {
    const getEmployees = async () => {
      const response = await fetch(
        "http://localhost:8080/employee/employeeLeave"
      );
      const responseData = await response.json();
      const data = [];

      let activeCount = 0;
      let onLeaveCount = 0;
      let employeesCount = 0;
      let leavesCount = 0;
      leavesCount = responseData.totalLeaves;
      employeesCount = responseData.employees;
      activeCount = employeesCount;
      for (let i = 0; i < responseData.leaves.length; i++) {
        if (responseData.leaves[i].status === "On leave") {
          onLeaveCount += 1;
          activeCount -= 1;
        }
        let leaveId = responseData.leaves[i].leaveId;
        let existingDataIndex = data.findIndex(
          (item) => item.leaveId === leaveId
        );

        if (existingDataIndex !== -1) {
          // Increment times by one
          data[existingDataIndex].times += 1;

          // Add new object to the leaves array
          data[existingDataIndex].leaves.push({
            startDate: responseData.leaves[i].startDate,
            endDate: responseData.leaves[i].endDate,
            status: responseData.leaves[i].status,
          });
          data[existingDataIndex].status = responseData.leaves[i].status;
        } else {
          // Create a new data entry
          data.push({
            key: leaveId,
            leaveId: leaveId,
            employeeName: `${responseData.leaves[i].employeeName}`,
            jobType: responseData.leaves[i].jobType,
            designation: responseData.leaves[i].designation,
            leaves: [
              {
                startDate: responseData.leaves[i].startDate,
                endDate: responseData.leaves[i].endDate,
                status: responseData.leaves[i].status,
              },
            ],
            status: responseData.leaves[i].status,
            times: 1,
          });
        }
      }
      setCountLeaves({
        activeCount: activeCount,
        onLeaveCount: onLeaveCount,
        employeesCount: employeesCount,
        leavesCount: leavesCount,
      });
      dataSource = data;
      setTableData([...data]);
    };
    getEmployees();
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
    },
    {
      title: "Leave Status",
      dataIndex: "status",
    },
    {
      title: "Times",
      dataIndex: "times",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "2%",
      render: (_, record) => {
        return (
          <Typography.Link
            onClick={() => {
              setModalData([...record.leaves]);
              setModal2Open(true);
            }}
            style={{ display: "flex", justifyContent: "center" }}>
            <EyeOutlined />
          </Typography.Link>
        );
      },
    },
  ];
  return (
    <div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Title level={3} style={{ marginTop: 0 }}>
              Leave Report
            </Title>
          </div>
          <Form form={form} onFinish={onFinish}>
            <div style={{ display: "flex", justifyContent: "right" }}>
              <div>
                <Form.Item
                  noStyle
                  name="year"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please Enter Information!",
                  //   },
                  // ]}
                >
                  <Select
                    onChange={(value) => {
                      setSelectedYear(value.toString());
                    }}
                    style={{
                      width: 220,
                      textAlign: "left",
                    }}
                    placeholder="Year">
                    {yearOptions.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#5DADE2" }}>
                  <div className="LeaveReportCardTitle">Employees</div>
                  <div className="LeaveReportCardNumber">
                    {countLeaves.employeesCount}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#FFA500" }}>
                  <div className="LeaveReportCardTitle">Total Leaves</div>
                  <div className="LeaveReportCardNumber">
                    {countLeaves.leavesCount}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#82E0AA" }}>
                  <div className="LeaveReportCardTitle">Active</div>
                  <div className="LeaveReportCardNumber">
                    {countLeaves.activeCount}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{
                  height: 60,
                  padding: 0,
                }}
                bordered={true}>
                <div className="LeaveRepportCard" style={{ color: "#FF6B6B" }}>
                  <div className="LeaveReportCardTitle">On Leave</div>
                  <div className="LeaveReportCardNumber">
                    {countLeaves.onLeaveCount}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 10 }} className="JobStatisticsCardContainer">
          <div style={{ width: "68%" }} className="JobChartDiv">
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 250,
                width: "100%",
                borderTopLeftRadius: 0,
              }}>
              <LeaveBarChart year={selectedYear} designation={tableData} />
            </Card>
          </div>
          <div style={{ width: "32%" }}>
            <Card
              style={{
                height: 250,
                width: "100%",
                borderTopRightRadius: 0,
              }}>
              <LeavePieChart year={selectedYear} designation={tableData} />
            </Card>
          </div>
        </div>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={tableData}
        style={{ marginTop: 25 }}
        pagination={{ pageSize: 4 }}
      />
      <Modal
        title="Set Office Interview Date"
        centered
        onCancel={() => {
          setModalData([]);
          setModal2Open(false);
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        open={modal2Open}
        onOk={() => {
          setModalData([]);
          setModal2Open(false);
        }}>
        <Table
          size="small"
          columns={[
            {
              title: "#",
              key: "index",
              width: "6%",
              render: (item, record, i) => {
                return `${(i += 1)}`;
              },
            },
            {
              title: "Start Date",
              dataIndex: "startDate",
            },
            {
              title: "End Date",
              dataIndex: "endDate",
            },
            {
              title: "Status",
              dataIndex: "status",
            },
          ]}
          dataSource={modalData}
          scroll={{ y: 200 }}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default LeaveReport;
