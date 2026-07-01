import React, { useState } from "react";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Rahul Sharma",
      time: "09:00 AM",
      department: "Cardiology",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Priya Das",
      time: "10:00 AM",
      department: "Neurology",
      status: "Confirmed",
    },
    {
      id: 3,
      patient: "Amit Roy",
      time: "11:30 AM",
      department: "Orthopedics",
      status: "Completed",
    },
    {
      id: 4,
      patient: "Sneha Paul",
      time: "02:00 PM",
      department: "Dermatology",
      status: "Pending",
    },
  ]);

  const changeStatus = (id) => {
    setAppointments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let nextStatus = "Pending";

        if (item.status === "Pending") {
          nextStatus = "Confirmed";
        } else if (item.status === "Confirmed") {
          nextStatus = "Completed";
        }

        return {
          ...item,
          status: nextStatus,
        };
      })
    );
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#F59E0B";
      case "Confirmed":
        return "#10B981";
      default:
        return "#2563EB";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0F172A,#1E3A8A,#2563EB)",
        padding: "35px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563EB,#4F46E5)",
          borderRadius: "24px",
          padding: "35px",
          color: "white",
          marginBottom: "30px",
          boxShadow: "0 15px 35px rgba(0,0,0,.3)",
        }}
      >
        <h2
          style={{
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Welcome Back, Dr. John Smith
        </h2>

        <p
          style={{
            color: "#E2E8F0",
            marginBottom: 0,
          }}
        >
          You have 18 appointments scheduled for today.
        </p>
      </div>

      <div className="row g-4 mb-4">

        {[
          {
            title: "Total Patients",
            value: "120",
          },
          {
            title: "Appointments",
            value: "18",
          },
          {
            title: "Reports Pending",
            value: "7",
          },
          {
            title: "Emergency Cases",
            value: "2",
          },
        ].map((item, index) => (

          <div className="col-lg-3 col-md-6" key={index}>

            <div
              style={{
                background: "rgba(255,255,255,.08)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: "20px",
                padding: "25px",
                color: "white",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,.25)",
                transition: ".3s",
              }}
            >
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                }}
              >
                {item.value}
              </h1>

              <p
                style={{
                  color: "#CBD5E1",
                  marginBottom: 0,
                  fontSize: "17px",
                }}
              >
                {item.title}
              </p>

            </div>

          </div>

        ))}

      </div>

      <div className="row">

        <div className="col-lg-8">

          <div
            style={{
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "20px",
              padding: "25px",
              color: "white",
              boxShadow: "0 8px 25px rgba(0,0,0,.25)",
            }}
          >

            <h4
              style={{
                marginBottom: "25px",
                fontWeight: "600",
              }}
            >
              Today's Appointments
            </h4>

            <table
              className="table"
              style={{
                color: "white",
                "--bs-table-bg": "transparent",
                "--bs-table-color": "white",
                "--bs-table-border-color":
                  "rgba(255,255,255,.15)",
              }}
            >

              <thead>

                <tr>

                  <th>Patient</th>

                  <th>Time</th>

                  <th>Department</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>
                                {appointments.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        color: "#F8FAFC",
                        fontWeight: "500",
                      }}
                    >
                      {item.patient}
                    </td>

                    <td style={{ color: "#CBD5E1" }}>
                      {item.time}
                    </td>

                    <td style={{ color: "#CBD5E1" }}>
                      {item.department}
                    </td>

                    <td>
                      <button
                        onClick={() => changeStatus(item.id)}
                        style={{
                          background: statusColor(item.status),
                          color: "white",
                          border: "none",
                          padding: "8px 18px",
                          borderRadius: "30px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: ".3s",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,.25)",
                        }}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="col-lg-4">

          <div
            style={{
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "20px",
              padding: "25px",
              color: "white",
              marginBottom: "25px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.25)",
            }}
          >

            <h4
              style={{
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              Today's Schedule
            </h4>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,.12)",
              }}
            >
              <span>09:00 AM</span>
              <span>OPD Consultation</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,.12)",
              }}
            >
              <span>11:30 AM</span>
              <span>Ward Round</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid rgba(255,255,255,.12)",
              }}
            >
              <span>02:00 PM</span>
              <span>Surgery</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
              }}
            >
              <span>05:00 PM</span>
              <span>Staff Meeting</span>
            </div>

          </div>

          <div
            style={{
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: "20px",
              padding: "25px",
              color: "white",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.25)",
            }}
          >

            <h4
              style={{
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              Recent Patients
            </h4>

            {[
              "Rahul Sharma",
              "Priya Das",
              "Amit Roy",
              "Sneha Paul",
              "Arjun Sen",
            ].map((patient, index) => (
              <div
                key={index}
                style={{
                  padding: "12px 0",
                  borderBottom:
                    index !== 4
                      ? "1px solid rgba(255,255,255,.12)"
                      : "none",
                  color: "#F8FAFC",
                }}
              >
                {patient}
              </div>
            ))}
                      </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;