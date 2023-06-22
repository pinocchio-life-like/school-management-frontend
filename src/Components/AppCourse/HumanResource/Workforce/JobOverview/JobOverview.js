import React, { useState } from "react";
import "./JobOverview.css";
import { Button, Card, Select, Table, message } from "antd";
import Title from "antd/es/typography/Title";
import JobBarChart from "./JobBarChart/JobBarChart";
import JobPieChart from "./JoBPieChart/JobPieChart";
import { useEffect } from "react";

const { Option } = Select;
const yearOptions = [
  { value: 2023, label: 2023 },
  { value: 2022, label: 2022 },
  { value: 2021, label: 2021 },
];

const column = [
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
    title: "Status",
    dataIndex: "status",
  },
];

let originalData = [];
const JobOverview = () => {
  const [jobLists, setJobLists] = useState([]);
  const [applicationsLists, setApplicationsLists] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [count, setCount] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);

  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  useEffect(() => {
    let totalCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    const getJobs = async () => {
      const response = await fetch("http://localhost:8080/job/jobList");
      const responseData = await response.json();

      const applications = responseData;

      for (const job of applications.jobs) {
        const applicantsCount = job.applicants.length;
        totalCount += applicantsCount;

        for (const applicant of job.applicants) {
          if (applicant.applicationStatus === "Rejected") {
            rejectedCount++;
          } else if (applicant.applicationStatus === "Pending") {
            pendingCount++;
          }
        }
      }

      const data = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (const month of months) {
        const monthData = {
          name: month,
          Pending: 0,
          Closed: 0,
          Rejected: 0,
        };

        for (const job of applications.jobs) {
          for (const applicant of job.applicants) {
            const [day, monthStr, year] = applicant.appliedOn.split("-");
            const appliedMonth = new Date(
              `${year}-${monthStr}-${day}`
            ).toLocaleString("en-US", { month: "short" });

            if (appliedMonth === month) {
              if (applicant.applicationStatus === "Pending") {
                monthData.Pending++;
              } else if (applicant.applicationStatus === "Closed") {
                monthData.Closed++;
              } else if (applicant.applicationStatus === "Rejected") {
                monthData.Rejected++;
              }
            }
          }
        }

        data.push(monthData);
      }

      setApplicationsLists([...data]);
      setJobLists([...data]);
    };
    getJobs();

    const getEmployees = async () => {
      const response = await fetch(
        "http://localhost:8080/employee/employeeList"
      );
      const responseData = await response.json();
      const data = [];
      let totalEmp = 0;
      let leaveEmp = 0;
      let activeEmp = 0;
      let suspendedEmp = 0;
      for (let i = 0; i < responseData.employees.length; i++) {
        totalEmp = totalEmp + 1;

        if (responseData.employees[i].status === "On leave") {
          leaveEmp = leaveEmp + 1;
        }
        if (responseData.employees[i].status === "Active") {
          activeEmp = activeEmp + 1;
        }
        if (responseData.employees[i].status === "Suspended") {
          suspendedEmp = suspendedEmp + 1;
        }
        data.push({
          key: responseData.employees[i].employeeId,
          employeeName: `${responseData.employees[i].firstName} ${responseData.employees[i].lastName}`,
          firstName: responseData.employees[i].firstName,
          lastName: responseData.employees[i].lastName,
          gender: responseData.employees[i].gender,
          employeeId: responseData.employees[i].employeeId,
          description: responseData.employees[i].description,
          email: responseData.employees[i].email,
          designation: responseData.employees[i].designation,
          jobType: responseData.employees[i].jobType,
          dob: responseData.employees[i].dob,
          phoneNumber: responseData.employees[i].phoneNumber,
          salary: responseData.employees[i].netSalary,
          address: `${responseData.employees[i].city}, ${responseData.employees[i].street}`,
          city: responseData.employees[i].city,
          street: responseData.employees[i].street,
          status: responseData.employees[i].status,
          startDate: responseData.employees[i].startDate,
          endDate: responseData.employees[i].endDate,
          employeeImage:
            "https://ichef.bbci.co.uk/news/800/cpsprodpb/F07C/production/_116946516_af324088-7b4f-424e-b35e-e95ebe5d1c9d.jpg",
        });
      }

      originalData = data;
      setTableData([...data]);
      setCount({
        totalEmp: totalEmp,
        totalCount: totalCount,
        rejectedCount: rejectedCount,
        pendingCount: pendingCount,
      });
    };
    getEmployees();
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="JovOverViewContainer">
        <div className="JobOverviewHeader">
          <div style={{ width: "80%", textAlign: "left" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Job Statistics
            </Title>
          </div>
          <div className="DateAndExportJob">
            <div>
              <Select
                style={{
                  width: 220,
                  textAlign: "left",
                  marginLeft: 5,
                }}
                placeholder="Year">
                {yearOptions.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="JobStatisticsCardContainer">
          <div style={{ width: "30%" }}>
            <Card
              style={{ height: 250, width: "100%", borderTopRightRadius: 0 }}>
              <div
                style={{
                  height: 100,
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <div className="TopLeftJobDiv JobCardHover">
                  <div style={{ fontWeight: 500 }}>Employees</div>
                  <div style={{ fontWeight: 600, fontSize: 24 }}>
                    {count.totalEmp}
                  </div>
                </div>
                <div className="TopRightJobDiv JobCardHover">
                  <div style={{ fontWeight: 500 }}>Applications</div>
                  <div style={{ fontWeight: 600, fontSize: 24 }}>
                    {count.totalCount}
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 100,
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <div className="BottomLeftJobDiv JobCardHover">
                  <div style={{ fontWeight: 500 }}>Rejected</div>
                  <div style={{ fontWeight: 600, fontSize: 24 }}>
                    {count.rejectedCount}
                  </div>
                </div>
                <div className="BottomRightJobDiv JobCardHover">
                  <div style={{ fontWeight: 500 }}>Pending</div>
                  <div style={{ fontWeight: 600, fontSize: 24 }}>
                    {count.pendingCount}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div style={{ width: "70%" }} className="JobChartDiv">
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 250,
                width: "100%",
                borderTopLeftRadius: 0,
              }}>
              <JobBarChart data={applicationsLists} />
            </Card>
          </div>
        </div>
        <div className="JobOverviewHeader" style={{ marginTop: 35 }}>
          <div style={{ width: "45%", textAlign: "left" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Employee Designation
            </Title>
          </div>
          <div className="DateAndExportJob" style={{ width: "24%" }}>
            <div>
              <Select
                onChange={(value) => {
                  if (value === "All") {
                    setTableData([...originalData]);
                  } else {
                    const data = originalData.filter((data) => {
                      return data.designation === value;
                    });
                    setTableData([...data]);
                  }
                }}
                style={{
                  width: 220,
                  textAlign: "left",
                  marginLeft: 80,
                }}
                placeholder="Designation">
                <Option value="All">All</Option>
                <Option value="Teacher">Teacher</Option>
                <Option value="Transport Manager">Transport Manager</Option>
                <Option value="Inventory Manager">Inventory Manager</Option>
                <Option value="Driver">Driver</Option>
              </Select>
            </div>
          </div>
          <div style={{ width: "31%" }}>
            <Title level={4} style={{ marginTop: 0, marginLeft: 35 }}>
              Designations
            </Title>
          </div>
        </div>
        <div className="JobTableAndChart">
          <div style={{ width: "69%" }}>
            <Table
              size="small"
              dataSource={tableData}
              columns={column}
              pagination={{
                pageSize: 4,
                position: tableData.length >= 4 ? "center" : false,
              }}
            />
          </div>
          <div style={{ width: "31%" }}>
            <JobPieChart data={tableData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOverview;
