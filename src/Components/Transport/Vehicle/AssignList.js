import React, { useState, useEffect } from 'react';
import { Table, Input, Space, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const columns = [
  {
    title: 'Route ID',
    dataIndex: 'routeId',
    key: 'routeId',
  },
  {
    title: 'Vehicle Registration Number',
    dataIndex: 'vehicleRegistrationNumber',
    key: 'vehicleRegistrationNumber',
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search vehicle registration number"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <button onClick={confirm} type="button">Search</button>
          <button onClick={clearFilters} type="button">Reset</button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record.vehicleRegistrationNumber.toLowerCase().includes(value.toLowerCase()),
    render: (text, record) => record.vehicleRegistrationNumber,
  },
  {
    title: 'Driver Name',
    dataIndex: 'driverName',
    key: 'driverName',
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search driver name"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <button onClick={confirm} type="button">Search</button>
          <button onClick={clearFilters} type="button">Reset</button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record.driverName.toLowerCase().includes(value.toLowerCase()),
    render: (text, record) => record.driverName,
  },
  {
    title: 'Driver License Number',
    dataIndex: 'driverLicenseNumber',
    key: 'driverLicenseNumber',
  },
  {
    title: 'Driver Contact Number',
    dataIndex: 'driverContactNumber',
    key: 'driverContactNumber',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const VehicleAssignmentsTable = () => {
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchColumn, setSearchColumn] = useState('');

  useEffect(() => {
    axios.get('/api/vehicleAssignments')
      .then(response => {
        const assignments = response.data.map(a => ({
          ...a,
          driverName: '',
          driverLicenseNumber: '',
          driverContactNumber: ''
        }));
        setVehicleAssignments(assignments);
        fetchDriverInfo(assignments);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const fetchDriverInfo = (assignments) => {
    const vehicleIds = assignments.map(a => a.vehicleId);
    axios.get(`/api/vehicles?ids=${vehicleIds.join(',')}`)
      .then(response => {
        const vehicles = response.data;
        const updatedAssignments = assignments.map(a => {
          const vehicle = vehicles.find(v => v._id === a.vehicleId);
          if (vehicle) {
            return {
              ...a,
              driverName: vehicle.driver.name,
              driverLicenseNumber: vehicle.driver.licenseNumber,
              driverContactNumber: vehicle.driver.contactNumber
            };
          } else {
            return a;
          }
        });
        setVehicleAssignments(updatedAssignments);
      })
      .catch(error => {
        console.log(error);
        notification.error({
          message: 'Failed to fetch driver information for vehicles'
        });
      });
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const searchInput = (
    <Input
      placeholder="Search"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      onPressEnter={() => {
        const dataIndex = searchColumn === 'vehicleRegistrationNumber' ? 'vehicleRegistrationNumber' : 'driverName';
        setVehicleAssignments(prevAssignments => {
          const filteredAssignments = prevAssignments.filter((assignment) => {
            return assignment[dataIndex].toLowerCase().includes(searchText.toLowerCase());
          });
          return filteredAssignments;
        });
      }}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
  );

  const filterDropdown = (filterDropdownProps, dataIndex) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={filterDropdownProps.selectedKeys[0]}
        onChange={(e) => {
          filterDropdownProps.setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        onPressEnter={() => handleSearch(filterDropdownProps.selectedKeys, filterDropdownProps.confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <button onClick={() => handleSearch(filterDropdownProps.selectedKeys, filterDropdownProps.confirm, dataIndex)} type="button">Search</button>
        <button onClick={() => handleReset(filterDropdownProps.clearFilters)} type="button">Reset</button>
      </Space>
    </div>
  );

  columns[1].filterDropdown = (filterDropdownProps) => filterDropdown(filterDropdownProps, 'vehicleRegistrationNumber');
  columns[1].filterIcon = <SearchOutlined />;
  columns[1].onFilter = (value, record) => record.vehicleRegistrationNumber.toLowerCase().includes(value.toLowerCase());
  columns[1].render = (text) => <div>{text}</div>;

  columns[2].filterDropdown = (filterDropdownProps) => filterDropdown(filterDropdownProps, 'driverName');
  columns[2].filterIcon = <SearchOutlined />;
  columns[2].onFilter = (value, record) => record.driverName.toLowerCase().includes(value.toLowerCase());
  columns[2].render = (text) => <div>{text}</div>;

  return (
    <>
      <Input.Group compact style={{ marginBottom: 8 }}>
        {searchInput}
      </Input.Group>
      <Table columns={columns} dataSource={vehicleAssignments} />
    </>
  );
};

export default VehicleAssignmentsTable;