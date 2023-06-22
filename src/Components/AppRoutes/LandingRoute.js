import React from "react";
import { Route, Routes } from "react-router-dom";
import OzoneSchool from "../AppCourse/OzoneSchool/OzoneSchool";
import Login from "../Login/Login";
import NotFoundPage from "./NotFoundPage";

export const LandingRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<OzoneSchool />} />
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<NotFoundPage signedin={false} />} />
      </Routes>
    </div>
  );
};
