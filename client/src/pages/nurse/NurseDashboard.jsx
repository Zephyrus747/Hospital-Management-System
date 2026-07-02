const NurseDashboard = () => {
  return (
    <div
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h1>👩‍⚕️ Nurse Dashboard</h1>

        <button
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <Card title="Assigned Patients" value="42" color="#0d6efd" />
        <Card title="Shift" value="Morning" color="#198754" />
        <Card title="Pending Tasks" value="12" color="#dc3545" />
        <Card title="Rooms Covered" value="8" color="#fd7e14" />
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Today's Schedule</h2>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#0d6efd", color: "#fff" }}>
              <th style={{ padding: "12px" }}>Patient</th>
              <th>Room</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={cell}>Rahul Sharma</td>
              <td style={cell}>101</td>
              <td style={cell}>9:00 AM</td>
            </tr>

            <tr>
              <td style={cell}>Priya Das</td>
              <td style={cell}>204</td>
              <td style={cell}>11:00 AM</td>
            </tr>

            <tr>
              <td style={cell}>Amit Roy</td>
              <td style={cell}>305</td>
              <td style={cell}>2:00 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div
    style={{
      background: color,
      color: "#fff",
      padding: "25px",
      borderRadius: "12px",
      textAlign: "center",
    }}
  >
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

const cell = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default NurseDashboard;