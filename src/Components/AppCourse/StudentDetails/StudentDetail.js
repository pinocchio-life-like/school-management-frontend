import { Divider, Image, List, Tabs } from "antd";
import {
  MailOutlined,
  AndroidOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React from "react";
import "./StudentDetail.css";
import Fee from "./Fee/Fee";
import DetailTable from "./DetailTable/DetailTable";
const StudentDetail = () => {
  return (
    <div>
      <div>
        <div className="StudentDetailContainerCss">
          <div className="StudentDetailTitle" style={{ display: "flex" }}>
            <Title level={3} style={{ textAlign: "left", marginTop: 0 }}>
              Student Detail
            </Title>
            <div
              style={{
                alignItems: "right",
                marginBottom: 5,
                marginLeft: "636px",
                marginTop: 3,
              }}>
              <Search
                style={{
                  width: 399,
                  borderRadius: 8,
                }}
                placeholder="input search text"
                // onSearch={onSearch}
                // onChange={onSearchChange}
                // onChange=
                enterButton
              />
            </div>
          </div>
          <div className="ProfilePhoto">
            <Image
              preview={false}
              width={200}
              height={200}
              src="https://s3.amazonaws.com/media.thecrimson.com/photos/2014/11/07/202918_1301040.jpg"
            />
          </div>
          <div className="RoughDetail">
            <div className="UpperEmptyDiv"></div>
            <div className="LowerDetailDiv">
              <div
                className="RoughtDetailsCss"
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  paddingTop: 5,
                  fontSize: 24,
                  color: "white",
                  width: "20%",
                  height: "30%",
                  marginLeft: "8%",
                  border: "1px solid white",
                }}>
                John Wick
              </div>
              <div
                className="RoughtDetailsCss"
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  paddingTop: 5,
                  fontSize: 24,
                  color: "white",
                  width: "20%",
                  height: "30%",
                  marginLeft: 15,
                  border: "1px solid white",
                }}>
                Grade 10
              </div>
              <div
                className="RoughtDetailsCss"
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  paddingTop: 5,
                  fontSize: 24,
                  color: "white",
                  width: "20%",
                  height: "30%",
                  marginLeft: 15,
                  border: "1px solid white",
                }}>
                Section B
              </div>
              <div
                className="RoughtDetailsCss"
                style={{
                  borderRadius: 8,
                  textAlign: "center",
                  paddingTop: 5,
                  fontSize: 24,
                  color: "white",
                  width: "20%",
                  height: "30%",
                  marginLeft: 15,
                  border: "1px solid white",
                }}>
                HIGH034611
              </div>
            </div>
          </div>
          <div className="TabsAndDetail">
            <div className="TabDetail">
              <Tabs
                style={{ marginTop: 10, marginLeft: "10px" }}
                defaultActiveKey="1"
                animated>
                <Tabs.TabPane tab="Profile" key="1">
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        boxShadow:
                          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                        textAlign: "left",
                        width: "25%",
                        borderRadius: 10,
                      }}>
                      <div
                        className="PersonalDetailsPTag"
                        style={{ marginLeft: 5 }}>
                        <Divider orientation="left">
                          <Title level={4} style={{ marginTop: 15 }}>
                            Personal Details:
                          </Title>
                        </Divider>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Name
                          </h3>
                          <p>John Wick</p>
                        </div>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Class
                          </h3>
                          <p>Grade 8 A</p>
                        </div>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Gender
                          </h3>
                          <p>Male</p>
                        </div>
                        <div>
                          <h3>
                            <MailOutlined />
                            Email
                          </h3>
                          <p>icbr19fl@gmail.com</p>
                        </div>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Date of birth
                          </h3>
                          <p>22 Apr 1991</p>
                        </div>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Admission Number
                          </h3>
                          <p>HIGH034611</p>
                        </div>
                        <div>
                          <h3>
                            <AppleOutlined />
                            Religion
                          </h3>
                          <p>Uknown</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginLeft: 15, width: "74%" }}>
                      <DetailTable />
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Fee" key="2">
                  <Fee />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Other" key="3">
                  <div>Other</div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
