import React, { useState } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

function EditVehicle({ selectedVehicle }) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  form.setFieldsValue(selectedVehicle);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    console.log("Image URL: ", imageUrl);

    try {
      const response = await axios.put(
        `http://localhost:8080/vehicle/${selectedVehicle.id}`,
        values
      );
      console.log("Updated vehicle data: ", response.data);
      message.success("Data updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url);
    }
  };

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76", // Replace with your actual upload URL
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleImageChange,
  };

  if (!selectedVehicle) {
    return <div>No vehicle selected</div>;
  }

  return (
    <div className="editVehicle">
      <div className="formWrapper">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="grid-container">
            <div className="grid-item">
              <Form.Item
                label="Vehicle Name"
                className="input"
                name="vehicleName">
                <Input placeholder="Please enter vehicle name" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Vehicle Model" name="vehicleModel">
                <Input placeholder="Please enter vehicle model" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Vehicle Plate Number" name="vehicleNumber">
                <Input placeholder="Please enter vehicle plate number" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Year Made" name="yearMade">
                <Input placeholder="Please enter year made" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Seating Capacity" name="capacity">
                <Input placeholder="Please enter vehicle seating capacity" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Driver First Name" name={["driver", "fname"]}>
                <Input placeholder="Please enter driver first name" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Driver Last Name" name={["driver", "lname"]}>
                <Input placeholder="Please enter driver last name" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="License Number" name={["driver", "license"]}>
                <Input placeholder="Please enter driver license number" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Driver Contact" name={["driver", "phone"]}>
                <Input placeholder="Please enter Driver Phone number" />
              </Form.Item>
            </div>

            <div className="grid-item">
              <Button type="primary" htmlType="submit" className="saveBtn">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditVehicle;
