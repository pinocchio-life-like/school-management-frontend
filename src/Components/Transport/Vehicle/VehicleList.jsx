import React, { useState, useEffect } from "react";
import "./vehicle.css";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Table, Input, Space, Button, Popconfirm, Modal, message } from "antd";
import AddVehicle from "./AddVehicle";
import ViewVehicle from "./ViewVehicle";
import EditVehicle from "./EditVehicle";
import axios from "axios";
function VehicleList() {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [data, setdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setloading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await axios.get("http://localhost:8080/vehicle").then((res) => {
      setloading(false);
      setdata(
        res.data.map((row) => ({
          vehicleName: row.vehicleName,
          vehicleModel: row.vehicleModel,
          vehicleNumber: row.vehicleNumber,
          yearMade: row.yearMade,
          capacity: row.capacity,
          driver: row.driver,
          id: row._id,
          key: row._id,
        }))
      );
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
    },
    {
      title: "Vehicle Model",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
    },
    {
      title: "Year Made",
      dataIndex: "yearMade",
      key: "yearMade",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Driver Name",
      dataIndex: "driver",
      key: "driverName",
      render: (driver) => (driver ? `${driver.fname} ${driver.lname}` : ""),
    },
    {
      title: "Driver License",
      dataIndex: "driver",
      key: "driverLicense",
      render: (driver) => (driver ? driver.license : ""),
    },
    {
      title: "Driver Contact",
      dataIndex: "driver",
      key: "driverPhone",
      render: (driver) => (driver ? driver.phone : ""),
    },

    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedVehicleData(record);
              setViewModalVisible(true);
            }}>
            View
          </Button>
          <Modal
            title="View Vehicle"
            open={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
            width={1100}
            footer={null}
            className="custom-modal">
            <ViewVehicle selectedVehicleData={selectedVehicleData} />
          </Modal>

          <Button
            onClick={() => {
              setSelectedVehicle(record);
              setEditModalVisible(true);
            }}>
            Edit
          </Button>
          <Modal
            title="Edit Vehicle"
            open={editModalVisible}
            width={1200}
            onCancel={() => setEditModalVisible(false)}
            footer={null}>
            <EditVehicle selectedVehicle={selectedVehicle} />
          </Modal>

          <Popconfirm
            title="Are you sure you want to delete this vehicle?"
            onConfirm={async () => {
              try {
                await fetch(`http://localhost:8080/vehicle/${record.id}`, {
                  method: "DELETE",
                });

                // Remove the deleted vehicle from the data array
                const newData = data.filter((item) => item.id !== record.id);
                setdata(newData);

                // Show success message
                message.success("Vehicle deleted successfully!");
              } catch (error) {
                console.error(error);
              }
            }}>
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleReset = () => {
    setSearchText("");
  };

  return (
    <div className="vehicleContainer">
      <div className="vehicleWrapper">
        <div className="vehicleHead">
          <h2 className="titles">Vehicle List</h2>
          <div className="addVehicleCont">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="saveBtn"
              onClick={() => setAddModalVisible(true)}>
              Add Vehicle
            </Button>
            <Modal
              title="Add Vehicle"
              open={addModalVisible}
              onCancel={() => setAddModalVisible(false)}
              footer={null}
              width={1200}>
              <AddVehicle />
              {/* Add the content of the Add Vehicle Modal here */}
            </Modal>
          </div>
        </div>
        <div className="vehicleTable">
          {/* <div className="vehicleSearch">
            <Input
              placeholder="Search vehicle name, model, or driver name"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onPressEnter={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              onClick={handleReset}
              icon={<SearchOutlined />}
              // size="small"
              className="resetBtn"
            >
              Reset
            </Button>
          </div> */}
          <div>
            <Table
              style={{ marginTop: 20 }}
              dataSource={filteredData}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleList;
