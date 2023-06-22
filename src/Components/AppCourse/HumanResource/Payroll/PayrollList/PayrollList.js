import React, { useState } from "react";
import "./PayrollList.css";
import Title from "antd/es/typography/Title";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Typography,
  message,
} from "antd";
import { BellOutlined, PrinterOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import jsPDF from "jspdf";
import { useEffect } from "react";
import moment from "moment";
const { Option } = Select;

const printClickHandler = async (record) => {
  const doc = new jsPDF();

  // Set the background color of the PDF to a light gray
  doc.setFillColor(255, 255, 255);
  doc.rect(
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height - 180,
    "F"
  );

  // Set the title of the invoice
  doc.setFontSize(35);
  doc.setTextColor(20, 108, 148); // Set text color to light red
  doc.setFont("times", "roman"); // Set font family to Times New Roman
  doc.text(`Ozone School`, 15, 20);

  // Set the title of the invoice
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Set text color to light red
  doc.setFont("times", "roman"); // Set font family to Times New Roman
  doc.text(`Address: Addis Ababa, Yeka, Karra`, 15, 28);

  // Set the title of the invoice
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Set text color to light red
  doc.setFont("times", "roman"); // Set font family to Times New Roman
  doc.text(`Phone: +251 940 636 550`, 15, 36);

  // Set the title of the invoice
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Set text color to light red
  doc.setFont("times", "roman"); // Set font family to Times New Roman
  doc.text(`Email: icbr19fl@gmail.com`, 15, 44);

  // Set the title of the invoice
  doc.setFontSize(30);
  doc.setTextColor(20, 108, 148); // Set text color to light red
  doc.setFont("times", "roman"); // Set font family to Times New Roman
  doc.text(`Employee Salary Invoice`, doc.internal.pageSize.width - 14, 20, {
    align: "right",
  });
  // Add the payment date
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(
    `Payment Month: ${record.month}`,
    doc.internal.pageSize.width - 14,
    28,
    { align: "right" }
  );
  // Add the payment date
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(`Employee ID: ${record.key}`, doc.internal.pageSize.width - 14, 36, {
    align: "right",
  });

  // Add the payment date
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(
    `Name: ${record.employeeName}`,
    doc.internal.pageSize.width - 14,
    44,
    {
      align: "right",
    }
  );

  // Create the table headers
  const headers = [["Description", "Salary"]];

  // Create the table data
  const data = [[`${record.month} Salary`, record.salary]];

  // Add the table to the PDF document
  doc.autoTable({
    head: headers,
    body: data,
    startY: 50,
    theme: "grid",
    styles: {
      font: "times",
      fontStyle: "normal",
      fontSize: 12,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [20, 108, 148],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    margin: { top: 20 },
  });

  // Add the signature
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(`Issued By: `, 15, doc.autoTable.previous.finalY + 20);

  // Add the signature
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text(
    `Signature: _______________`,
    15,
    doc.autoTable.previous.finalY + 28
  );

  // Save the PDF file
  doc.save(`${record.month}-invoice.pdf`);
};

const today = new Date();
const todayMonth = today.toLocaleString("en-US", { month: "short" });

function filterDataByMonth(data, month) {
  return data.reduce((result, item) => {
    const payment = item.payment.find((p) => p.month === month);
    if (payment) {
      result.push({
        key: item.employeeId,
        month: payment.month,
        employeeName: item.employeeName,
        designation: item.designation,
        jobType: "Permanent",
        salary: item.salary,
        status: payment.status,
      });
    }
    return result;
  }, []);
}

let originalData = [];
const PayrollList = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [paymentMonth, setPaymentMonth] = useState("");
  const [data, setData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updated, setUpdated] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [filteredMonth, setFilteredMonth] = useState(todayMonth);

  useEffect(() => {
    const getPayrolls = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/payroll/payrollList"
        );
        const responseData = await response.json();
        originalData = responseData.payrolls;
        const result = filterDataByMonth(responseData.payrolls, todayMonth);
        setData([...result]);
      } catch (err) {}
    };
    getPayrolls();
  }, []);
  const disabledDate = (current) => {
    if (currentMonth === null) {
      // Disable all dates before the next month
      return current && current < moment().endOf("month").add(1, "month");
    } else {
      // Disable all dates from previous months
      return current && current < currentMonth.endOf("month");
    }
  };

  const disabledTime = (_, type) => {
    if (type === "year" && currentMonth) {
      const isDecember = currentMonth.month() === 11;
      return {
        disabledHours: () =>
          isDecember ? [] : Array.from({ length: 24 }, (_, i) => i),
      };
    }
    return {};
  };

  const disabledMonth = (current) => {
    const currentYear = new Date().getFullYear();
    const selectedYear = current.year();

    // Disable dates in different years
    if (selectedYear !== currentYear) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const getEmployees = async () => {
      const response = await fetch(
        "http://localhost:8080/employee/employeeList"
      );
      const responseData = await response.json();
      const data = [];

      for (let i = 0; i < responseData.employees.length; i++) {
        if (responseData.employees[i].status !== "Suspended")
          data.push({
            key: responseData.employees[i].employeeId,
            employeeName: `${responseData.employees[i].firstName} ${responseData.employees[i].lastName}`,
            employeeId: responseData.employees[i].employeeId,
            designation: responseData.employees[i].designation,
            salary: responseData.employees[i].netSalary,
          });
      }
      setEmployee([...data]);
    };
    getEmployees();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
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

  const onFinish = async (values) => {
    let date = new Date(values.startDate);
    let startDate = date.toLocaleDateString("es-CL");
    const dateString = startDate.slice(3);

    const [monthStr, yearStr] = dateString.split("-");
    const currentYear = new Date().getFullYear();
    const currentMonth = Number(monthStr) - 1; // Adding 1 to match the month index starting from 1

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

    const startMonthIndex = months.findIndex((month) => month === monthStr);
    const remainingMonths = [];

    if (
      parseInt(yearStr) === currentYear &&
      startMonthIndex + 1 >= currentMonth
    ) {
      for (let i = startMonthIndex + 1; i < months.length; i++) {
        remainingMonths.push({ month: months[i], status: "Unpaid" });
      }
    } else if (parseInt(yearStr) > currentYear) {
      for (let i = startMonthIndex; i < months.length; i++) {
        remainingMonths.push({ month: months[i], status: "Unpaid" });
      }
    } else if (parseInt(yearStr) < currentYear) {
      for (let i = startMonthIndex; i < months.length; i++) {
        remainingMonths.push({ month: months[i], status: "Unpaid" });
      }
    } else {
      for (let i = startMonthIndex; i < months.length; i++) {
        if (i + 1 > currentMonth) {
          remainingMonths.push({ month: months[i], status: "Unpaid" });
        }
      }
    }

    try {
      const response = await fetch(`http://localhost:8080/payroll/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.employeeId,
          salary: selectedEmployee.salary,
          startMonth: remainingMonths[0].month,
          startDate: dateString,
          employeeName: selectedEmployee.employeeName,
          designation: selectedEmployee.designation,
          payment: remainingMonths,
        }),
      });
      const responseData = await response.json();
      if (responseData.code === 404) {
        error(responseData.message);
        throw Error("failed");
      }
      success(responseData.message);
      form.resetFields();
      setSelectedEmployee([]);
      setUpdated((prev) => !prev);
      setOpen(false);
    } catch (err) {
      // error("Check yout Internet and try Again!");
    }
  };

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
      title: "Salary",
      dataIndex: "salary",
    },
    {
      title: "Month",
      dataIndex: "month",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => {
        return record.status === "Unpaid" ? (
          <span
            style={{
              background: "#D61355",
              borderRadius: 3,
              color: "white",
            }}>
            {record.status}
          </span>
        ) : (
          <span
            style={{
              background: "#1F8A70",
              borderRadius: 3,
              color: "white",
            }}>
            {record.status}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "4%",
      render: (_, record, index) => {
        return record.status === "Paid" ? (
          <Typography.Link
            onClick={() => {
              printClickHandler(record);
            }}>
            <PrinterOutlined />
          </Typography.Link>
        ) : (
          <Typography.Link>
            <Popconfirm
              title="Release Payment?"
              onConfirm={async () => {
                try {
                  const response = await fetch(
                    `http://localhost:8080/payroll/pay/${record.key}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-type": "application/json",
                      },
                      body: JSON.stringify({ month: record.month }),
                    }
                  );
                  const responseData = await response.json();
                  if (responseData.code === 404) {
                    throw Error("failed");
                  }
                  success("Payment released Successfully");
                  const updatedArray = data.map((obj) => {
                    if (obj.key === record.key) {
                      return { ...obj, status: "Paid" };
                    }
                    return obj;
                  });
                  originalData = originalData.map((obj) => {
                    if (obj.key === record.key) {
                      return { ...obj, status: "Paid" };
                    }
                    return obj;
                  });
                  setData([...updatedArray]);
                } catch (err) {
                  error("Check your internet connection!");
                }
              }}>
              <PlusOutlined
                style={{ width: 15, border: "1px solid skyblue" }}
              />
            </Popconfirm>
          </Typography.Link>
        );
      },
    },
  ];
  const handleMonthChange = (date) => {
    setCurrentMonth(date);
  };
  return (
    <div>
      {contextHolder}
      <div className="PayrollListContainer">
        <div className="PayrollListHeader">
          <div style={{ width: "56%", textAlign: "left" }}>
            <Title level={4} style={{ marginTop: 0 }}>
              Payroll
            </Title>
          </div>
          <div className="NewAndSearchPayroll">
            <div>
              <DatePicker
                style={{
                  width: 180,
                }}
                mode="month"
                disabledDate={disabledMonth}
                picker="month"
                format={"MM-YYYY"}
                onChange={(value) => {
                  const today = new Date(value);
                  const month = today.toLocaleString("en-US", {
                    month: "short",
                  });
                  console.log(month);

                  const result = filterDataByMonth(originalData, month);
                  console.log(result);
                  setData([...result]);
                  setPaymentMonth(value);
                }}
              />
            </div>
            <div>
              <Button
                type="ghost"
                className="JobExportButton"
                onClick={() => {
                  showDrawer();
                }}>
                Add New Employee
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
            width: "100%",
            height: 40,
            color: "rgb(120,120,120)",
            fontWeight: 600,
            textAlign: "left",
            background: "aliceblue",
            borderRadius: 5,
          }}>
          <BellOutlined
            style={{ color: "blue", marginRight: 10, marginLeft: 20 }}
          />
          Review your payroll data before closing it.
        </div>
        <Table
          style={{ marginTop: 20 }}
          size="small"
          dataSource={data}
          columns={column}
          pagination={{ pageSize: 11 }}
        />
        <Drawer
          drawerStyle={{}}
          headerStyle={{ height: 40, textAlign: "center" }}
          width={420}
          title="Add New Employee"
          placement="right"
          onClose={onClose}
          open={open}>
          <div style={{ textAlign: "left" }}>Entity</div>
          <Select
            onSelect={(value) => {
              const data = employee.find((data) => {
                return data.employeeId === value;
              });
              setSelectedEmployee(data);
            }}
            style={{ marginTop: 10, width: "100%" }}
            placeholder="Search Using Employee Id"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={employee.map((data) => {
              return {
                label: data.employeeId,
                value: data.employeeId,
              };
            })}
          />
          <Form
            style={{ justifyContent: "left", marginTop: 40 }}
            form={form}
            name="horizontal_login"
            layout="vertical"
            onFinish={onFinish}>
            <Form.Item
              label="Start Date"
              style={{ width: "100%", textAlign: "left", marginTop: -20 }}
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Please Enter Information!",
                },
              ]}>
              <DatePicker
                picker="month"
                format={"MM-YYYY"}
                style={{ width: "100%" }}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                onChange={handleMonthChange}
              />
            </Form.Item>
          </Form>
          <div style={{ textAlign: "left" }}>Salary</div>
          <div
            style={{
              width: "100%",
              height: 33,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              border: "1px solid rgb(220,220,220)",
              borderRadius: 7,
              marginTop: 10,
            }}>
            {selectedEmployee.salary}
          </div>
          <div style={{ textAlign: "left", marginTop: 20 }}>
            Name Of Employee
          </div>
          <div
            style={{
              width: "100%",
              height: 33,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              border: "1px solid rgb(220,220,220)",
              borderRadius: 7,
              marginTop: 10,
            }}>
            {selectedEmployee.employeeName}
          </div>
          <div style={{ marginTop: 20, textAlign: "left" }}>Designation</div>
          <div
            style={{
              width: "100%",
              height: 33,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              border: "1px solid rgb(220,220,220)",
              borderRadius: 7,
              marginTop: 10,
            }}>
            {selectedEmployee.designation}
          </div>
          <Button
            type="primary"
            style={{ width: "100%", marginTop: 20 }}
            onClick={() => {
              form.submit();
            }}>
            Add Employee
          </Button>
        </Drawer>
      </div>
    </div>
  );
};

export default PayrollList;
