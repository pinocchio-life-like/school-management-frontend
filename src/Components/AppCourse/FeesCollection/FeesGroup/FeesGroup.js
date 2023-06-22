import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
  Popconfirm,
  Table,
  message,
  Row,
  Col,
  InputNumber,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import "./FeesGroup.css";
const { RangePicker } = DatePicker;
const { Option } = Select;

const handleKeyPress = (e) => {
  const charCode = e.which ? e.which : e.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    e.preventDefault();
  }
};

let originData = [];

const FeesGroup = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [tableData, setTableData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const [options, setOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    const getFees = async () => {
      const response = await fetch("http://localhost:8080/fee/feeList");
      const responseData = await response.json();
      originData = responseData.fees;

      setTableData(
        originData.map((data) => {
          return {
            key: data.feeId,
            feeName: data.feeName,
            feeType: data.feeType,
            feeStartDate: data.feeStartDate,
            feeDueDate: data.feeDueDate,
            amount: data.amount,
            fineAmount: data.fineAmount,
          };
        })
      );
    };
    getFees();
  }, []);
  const onFinish = async (values) => {
    try {
      let startDate = new Date(values.feeDueDate[0]);
      let dueDate = new Date(values.feeDueDate[1]);
      startDate = startDate.toLocaleDateString("es-CL");
      dueDate = dueDate.toLocaleDateString("es-CL");

      const data = {
        key: values.feeName.split(" ")[0],
        feeName: values.feeName,
        feeType: values.feeType,
        feeStartDate: startDate,
        feeDueDate: dueDate,
        amount: values.amount,
        fineAmount: values.fineAmount,
      };

      const response = await fetch("http://localhost:8080/fee/feeList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Check internet Connection");
      }
      success("Course Successfully Registered");

      setTableData([data, ...tableData]);
    } catch (error) {
      error("Check Your internet connection and try again");
    }
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
  //Edit Student Start
  const edit = (record) => {
    form.setFieldsValue({
      feeName: "",
      feeType: "",
      feeStartDate: "",
      feeDueDate: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  //delete Student
  const deleteFee = async (record) => {
    console.log(record.key);
    try {
      const response = await fetch(
        `http://localhost:8080/fee/feeList/${record.key}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      if (responseData.code === 404) {
        throw new Error("Couldnt delete, check your internet");
      }
      const indexValue = tableData.indexOf(record);
      tableData.splice(indexValue, 1);
      setTableData([...tableData]);
      success("Deleted Successfully");
    } catch (error) {
      error("Check Your internet connection and try again");
    }
  };
  const columns = [
    {
      title: "Fee Name",
      dataIndex: "feeName",
      width: "16%",
    },
    {
      title: "Fee Type",
      dataIndex: "feeType",
      width: "18%",
    },
    {
      title: "Fee Start Date",
      dataIndex: "feeStartDate",
      width: "12%",
    },
    {
      title: "Fee Due Date",
      dataIndex: "feeDueDate",
      width: "12%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "5%",
    },
    {
      title: "Fine Amount",
      dataIndex: "fineAmount",
      width: "8%",
    },
    {
      width: "5%",
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure want to delete?"
              onConfirm={() => {
                deleteFee(record);
              }}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //cancel edit
  const cancel = () => {
    setEditingKey("");
  };

  const onFeeTypeChange = (value) => {
    if (value === "Monthly") {
      const monthOptions = [
        { value: "January Fee", label: "January Fee" },
        { value: "February Fee", label: "February Fee" },
        { value: "March Fee", label: "March Fee" },
        { value: "April Fee", label: "April Fee" },
        { value: "May Fee", label: "May Fee" },
        { value: "June Fee", label: "June Fee" },
        { value: "July Fee", label: "July Fee" },
        { value: "August Fee", label: "August Fee" },
        { value: "September Fee", label: "September Fee" },
        { value: "October Fee", label: "October Fee" },
        { value: "November Fee", label: "November Fee" },
        { value: "December Fee", label: "December Fee" },
      ];
      setOptions([...monthOptions]);
    }
    if (value === "Admission") {
      const options = [{ value: "Admission Fee", label: "Admission Fee" }];
      setOptions([...options]);
    }
    if (value === "Sport Kits") {
      const options = [{ value: "Sport Kits Fee", label: "Sport Kits Fee" }];
      setOptions([...options]);
    }
  };
  return (
    <div>
      {contextHolder}
      <div className="FeesGroupCSS">
        <div className="FeesGroupTitle">
          <Title
            level={3}
            style={{
              marginLeft: 5,
              textAlign: "left",
              marginTop: 5,
              marginBottom: 10,
            }}>
            Add Fees Group
          </Title>
        </div>
        <div className="FeesGroupForm">
          <Form form={addForm} onFinish={onFinish} style={{ display: "flex" }}>
            <Col>
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item
                  name="feeType"
                  style={{ minWidth: 400, textAlign: "left" }}>
                  <Select
                    placeholder="Select Fee Type"
                    onChange={onFeeTypeChange}>
                    <Option value="Admission">Admission</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Sport Kits">Sport Kits</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="feeName"
                  style={{ minWidth: 400, marginLeft: 20, textAlign: "left" }}>
                  <Select placeholder="Select Fee">
                    {options.map((data) => {
                      return (
                        <Option key={Math.random()} value={data.value}>
                          {data.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="feeDueDate">
                  <RangePicker
                    style={{ minWidth: 400, marginLeft: 19 }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Row>
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="amount">
                  <InputNumber
                    onKeyPress={handleKeyPress}
                    style={{ minWidth: 400, textAlign: "left" }}
                    placeholder="Enter Fee Amount"
                  />
                </Form.Item>
                <Form.Item name="fineAmount">
                  <InputNumber
                    onKeyPress={handleKeyPress}
                    style={{ minWidth: 400, textAlign: "left", marginLeft: 19 }}
                    placeholder="Enter Fine Amount if not on Due"
                  />
                </Form.Item>
                <Form.Item style={{ minWidth: 400, marginLeft: 20 }}>
                  <Button
                    style={{ minWidth: 400 }}
                    type="primary"
                    htmlType="submit">
                    Add Fee
                  </Button>
                </Form.Item>
              </Row>
            </Col>
          </Form>
        </div>
        <div className="FeesGroupList">
          <div className="FeesGroupListTitle">
            <Title
              level={4}
              style={{
                marginLeft: 5,
                textAlign: "left",
                marginTop: 5,
                marginBottom: 10,
              }}>
              Fees Group List
            </Title>
          </div>
          <div className="FeesGroupSearch">
            <div
              style={{
                display: "flex",
                textAlign: "left",
                marginBottom: 5,
                marginTop: 5,
              }}>
              <Search
                style={{
                  marginLeft: "35.2%",
                  marginRight: 0,
                }}
                placeholder="input search text"
                // onSearch={onSearch}
                // onChange={onSearchChange}
                // onChange=
                enterButton
              />
            </div>
          </div>
          <div className="FeesGroupTable">
            <Form form={form} component={false}>
              <Table
                //   bordered
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
                pagination={{
                  onChange: deleteFee,
                }}
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesGroup;
