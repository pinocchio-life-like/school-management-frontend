import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../Vehicle/vehicle.css";
const localizer = momentLocalizer(moment);
const { Option } = Select;

function Maintenance() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleResponse = await axios.get(
          "http://localhost:8080/vehicle"
        );
        const vehicleData = vehicleResponse.data;
        setVehicles(vehicleData);

        const eventResponse = await axios.get(
          "http://localhost:8080/maintenance"
        );
        const eventData = eventResponse.data;
        // Map the events data to match the format expected by the calendar component
        const mappedData = eventData.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.vehicle.vehicleNumber,
        }));
        setEvents(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleScheduleClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  const handleModalFinish = async (values) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    const newEvent = {
      title: selectedVehicle ? selectedVehicle.vehicleNumber : "",
      start,
      end,
      vehicle: selectedVehicle._id, // Reference to the Vehicle document
      remark: values.remark,
    };

    try {
      // Send a POST request to the server to create a new maintenance event
      const response = await axios.post(
        "http://localhost:8080/maintenance",
        newEvent
      );
      const createdEvent = response.data;

      // Update the events array with the new event
      setEvents([...events, createdEvent]);
      setIsModalVisible(false);
      setSelectedEvent(null);
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error creating maintenance event:", error);
      // Show an error message to the user
    }
  };
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSelectedVehicle(event.vehicle);
    setIsModalVisible(true);
  };

  const handleEditEvent = (values) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    const updatedEvent = {
      ...selectedEvent,
      title: selectedVehicle
        ? selectedVehicle.vehicleNumber
        : "Unknown Vehicle",
      start,
      end,
      vehicle: selectedVehicle,
      remark: values.remark,
    };

    const updatedEvents = events.map((event) =>
      event === selectedEvent ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setIsModalVisible(false);
    setSelectedEvent(null);
    setSelectedVehicle(null);
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((event) => event !== selectedEvent);

    setEvents(updatedEvents);
    setIsModalVisible(false);
    setSelectedEvent(null);
    setSelectedVehicle(null);
  };

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < moment().startOf("day");
  };

  const handleVehicleSelect = (value) => {
    const vehicle = vehicles.find((v) => v.vehicleNumber === value);
    setSelectedVehicle(vehicle);
  };

  return (
    <>
      <div className="transport-container">
        <div className="header-action">
          <div className="header-title">.</div>
          <div className="header-btn">
            <Button
              type="primary"
              onClick={handleScheduleClick}
              className="scheduleBtn"
            >
              Schedule
            </Button>
          </div>
        </div>
        <div className="calender-cont">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleEventSelect}
          />
        </div>
      </div>
      <Modal
        title={selectedEvent ? "Edit Maintenance" : "Schedule Maintenance"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          onFinish={selectedEvent ? handleEditEvent : handleModalFinish}
          layout="vertical"
        >
          <Form.Item
            name="vehicleNumber"
            label="Select Vehicle"
            rules={[{ required: true, message: "Please select vehicle" }]}
          >
            <Select onChange={handleVehicleSelect}>
              {vehicles.map((vehicle) => (
                <Option
                  key={vehicle.vehicleNumber}
                  value={vehicle.vehicleNumber}
                >
                  {vehicle.vehicleNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Schedule Start Date"
            rules={[
              { required: true, message: "Please enter schedule start date" },
            ]}
            initialValue={selectedEvent ? moment(selectedEvent.start) : null}
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Schedule End Date"
            rules={[
              { required: true, message: "Please enter schedule end date" },
            ]}
            initialValue={selectedEvent ? moment(selectedEvent.end) : null}
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item label="Remark" name="remark">
            <Input placeholder="remark" />
          </Form.Item>
          <Form.Item>
            <div className="btnStacks">
              <Button type="primary" htmlType="submit" className="submitBtn2">
                {selectedEvent ? "Update" : "Submit"}
              </Button>
              {selectedEvent && (
                <Button
                  onClick={handleDeleteEvent}
                  danger
                  className="deleteBtn2"
                >
                  Delete
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Maintenance;
