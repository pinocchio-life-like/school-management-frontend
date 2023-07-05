import React from "react";
function ViewVehicle({ selectedVehicleData }) {
  return (
    <div className="viewVehicle">
      <div className="formWrapper">
        <div className="grid-container">
          <div className="grid-item">
            <div className="gridList">
              <ul>
                <li>
                  <p>
                    Vehicle Name:{" "}
                    <span>{selectedVehicleData?.vehicleName}</span>
                  </p>
                </li>
                <li>
                  <p>
                    Vehicle Model:{" "}
                    <span>{selectedVehicleData?.vehicleModel}</span>
                  </p>
                </li>
                <li>
                  <p>
                    Plate Number:{" "}
                    <span>{selectedVehicleData?.vehicleNumber}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-item">
            <div className="gridList">
              <ul>
                <li>
                  <p>
                    Year Made: <span>{selectedVehicleData?.yearMade}</span>
                  </p>
                </li>
                <li>
                  <p>
                    Seating Capacity:{" "}
                    <span>{selectedVehicleData?.capacity}</span>
                  </p>
                </li>
                <li>
                  <p>
                    Driver First Name:{" "}
                    <span>{selectedVehicleData?.driver?.fname}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-item">
            <div className="gridList">
              <ul>
                <li>
                  <p>
                    Driver last Name:{" "}
                    <span>{selectedVehicleData?.driver?.lname}</span>
                  </p>
                </li>
                <li>
                  <p>
                    License Numebr:{" "}
                    <span>{selectedVehicleData?.driver?.license}</span>
                  </p>
                </li>
                <li>
                  <p>
                    Phone Number:{" "}
                    <span>{selectedVehicleData?.driver?.phone}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewVehicle;
