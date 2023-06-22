import React, { useEffect, useState } from "react";
import "./AvailableJobs.css";
import Title from "antd/es/typography/Title";
import { Button, List, Popconfirm, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

function isPastDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  return inputDate < today;
}
const AvailableJobs = () => {
  const [jobLists, setJobLists] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

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
    const getJobs = async () => {
      const response = await fetch("http://localhost:8080/job/jobList");
      const responseData = await response.json();
      const data = [];
      for (let i = 0; i < responseData.jobs.length; i++) {
        const tags = responseData.jobs[i].tags.join(", ");
        if (
          responseData.jobs[i].status === "Ongoing" &&
          !isPastDate(responseData.jobs[i].deadline)
        ) {
          data.push({
            key: responseData.jobs[i].id,
            title: responseData.jobs[i].jobName,
            tags: `${tags}, ${responseData.jobs[i].jobType}`,
            description: responseData.jobs[i].description,
            deadline: responseData.jobs[i].deadline,
            status: responseData.jobs[i].status,
          });
        }
      }
      setJobLists([...data]);
    };
    getJobs();
  }, []);
  const closeJob = async (item) => {
    try {
      await fetch(`http://localhost:8080/job/jobList/:${item.key}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      jobLists.splice(item.key, 1);
      success("The Job is Closed");
    } catch (err) {}
    setJobLists([...jobLists]);
    error("Check your internet and try again!");
  };
  return (
    <div>
      {contextHolder}
      <div className="AvailableJobsContainer">
        <div className="AvailableJobBoard">
          <Title
            className="JobPostTitle"
            level={1}
            style={{
              color: "aliceblue",
              textAlign: "center",
              width: "100vw",
              lineHeight: "25vh",
              marginTop: 0,
              fontWeight: 800,
              letterSpacing: 5,
            }}>
            Available Vacancies
          </Title>
        </div>
        <div className="JobListings">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={jobLists}
            // footer={
            //   <div>
            //     <b>ant design</b> footer part
            //   </div>
            // }
            renderItem={(item) => (
              <List.Item
                key={item.key}
                actions={[
                  <p>
                    <ClockCircleOutlined /> Deadline: {item.deadline}
                  </p>,
                  <p>{item.status}</p>,
                  <Popconfirm
                    title="Sure want to close?"
                    onConfirm={() => {
                      closeJob(item);
                    }}>
                    <Button
                      type="ghost"
                      style={{ background: "salmon", color: "white" }}>
                      Close
                    </Button>
                  </Popconfirm>,
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://static.vecteezy.com/system/resources/previews/015/600/160/original/we-are-hiring-job-and-company-vacancy-offer-icon-vector.jpg"
                  />
                }>
                <List.Item.Meta
                  //   avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.tags}
                />
                {item.description}
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableJobs;
