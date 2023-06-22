import Title from "antd/es/typography/Title";
import Typography from "antd/es/typography/Typography";
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PrinterOutlined,
  MoneyCollectOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./AddFee.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from "antd";
const docx = require("docx");
const { Option } = Select;

function isPastDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  return inputDate < today;
}
let originData = [];

const AddFee = () => {
  const [form] = Form.useForm();
  const [collectForm] = Form.useForm();
  let todayDate = new Date();
  todayDate = todayDate.toDateString();
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feeSubmitLoading, setFeeSubmitLoading] = useState(false);
  const [openFeeModal, setOpenFeeModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [paymentRender, setPaymentRender] = useState("");
  const [payingRecord, setPayingRecord] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [fineAmount, setFineAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState(originData);
  const payingStudent = localStorage.getItem("payingStudent");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getFees = async () => {
      const response = await fetch("http://localhost:8080/fee/feeList");
      const responseData = await response.json();
      const data = responseData.fees;

      let theFees = data.map((data) => {
        const holder = data.studentsList.filter((stud) => {
          return stud.studentId === payingStudent;
        });

        // let date = new Date(data.feeDueDate);
        // date = date.toLocaleDateString("es-CL");

        return {
          key: data.feeId,
          feeName: data.feeName,
          feeType: data.feeType,
          feeStartDate: data.feeStartDate,
          feeDueDate: data.feeDueDate,
          status:
            holder[0].paymentStatus === "Not Paid" ? (
              <span
                style={{
                  background: "#D61355",
                  borderRadius: 3,
                  color: "white",
                }}>
                Not Paid
              </span>
            ) : (
              <span
                style={{
                  background: "#1F8A70",
                  borderRadius: 3,
                  color: "white",
                }}>
                Paid
              </span>
            ),
          amount: data.amount,
          total:
            holder[0].paymentStatus === "Not Paid" ? "N/A" : holder[0].total,
          paymentId:
            holder[0].paymentStatus === "Not Paid"
              ? "N/A"
              : holder[0].paymentId,
          paymentMode:
            holder[0].paymentStatus === "Not Paid"
              ? "N/A"
              : holder[0].paymentMode,
          payedDate:
            holder[0].paymentStatus === "Not Paid"
              ? "N/A"
              : holder[0].payedDate,
          paymentFine:
            holder[0].paymentStatus === "Paid"
              ? holder[0].fine
              : isPastDate(data.feeDueDate)
              ? data.fineAmount
              : "N/A",
          due: isPastDate(data.feeDueDate)
            ? "Late"
            : holder[0].due
            ? "On Time"
            : "N/A",
          fineAmount: isPastDate(data.feeDueDate) ? data.fineAmount : 0,
        };
      });
      originData = theFees;
      setTableData(originData);
    };
    getFees();
  }, []);
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
  const showModal = () => {
    setOpenFeeModal(true);
  };
  const handleOk = () => {
    // setFeeSubmitLoading(true);
    // setTimeout(() => {
    //   setFeeSubmitLoading(false);
    // }, 10);
    setOpenFeeModal(false);
  };
  const handleCancel = () => {
    setOpenFeeModal(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
    doc.text(`${record.feeName}`, doc.internal.pageSize.width - 14, 20, {
      align: "right",
    });
    // Add the payment date
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text(
      `Payment Date: ${record.payedDate}`,
      doc.internal.pageSize.width - 14,
      28,
      { align: "right" }
    );
    // Add the payment date
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text(
      `Payment Due: ${record.due}`,
      doc.internal.pageSize.width - 14,
      36,
      { align: "right" }
    );

    // Add the payment date
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text(
      `Payment ID: ${record.paymentId}`,
      doc.internal.pageSize.width - 14,
      44,
      { align: "right" }
    );

    // Create the table headers
    const headers = [["Description", "Type", "Mode", "Fine", "Total"]];

    // Create the table data
    const data = [
      [
        record.feeName,
        record.feeType,
        record.paymentMode,
        record.paymentFine,
        record.total,
      ],
    ];

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
    doc.save(`${record.feeName}-invoice.pdf`);
  };

  const columns = [
    {
      title: "Fee Name",
      dataIndex: "feeName",
      width: "16%",
      editable: true,
    },
    {
      title: "Fee Type",
      dataIndex: "feeType",
      width: "9.5%",
      editable: true,
    },
    {
      title: "Start Date",
      dataIndex: "feeStartDate",
      width: "8%",
      editable: true,
    },
    {
      title: "Due Date",
      dataIndex: "feeDueDate",
      width: "8%",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "6%",
      editable: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "6%",
      editable: true,
    },
    {
      title: "Fine",
      dataIndex: "paymentFine",
      width: "3%",
      editable: true,
    },
    {
      title: "Total-Discount",
      dataIndex: "total",
      width: "10%",
      editable: true,
    },
    {
      title: "Payment Id",
      dataIndex: "paymentId",
      width: "7.5%",
      editable: true,
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      width: "9%",
      editable: true,
    },
    {
      title: "Payed Date",
      dataIndex: "payedDate",
      width: "10%",
      editable: true,
    },
    {
      title: "Due",
      dataIndex: "due",
      width: "35%",
      editable: true,
      render: (_, record) => {
        const [day, month, year] = record.feeDueDate.split("-");
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        return inputDate < today ? "Late" : "On Time";
      },
    },
    {
      width: "2%",
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        // const editable = isEditing(record);
        // const Assignable = isAssigning(record);
        return (
          <Space size="middle">
            {record.status.props.children === "Not Paid" ? (
              <Typography.Link
                onClick={() => {
                  //   console.log(record);
                  setModalTitle(`${record.feeName}`);
                  const amount = Number(record.amount);
                  setPaymentAmount(amount);
                  setFineAmount(record.fineAmount);
                  setTotal(record.fineAmount + amount);
                  setPayingRecord(record);
                  showModal();
                }}>
                <PlusOutlined
                  style={{ width: 15, border: "1px solid skyblue" }}
                />
              </Typography.Link>
            ) : (
              <Typography.Link
                onClick={() => {
                  const data = {
                    feeName: record.feeName,
                    feeType: record.feeType,
                    paymentId: record.paymentId,
                    paymentMode: record.paymentMode,
                    payedDate: record.payedDate,
                    due: record.due,
                    paymentFine: record.paymentFine,
                    total: record.total,
                  };
                  printClickHandler(data);
                }}>
                <PrinterOutlined />
              </Typography.Link>
            )}
          </Space>
        );
      },
    },
  ];
  const onFinish = async (values) => {
    let date = new Date();
    date = date.toLocaleDateString("es-CL");
    const indexValue = originData.indexOf(payingRecord);
    let due = "";
    if (values.fine > 0) {
      due = "Late";
    } else {
      due = "On Time";
    }
    let paymentMode;
    if (values.paymentType === "Cash") {
      paymentMode = "N/A";
    } else if (values.paymentType === "Bank Transfer") {
      paymentMode = values.transferId;
    } else if (values.paymentType === "Cheque") {
      paymentMode = values.chequeId;
    }
    const data = {
      key: payingRecord.key,
      feeName: payingRecord.feeName,
      feeType: payingRecord.feeType,
      feeStartDate: payingRecord.feeStartDate,
      feeDueDate: payingRecord.feeDueDate,
      status: (
        <span
          style={{
            background: "#1F8A70",
            borderRadius: 3,
            color: "white",
          }}>
          Paid
        </span>
      ),
      amount: payingRecord.amount,
      total: total,
      paymentId: paymentMode,
      paymentMode: values.paymentType,
      payedDate: date,
      paymentFine: fineAmount,
      due: due,
    };
    const sentData = {
      feeId: payingRecord.key,
      studentId: payingStudent,
      paymentStatus: "Paid",
      fine: fineAmount,
      total: total,
      due: due,
      paymentMode: values.paymentType,
      payedDate: date,
      paymentId: paymentMode,
    };
    try {
      await fetch(`http://localhost:8080/fee/feeList/${payingRecord.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sentData),
      });
    } catch (err) {
      error("Check Your Internet Connection And Try Again");
      return;
    }
    originData.splice(indexValue, 1, data);
    setTableData([...originData]);
    success("Payed Successfully");
    setPayingRecord([]);
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      {contextHolder}
      <div className="AddFeeCss">
        <div className="StudentFeePageTitle">
          <Title
            level={3}
            style={{
              marginLeft: 5,
              textAlign: "left",
              marginTop: -10,
              marginBottom: 10,
            }}>
            Student Fees
          </Title>
        </div>
        <div
          className="BackAndBurgerTab"
          style={{ paddingTop: 3, textAlign: "right", marginTop: -10 }}>
          <Typography.Link style={{ fontSize: 15, marginRight: 10 }}>
            <Link to="/collectFees">
              <ArrowLeftOutlined />
              Back
            </Link>
          </Typography.Link>
          <Typography.Link style={{ fontSize: 15 }} onClick={showDrawer}>
            <MenuOutlined />
          </Typography.Link>
          <Drawer
            drawerStyle={{}}
            width={270}
            title="Class 2"
            placement="right"
            onClose={onClose}
            open={open}>
            <Tabs
              tabBarStyle={{
                marginTop: -20,
                backgroundColor: "#13005A",
                color: "white",
              }}
              size="large"
              defaultActiveKey="1"
              centered
              animated
              type="card">
              <Tabs.TabPane tab="A" key="1">
                Section A List
              </Tabs.TabPane>
              <Tabs.TabPane tab="B" key="2">
                Section B List
              </Tabs.TabPane>
              <Tabs.TabPane tab="C" key="3">
                Section C List
              </Tabs.TabPane>
            </Tabs>
          </Drawer>
        </div>
        <div className="StudentInformationTable">
          <div className="TheStudentsPhoto">
            <Image
              preview={false}
              style={{
                marginLeft: -60,
                marginTop: 4,
                // paddingBottom: 10,
                marginBottom: 5,
                boxShadow:
                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
              }}
              width={120}
              height={120}
              src="https://s3.amazonaws.com/media.thecrimson.com/photos/2014/11/07/202918_1301040.jpg"
            />
          </div>
          <div className="StudentInformationDescription">
            <Descriptions
              style={{
                margin: 5,
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
              bordered
              size="small"
              column={2}>
              <Descriptions.Item labelStyle={{ width: 150 }} label="Name:">
                Camila Cabello
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: 180 }}
                label="Class Section:">
                Grade 2 A
              </Descriptions.Item>
              <Descriptions.Item label="Father Name:">
                Cabello Wick
              </Descriptions.Item>
              <Descriptions.Item label="Admission Number">
                234567
              </Descriptions.Item>
              <Descriptions.Item label="Mobile Number">
                +25194063650
              </Descriptions.Item>
              <Descriptions.Item label="Roll Number">0346</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className="FeeCollectionListTable">
          <div className="CollectSelectedAndDate">
            <div
              className="PrintAndCollectSelectedButton"
              style={{ textAlign: "left" }}>
              <Button size="small" type="primary" style={{ marginRight: 5 }}>
                <PrinterOutlined />
                Print Selected
              </Button>
              <Button size="small" type="primary">
                <MoneyCollectOutlined />
                Collect Selected
              </Button>
              <div
                style={{
                  background: "#dadada",
                  height: "1px",
                  width: "100%",
                  clear: "both",
                  marginTop: 6,
                  marginBottom: "10px",
                }}></div>
            </div>
            <div
              className="TodayDateShower"
              style={{ textAlign: "right", color: "red" }}>
              {todayDate}
              <div
                style={{
                  background: "#dadada",
                  height: "1px",
                  width: "100%",
                  clear: "both",
                  marginTop: 11.5,
                  marginBottom: "10px",
                }}></div>
            </div>
            <div className="TableSelectReloadButton">
              <div
                style={{
                  display: "flex",
                  textAlign: "left",
                  marginTop: -39,
                }}>
                <Button
                  type="primary"
                  onClick={start}
                  disabled={!hasSelected}
                  loading={loading}>
                  Reload
                </Button>
                <span
                  style={{
                    marginTop: 5,
                    marginLeft: 8,
                  }}>
                  {hasSelected
                    ? `Selected ${selectedRowKeys.length} items`
                    : ""}
                </span>
              </div>
            </div>
            <div
              className="PrintAndLikeOptions"
              style={{ textAlign: "right", marginRight: 10, marginTop: -5 }}>
              <FilePdfOutlined />
            </div>
          </div>
          <div className="FeeCollectionTable">
            <Form form={form} component={false}>
              <Table
                size="small"
                rowSelection={rowSelection}
                bordered
                dataSource={tableData}
                columns={columns}
                rowClassName="editable-row"
                pagination={
                  {
                    //   onChange: cancel,
                  }
                }
              />
            </Form>
          </div>
          <>
            <Modal
              open={openFeeModal}
              title={modalTitle}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={false}>
              <Form onFinish={onFinish} layout="vertical" form={collectForm}>
                <Form.Item
                  initialValue={todayDate.toString().slice(4)}
                  label="Date"
                  name="paymentDate">
                  <Input readOnly />
                </Form.Item>
                <Row style={{ display: "flex" }}>
                  <Col style={{ width: "48%" }}>
                    <Form.Item
                      initialValue={paymentAmount}
                      label="Amount"
                      name="amount">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col style={{ marginLeft: 15, width: "48.5%" }}>
                    <Form.Item
                      initialValue={fineAmount}
                      label="Fine"
                      name="fine">
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ display: "flex" }}>
                  <Col style={{ width: "48%" }}>
                    <Form.Item
                      initialValue={0.0}
                      label="Discount"
                      name="discount">
                      <InputNumber
                        onBlur={(e) => {
                          const discountedTotal = total - e.target.value;
                          setTotal(discountedTotal);
                        }}
                        onFocus={() => {
                          setTotal(paymentAmount + fineAmount);
                        }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ marginLeft: 15, width: "48.5%" }}>
                    <Form.Item label="Total" name="total">
                      <div
                        style={{
                          paddingTop: 3,
                          border: "1px solid #ccc",
                          width: "100%",
                          height: 32,
                          borderRadius: 5,
                        }}>
                        <span style={{ paddingLeft: 10 }}>{total}</span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item required label="Payment Type" name="paymentType">
                  <Select
                    onChange={(value) => {
                      if (value === "Cash") {
                        setPaymentRender("");
                      } else if (value === "Bank Transfer") {
                        setPaymentRender(
                          <Form.Item
                            name="transferId"
                            required
                            label="Transfer Id">
                            <Input />
                          </Form.Item>
                        );
                      } else if (value === "Cheque") {
                        setPaymentRender(
                          <Form.Item name="chequeId" required label="Cheque Id">
                            <Input />
                            paymentRender{" "}
                          </Form.Item>
                        );
                      }
                    }}>
                    <Option value="Cash">Cash</Option>
                    <Option value="Bank Transfer">Bank Transfer</Option>
                    <Option value="Cheque">Cheque</Option>
                  </Select>
                </Form.Item>
                {paymentRender}
                <div style={{ display: "flex", justifyContent: "right" }}>
                  <Button
                    style={{ marginRight: 10 }}
                    key="back"
                    onClick={handleCancel}>
                    Return
                  </Button>
                  <Form.Item>
                    <Button
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      loading={feeSubmitLoading}
                      onClick={handleOk}>
                      Collect Fees
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default AddFee;
