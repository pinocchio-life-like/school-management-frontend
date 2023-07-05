import { Button, Form, Input, Upload, message } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

function AddVehicle() {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    console.log("Image URL: ", imageUrl);

    // Create the driver object
    const driver = {
      fname: values.fname,
      lname: values.lname,
      license: values.license,
      phone: values.phone,
    };

    // Prepare the data to be sent
    const vehicleData = {
      vehicleName: values.vehicleName,
      vehicleModel: values.vehicleModel,
      vehicleNumber: values.vehicleNumber,
      yearMade: values.yearMade,
      capacity: values.capacity,
      driver,
      imageUrl,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/vehicles/register",
        vehicleData
      );
      console.log("Response:", response);

      // Show success message
      message.success("Vehicle created successfully!");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
        // Vehicle already exists in the database
        message.error("Vehicle is already registered.");
      } else {
        // Other error
        message.error("Failed to create vehicle.");
      }
    }
  };

  return (
    <div className="addVehicleCont">
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
              <Form.Item label="Driver First Name" name="fname">
                <Input placeholder="Please enter driver first name" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Driver Last Name" name="lname">
                <Input placeholder="Please enter driver last name" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="License Number" name="license">
                <Input placeholder="Please enter driver license number" />
              </Form.Item>
            </div>
            <div className="grid-item">
              <Form.Item label="Driver Contact" name="phone">
                <Input placeholder="Please enter Driver Phone number" />
              </Form.Item>
            </div>

            <div className="grid-item">
              <Button type="primary" className="saveBtn" htmlType="submit">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddVehicle;
