import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AssignCourseToClass from "../AppCourse/TestPages/AssignCourseToClass";
import AssignTeacherToCourse from "../AppCourse/AssignTeacher/AssignTeacherToCourse";
import CourseBreakDown from "../AppCourse/CourseBreakDown/CourseBreakDown";
import CourseGroup from "../AppCourse/CourseGroup/CourseGroup";
import CourseList from "../AppCourse/TestPages/CourseList";
import CourseOffer from "../AppCourse/CourseOffer/CourseOffer";
import EditCourse from "../AppCourse/TestPages/EditCourse";
import AddCourse from "../AppCourse/TestPages/AddCourse";
import TeacherList from "../AppCourse/TeacherList/TeacherList";
import StudentAdmission from "../AppCourse/StudentAdmission/StudentAdmission";
import StudentDetail from "../AppCourse/StudentDetails/StudentDetail";
import StudentsList from "../AppCourse/StudentsList/StudentsList";
import FeesGroup from "../AppCourse/FeesCollection/FeesGroup/FeesGroup";
import CollectFees from "../AppCourse/FeesCollection/CollectFees/CollectFees";
import AddFee from "../AppCourse/FeesCollection/CollectFees/AddFee/AddFee";
import AdmissionTwo from "../AppCourse/StudentAdmission/Admission_2/AdmissionTwo";
import { Reports } from "../AppCourse/Reports/Reports";
import ClassList from "../AppCourse/Class/ClassList";
import AdmitForYear from "../AppCourse/AdmitForYear/AdmitForYear";
import StudentsAttendance from "../AppCourse/StudentsAttendance/StudentsAttendance";
import AdmissionReport from "../AppCourse/Reports/AdmissionReport/AdmissionReport";
import ClassAndSectionReport from "../AppCourse/Reports/ClassAndSectionReport/ClassAndSectionReport";
// import StudentAttendanceReport from "../AppCourse/Reports/StudentAttendanceReport/StudentAttendanceReport";
import StudentGenderRatioReport from "../AppCourse/Reports/StudentGenderRatioReport/StudentGenderRatioReport";
import StudentHistory from "../AppCourse/Reports/StudentHistory/StudentHistory";
import StudentAttendanceReportTwo from "../AppCourse/Reports/StudentAttendanceReportTwo/StudentAttendanceReportTwo";
import StudentMark from "../AppCourse/StudentMark/StudentMark";
import StudentMarkReport from "../AppCourse/Reports/StudentMarkReport/StudentMarkReport";
import PostJobs from "../AppCourse/HumanResource/Workforce/PostJobs/PostJobs";
import AvailableJobs from "../AppCourse/HumanResource/Workforce/AvailableJobs/AvailableJobs";
import Applications from "../AppCourse/HumanResource/Workforce/Applications/Applications";
import JobOverview from "../AppCourse/HumanResource/Workforce/JobOverview/JobOverview";
import PayrollList from "../AppCourse/HumanResource/Payroll/PayrollList/PayrollList";
import PayrollReport from "../AppCourse/HumanResource/Payroll/PayrollReport/PayrollReport";
import AddEmployee from "../AppCourse/HumanResource/EmployeeManagement/AddEmployee/AddEmployee";
import AttendanceReport from "../AppCourse/HumanResource/EmployeeManagement/AttendanceReport/AttendanceReport";
import EmployeeAttendance from "../AppCourse/HumanResource/EmployeeManagement/EmployeeAttendace/EmployeeAttendance";
import EmployeeList from "../AppCourse/HumanResource/EmployeeManagement/EmployeeList/EmployeeList";
import LeaveReport from "../AppCourse/HumanResource/EmployeeManagement/LeaveReport/LeaveReport";
import NotFoundPage from "./NotFoundPage";

import { AuthContext } from "../../Context/auth-context";
import MyProfile from "../AppCourse/MyProfile/MyProfile";
import CreateAccounts from "../AppCourse/CreateAccounts/CreateAccounts";
import Interviewing from "../AppCourse/HumanResource/Workforce/Interviewing/Interviewing";
import StudentDashboard from "../AppCourse/Dashboard/StudentDashboard/StudentDashboard";
import AttendingTeacher from "../AppCourse/AttendingTeacher/AttendingTeacher";

const AppRoute = () => {
  const auth = useContext(AuthContext);
  const userType = auth.userType;

  return (
    <div>
      <Routes>
        {/* <Route path="/dashboard" element={<div></div>} /> */}
        <Route path="/myProfile" element={<MyProfile />} />
        {userType === "Admin" && (
          <Route path="/createAccounts" element={<CreateAccounts />} />
        )}
        {userType === "School Admin" && (
          <Route path="/classList" element={<ClassList />} />
        )}
        {userType === "School Admin" && (
          <Route path="/courseList" element={<CourseList />} />
        )}
        {userType === "School Admin" && (
          <Route
            path="/assignCourseToClass"
            element={<AssignCourseToClass />}
          />
        )}
        {userType === "School Admin" && (
          <Route path="/addCourse" element={<AddCourse />} />
        )}
        {userType === "School Admin" && (
          <Route path="/editCourse" element={<EditCourse />} />
        )}
        {userType === "School Admin" && (
          <Route path="/assignTeacher" element={<AssignTeacherToCourse />} />
        )}
        {userType === "School Admin" && (
          <Route path="/courseBreakDown" element={<CourseBreakDown />} />
        )}
        {userType === "School Admin" && (
          <Route path="/courseOffer" element={<CourseOffer />} />
        )}
        {userType === "School Admin" && (
          <Route path="/courseGroup" element={<CourseGroup />} />
        )}
        {userType === "School Admin" && (
          <Route path="/teacherList" element={<TeacherList />} />
        )}
        {userType === "School Admin" && (
          <Route path="/attendingTeacher" element={<AttendingTeacher />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentAdmission" element={<StudentAdmission />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentDetail" element={<StudentDetail />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentsList" element={<StudentsList />} />
        )}
        {userType === "School Admin" && (
          <Route path="/feesGroup" element={<FeesGroup />} />
        )}
        {userType === "School Admin" && (
          <Route path="/collectFees" element={<CollectFees />} />
        )}
        {userType === "School Admin" && (
          <Route path="/addFee" element={<AddFee />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentRegistration" element={<AdmissionTwo />} />
        )}
        {userType === "School Admin" && (
          <Route path="/admitForYear" element={<AdmitForYear />} />
        )}
        {userType === "School Admin" && (
          <Route path="/reports" element={<Reports />} />
        )}
        {userType === "School Admin" && (
          <Route path="/admissionReport" element={<AdmissionReport />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentHistoryReport" element={<StudentHistory />} />
        )}
        {userType === "School Admin" && (
          <Route path="/studentMarkReport" element={<StudentMarkReport />} />
        )}
        {userType === "School Admin" && (
          <Route
            path="/genderRatioReport"
            element={<StudentGenderRatioReport />}
          />
        )}
        {userType === "School Admin" && (
          <Route
            path="/classAndSectionReport"
            element={<ClassAndSectionReport />}
          />
        )}
        {/* <Route
          path="/studentAttendanceReport"
          element={<StudentAttendanceReport />}
        /> */}
        {userType === "School Admin" && (
          <Route
            path="/studentAttendanceReport"
            element={<StudentAttendanceReportTwo />}
          />
        )}
        {userType === "School Admin" && (
          <Route
            path="/studentGenderRatioReport"
            element={<StudentGenderRatioReport />}
          />
        )}
        {userType === "HR Admin" && (
          <Route path="/postJobs" element={<PostJobs />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/availableJobs" element={<AvailableJobs />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/jobApplications" element={<Applications />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/jobOverview" element={<JobOverview />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/payrollList" element={<PayrollList />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/payrollReport" element={<PayrollReport />} />
        )}

        {userType === "HR Admin" && (
          <Route path="/addEmployee" element={<AddEmployee />} />
        )}
        {userType === "HR Admin" && (
          <Route
            path="/employeeAttendanceReport"
            element={<AttendanceReport />}
          />
        )}
        {userType === "HR Admin" && (
          <Route path="/employeeAttendance" element={<EmployeeAttendance />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/employeeList" element={<EmployeeList />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/leaveReport" element={<LeaveReport />} />
        )}
        {userType === "HR Admin" && (
          <Route path="/jobInterview" element={<Interviewing />} />
        )}

        {userType === "Student" && (
          <Route path="/studentDashboard" element={<StudentDashboard />} />
        )}

        {userType === "Teacher" && (
          <Route path="/studentsMark" element={<StudentMark />} />
        )}
        {userType === "Teacher" && (
          <Route path="/studentsAttendance" element={<StudentsAttendance />} />
        )}

        <Route path="/*" element={<NotFoundPage signedin={true} />} />
      </Routes>
    </div>
  );
};

export default AppRoute;
