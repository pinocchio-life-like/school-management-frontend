import {
  TeamOutlined,
  UserOutlined,
  PicCenterOutlined,
  DeploymentUnitOutlined,
  IdcardOutlined,
  BarChartOutlined,
  DollarCircleOutlined,
  SnippetsOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  AccountBookOutlined,
  ContactsOutlined,
  DiffOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/auth-context";

const Year = new Date();
const CalenderYear = Year.getFullYear();
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const SideBarMenu = (props) => {
  const auth = useContext(AuthContext);
  const userType = auth.userType;
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);

  let items = [];

  if (userType === "School Admin") {
    items = [
      // getItem("DashBoard", "/dashboard", <AppstoreOutlined />),
      getItem("Class", "/classList", <PicCenterOutlined />),
      getItem("Course", "sub2", <DeploymentUnitOutlined />, [
        getItem("Course Break Down", "/courseBreakDown"),
        getItem("Course Offer", "/courseOffer"),
        getItem("Courses Group", "/courseGroup"),
      ]),
      getItem("Teacher", "sub3", <TeamOutlined />, [
        getItem("Teacher List", "/teacherList"),
        getItem("Assign Teacher", "/assignTeacher"),
        getItem("Attending Teacher", "/attendingTeacher"),
      ]),
      getItem("Student", "sub4", <IdcardOutlined />, [
        // getItem("Student Admission", "/studentAdmission"),
        getItem("Student Registration", "/studentRegistration"),
        getItem("Students List", "/studentsList"),
        getItem(`Admit for ${CalenderYear}`, "/admitForYear"),
        // getItem("Students Detail", "/studentDetail"),
      ]),
      getItem("Fees Collection", "sub5", <DollarCircleOutlined />, [
        getItem("Fees Group", "/feesGroup"),
        getItem("Collect Fees", "/collectFees"),
      ]),
      getItem("Reports", "sub6", <BarChartOutlined />, [
        getItem("Admission Report", "/admissionReport"),
        getItem("Class And Section Report", "/classAndSectionReport"),
        getItem("Student Attendance Report", "/studentAttendanceReport"),
        getItem("Student Mark Report", "/studentMarkReport"),
        // getItem("Student Attendance Report", "/studentAttendanceReport"),
        // getItem("Student History Report", "/studentHistoryReport"),
        // getItem("Gender Ratio Report", "/genderRatioReport"),
      ]),
      // getItem("Reports", "/reports", <BarChartOutlined />),
    ];
  } else if (userType === "HR Admin") {
    items = [
      // getItem("DashBoard", "/dashboard", <AppstoreOutlined />),
      getItem("My Profile", "/myProfile", <UserOutlined />),
      getItem("Workforce", "sub7", <DollarCircleOutlined />, [
        getItem("Job Overview", "/jobOverview"),
        getItem("Post Jobs", "/postJobs"),
        getItem("Available Jobs", "/availableJobs"),
        getItem("Applications", "/jobApplications"),
        getItem("Interviewing", "/jobInterview"),
      ]),
      getItem("Payroll", "sub8", <AccountBookOutlined />, [
        getItem("Payroll List", "/payrollList"),
        getItem("Payroll Report", "/payrollReport"),
      ]),
      getItem("Employee Management", "sub9", <ContactsOutlined />, [
        getItem("Add Employee", "/addEmployee"),
        getItem("Employee List", "/employeeList"),
        getItem("Employee Attendance", "/employeeAttendance"),
        getItem("Leave Report", "/leaveReport"),
        getItem("Attendance Report", "/employeeAttendanceReport"),
      ]),
    ];
  } else if (userType === "Admin") {
    items = [
      // getItem("DashBoard", "/dashboard", <AppstoreOutlined />),
      getItem("My Profile", "/myProfile", <UserOutlined />),
      getItem("Create Accounts", "/createAccounts", <DiffOutlined />),
    ];
  } else if (userType === "Student") {
    items = [
      getItem("DashBoard", "/studentDashboard", <AppstoreOutlined />),
      getItem("My Profile", "/myProfile", <UserOutlined />),
    ];
  } else if (userType === "Teacher") {
    items = [
      // getItem("DashBoard", "/dashboard", <AppstoreOutlined />),
      getItem("Student Mark", "/studentsMark", <FileDoneOutlined />),
      getItem(
        "Student Attendance",
        "/studentsAttendance",
        <SnippetsOutlined />
      ),
    ];
  }

  const handleOpenChange = (keys) => {
    setOpenKeys([keys[keys.length - 1]]);
  };
  return (
    <div>
      <Menu
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "rgba(0, 0, 0, 0.5)",
          width: props.width,
        }}
        theme="light"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        // defaultSelectedKeys={["3"]}
        items={items}
        onClick={({ key }) => {
          if (key === "test") {
          } else {
            navigate(key);
          }
        }}></Menu>
    </div>
  );
};

export default SideBarMenu;
