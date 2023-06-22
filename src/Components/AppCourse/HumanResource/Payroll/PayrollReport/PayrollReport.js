import React from "react";
import "./PayrollReport.css";
import Title from "antd/es/typography/Title";
import { Card, Col, Row, Select, Table } from "antd";
import { useState } from "react";
import { useEffect } from "react";
const { Option } = Select;

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
    title: "Start Date",
    dataIndex: "startDate",
  },
  {
    title: "Salary",
    dataIndex: "salary",
  },
  {
    title: "Total Paid",
    dataIndex: "total",
  },
];

let originalData = [];

function calculateTotalPaid(data) {
  const result = [];

  for (const employee of data) {
    const totalPaid = employee.payment.reduce((sum, payment) => {
      if (payment.status === "Paid") {
        return sum + employee.salary;
      }
      return sum;
    }, 0);

    const formattedEmployee = {
      key: employee.employeeId,
      employeeName: employee.employeeName,
      designation: employee.designation,
      jobType: "Permanent",
      startDate: employee.startDate,
      salary: employee.salary,
      total: totalPaid,
    };

    result.push(formattedEmployee);
  }

  return result;
}

function calculateSalary(data) {
  let totalMonthly = 0;
  let paidThisYear = 0;
  let remainingThisYear = 0;

  for (const employee of data) {
    totalMonthly += employee.salary;

    for (const payment of employee.payment) {
      if (payment.status === "Paid") {
        paidThisYear += employee.salary;
      } else if (payment.status === "Unpaid") {
        remainingThisYear += employee.salary;
      }
    }
  }

  const totalYearBill = paidThisYear + remainingThisYear;

  return {
    totalMonthly,
    paidThisYear,
    remainingThisYear,
    totalYearBill,
  };
}

const PayrollReport = () => {
  const [tableData, setTableData] = useState([]);
  const [reportCard, setReportCard] = useState({});

  useEffect(() => {
    const getPayrolls = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/payroll/payrollList"
        );
        const responseData = await response.json();
        originalData = responseData.payrolls;

        const result = calculateSalary(originalData);
        const data = calculateTotalPaid(responseData.payrolls);
        setReportCard(result);
        setTableData([...data]);
      } catch (err) {}
    };
    getPayrolls();
  }, []);
  return (
    <div>
      <div className="PayrollReportContainer">
        <div className="PayrollReportHeader">
          <div style={{ textAlign: "left" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Payroll Report
            </Title>
          </div>
          <div>
            <div>
              <Select
                style={{
                  width: 220,
                  textAlign: "left",
                }}
                placeholder="Employee Type">
                <Option value="Teacher">Teacher</Option>
                <Option value="Transport Manager">Transport Manager</Option>
                <Option value="Inventory Manager">Inventory Manager</Option>
                <Option value="Driver">Driver</Option>
              </Select>
            </div>
          </div>
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
                  <div
                    className="LeaveReportCardTitle"
                    style={{
                      fontSize: 14,
                    }}>
                    Total Monthly Salary
                  </div>
                  <div className="LeaveReportCardNumber">
                    ${reportCard.totalMonthly}
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
                  <div
                    className="LeaveReportCardTitle"
                    style={{
                      fontSize: 14,
                    }}>
                    Salary Paid This Year
                  </div>
                  <div className="LeaveReportCardNumber">
                    ${reportCard.paidThisYear}
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
                  <div
                    className="LeaveReportCardTitle"
                    style={{
                      fontSize: 14,
                    }}>
                    Remaining This Year
                  </div>
                  <div className="LeaveReportCardNumber">
                    ${reportCard.remainingThisYear}
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
                  <div
                    className="LeaveReportCardTitle"
                    style={{
                      fontSize: 14,
                    }}>
                    Total Year Salary Bil
                  </div>
                  <div className="LeaveReportCardNumber">
                    ${reportCard.totalYearBill}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <div style={{ width: "100%", marginTop: 20 }}>
          <Table
            size="small"
            dataSource={tableData}
            columns={column}
            pagination={{
              pageSize: 5,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollReport;
