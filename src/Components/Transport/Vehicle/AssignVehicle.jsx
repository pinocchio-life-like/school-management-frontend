import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Table,
  Space,
  Modal,
  Radio,
  Input,
  message,
  notification,
  Popconfirm,
} from "antd";
// import Input fromantd/es/input/Input";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select } from "antd";

const { Option } = Select;

function AssignVehicle() {
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [assignVehicleData, setAssignVehicleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingRecords, setExistingRecords] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setLoading(true);
    const fetchAssignVehicleData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/assignVehicle");
        setAssignVehicleData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicleRoute");
        setRoutes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicle");
        setVehicles(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchExistingRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/assignVehicle");
        setExistingRecords(response.data);
      } catch (error) {
        console.log("Error fetching existing records:", error.message);
      }
    };
    fetchExistingRecords();

    fetchAssignVehicleData();
    fetchRoutes();
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (
      assignVehicleData.length === 0 ||
      routes.length === 0 ||
      vehicles.length === 0
    ) {
      return;
    }

    const dataSource = assignVehicleData.map((item, index) => {
      const route = routes.find((r) => r._id === item.route);
      const vehicle = vehicles.find((v) => v._id === item.vehicle);
      return {
        id: item._id,
        key: index + 1,
        routeName: route ? route.routeName : "",
        vehicleName: vehicle ? vehicle.vehicleName : "",
        routeId: route ? route._id : "",
        vehicleId: vehicle ? vehicle._id : "",
      };
    });

    setDataSource(dataSource);
    setLoading(false);
  }, [assignVehicleData, routes, vehicles]);

  const handleSelectChange = (value) => {
    // setSelectedRoute(value);
  };

  const columns = [
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "Vehicle Name",
      dataIndex: "vehicleName",
      key: "vehicleName",
    },
    {
      title: "Action",
      key: "action",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <EditModal record={record} />
          <Popconfirm
            title="Are you sure you want to delete this vehicle?"
            onConfirm={() => handleDelete(record)}>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleDelete = (record) => {
    fetch(`http://localhost:8080/assignVehicle/${record.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setExistingRecords(
          existingRecords.filter(
            (existingRecord) => existingRecord !== record.id
          )
        );
        setAssignVehicleData(
          assignVehicleData.filter(
            (assignVehicleRecord) => assignVehicleRecord.id !== record.id
          )
        );
        message.success("Record deleted successfully.");
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Failed to delete record from server.",
        });
      });
  };

  const EditModal = ({ record }) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const handleOk = () => {
      form
        .validateFields()
        .then((values) => {
          const { routeName, vehicleName } = values;

          fetch(`http://localhost:8080/assignVehicle/${record.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ route: routeName, vehicle: vehicleName }),
          })
            .then((response) => response.json())
            .then((data) => {
              setExistingRecords(
                existingRecords.map((existingRecord) => {
                  if (existingRecord._id === record._id) {
                    return { ...existingRecord, routeName, vehicleName };
                  } else {
                    return existingRecord;
                  }
                })
              );
              setAssignVehicleData(
                assignVehicleData.map((assignVehicleRecord) => {
                  if (assignVehicleRecord._id === record._id) {
                    return { ...assignVehicleRecord, routeName, vehicleName };
                  } else {
                    return assignVehicleRecord;
                  }
                })
              );
              message.success("Record updated successfully.");
              setVisible(false);
            })
            .catch(() => {
              notification.error({
                message: "Error",
                description: "Failed to update record on server.",
              });
            });
        })
        .catch((err) => console.log(err));
    };

    const handleCancel = () => {
      setVisible(false);
    };

    const showModal = () => {
      setVisible(true);
    };

    return (
      <>
        <Button type="primary" icon={<EditOutlined />} onClick={showModal}>
          Edit
        </Button>
        <Modal
          title="Edit Route Name"
          open={visible}
          onOk={handleOk}
          onCancel={handleCancel}>
          <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
            initialValues={{
              routeName: record.routeName,
            }}>
            <Form.Item
              name="routeName"
              label="Route Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a route name",
                },
              ]}>
              <Select
                defaultValue={record.routeName}
                //   style={{ width: 120 }}
                onChange={handleSelectChange}>
                {routes.map((route) => (
                  <Option key={route.id} value={route.routeName}>
                    {route.routeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="vehicleName"
              label="Vehicle Name"
              rules={[
                {
                  required: true,
                  message: "Please select Vehicle",
                },
              ]}>
              <Radio.Group>
                {vehicles.map((vehicle) => (
                  <Radio key={vehicle.vehicleName} value={vehicle.vehicleName}>
                    {vehicle.vehicleName}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onFinish = async (values) => {
    try {
      const { vehicleName, routeName } = values;

      // Check if the vehicle is already assigned to the route
      const existingAssignment = await axios.get(
        `http://localhost:8080/assignVehicle?vehicleName=${vehicleName}&routeName=${routeName}`
      );
      if (existingAssignment.data.length > 0) {
        console.log("Vehicle is already assigned to this route");
        notification.warning({
          message: "Vehicle is already assigned to this route",
        }); // Use the notification component instead of the message component
      } else {
        await axios.post("http://localhost:8080/assignVehicle", {
          vehicleName,
          routeName,
        });
        message.success("Data sent successfully!");
      }
      // Reload the page to show the updated data
      // window.location.reload();
    } catch (error) {
      console.log("Error assigning vehicle:", error.message);
    }
  };
  return (
    <div className="assignVehicleCont">
      <div className="routeGrid">
        <div className="leftGrid">
          <div className="routeTitle">
            <h2>Assign Vehicle</h2>
          </div>
          <div className="form">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Select Route" name="routeName">
                <Select
                  onChange={handleSelectChange}
                  placeholder="select route">
                  {routes.map((route) => (
                    <Option key={route.routeName} value={route.routeName}>
                      {route.routeName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <div className="radioBtn">
                <Form.Item className="radioGroup" name="vehicleName">
                  <Radio.Group>
                    {vehicles.map((vehicle) => (
                      <Radio
                        key={vehicle.vehicleName}
                        value={vehicle.vehicleName}>
                        {vehicle.vehicleName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </div>
              <Form.Item className="btnLeft">
                <Button type="primary" className="saveBtn" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="rightGrid">
          <div className="routeTitle">
            <h2>Vehicle Route List</h2>
          </div>
          {/* <div className="routeSearch">
            <Input placeholder="Search by Route Name" onChange={handleSearch} />
          </div> */}
          <div className="routeTable">
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignVehicle;
