import { useState, useMemo, useEffect } from "react";
import { Button, Form, Table, Space, Modal, message, Popconfirm } from "antd";
import Input from "antd/es/input/Input";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

function Route() {
  const [dataSource, setDataSource] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicleRoute");
        const data = response.data;
        const formattedData = data.map((route) => ({
          key: route._id,
          routeName: route.routeName,
        }));
        setDataSource([...formattedData]);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  const columns = [
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
    },
    {
      title: "Action",
      key: "action",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <EditModal record={record} />
          <Popconfirm
            title="Are you sure you want to delete this route?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const EditModal = ({ record }) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        await axios.put(
          `http://localhost:8080/vehicleRoute/${record.key}`,
          values
        );
        message.success("Route updated successfully");
        const response = await axios.get("http://localhost:8080/vehicleRoute");
        const data = response.data;
        const formattedData = data.map((route) => ({
          key: route._id,
          routeName: route.routeName,
        }));
        setDataSource([...formattedData]);
        setVisible(false);
      } catch (error) {
        console.error("Error updating route:", error);
        message.error("Error updating route");
      }
    };

    const handleCancel = () => {
      setVisible(false);
    };

    const onFinish = (values) => {
      console.log(values);
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
          onCancel={handleCancel}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              routeName: record.routeName,
            }}
          >
            <Form.Item
              name="routeName"
              label="Route Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a route name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`http://localhost:8080/vehicleRoute/${record.key}`);
      message.success("Route deleted successfully");
      const response = await axios.get("http://localhost:8080/vehicleRoute");
      const data = response.data;
      const formattedData = data.map((route) => ({
        key: route._id,
        routeName: route.routeName,
      }));
      setDataSource([...formattedData]);
    } catch (error) {
      console.error("Error deleting route:", error);
      message.error("Error deleting route");
    }
  };

  const handleSave = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/vehicleRoute",
        values
      );

      if (response.status === 201) {
        message.success("Route saved successfully");
        const newRoute = {
          key: response.data._id,
          routeName: values.routeName,
        };
        setDataSource([...dataSource, newRoute]); // add new route to dataSource
      } else {
        message.error("Error saving route");
      }
    } catch (error) {
      console.error("Error saving route:", error);
      message.error("Error saving route");
    }
  };

  return (
    <div className="routeContainer">
      <div className="routeGrid">
        <div className="leftGrid">
          <div className="routeTitle">
            <h2>Create Route</h2>
          </div>
          <div className="form">
            <Form layout="vertical" onFinish={handleSave}>
              <Form.Item label="Route Name" name="routeName">
                <Input placeholder="Enter the route name" />
              </Form.Item>
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
            <h2>Route List</h2>
          </div>

          <div className="routeTable">
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Route;
