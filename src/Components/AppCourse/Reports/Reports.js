import { Radio } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import AdmissionReport from "./AdmissionReport/AdmissionReport";
import ClassAndSectionReport from "./ClassAndSectionReport/ClassAndSectionReport";
import StudentAttendanceReport from "./StudentAttendanceReport/StudentAttendanceReport";
import StudentGenderRatioReport from "./StudentGenderRatioReport/StudentGenderRatioReport";
import StudentHistory from "./StudentHistory/StudentHistory";

export const Reports = () => {
  const [renderer, setRenderer] = useState();
  const [radioValue, setRadioValue] = useState("large");
  return (
    <>
      <div>
        <Title
          level={3}
          style={{ textAlign: "left", marginBottom: 20, marginTop: 0 }}>
          Reports
        </Title>
      </div>
      <div style={{ display: "flex" }}>
        <Radio.Group
          value={radioValue}
          style={{ width: "100%", textAlign: "left" }}
          onChange={(e) => {
            const value = e.target.value;
            setRadioValue(e.target.value);
            if (value === "Admission Report") {
              setRenderer(<AdmissionReport />);
            } else if (value === "Class And Section Report") {
              setRenderer(<ClassAndSectionReport />);
            } else if (value === "Student History") {
              setRenderer(<StudentHistory />);
            } else if (value === "Student Attendance Report") {
              setRenderer(<StudentAttendanceReport />);
            } else if (value === "Student Gender Ratio Report") {
              setRenderer(<StudentGenderRatioReport />);
            } else {
              setRenderer("none");
            }
          }}>
          <div>
            <Radio.Button
              value="Admission Report"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Admission Report
            </Radio.Button>
            <Radio.Button
              value="Class And Section Report"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Class And Section Report
            </Radio.Button>
            <Radio.Button
              value="Student History"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Student History
            </Radio.Button>
          </div>
          <div>
            <Radio.Button
              value="Student Attendance Report"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Student Attendance Report
            </Radio.Button>
            <Radio.Button
              value="Student Gender Ratio Report"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Student Gender Ratio Report
            </Radio.Button>
            {/* <Radio.Button
              value="small2"
              style={{ background: "#DFF6FF", width: "33.3%" }}>
              Small
            </Radio.Button> */}
          </div>
        </Radio.Group>
      </div>
      <div>{renderer}</div>
    </>
  );
};
