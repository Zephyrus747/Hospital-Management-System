import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg,#1e3c72,#2a5298)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#1e3c72" }}>🏥 HMS Login</h1>
        <p style={{ color: "#666" }}>Welcome Back</p>

        <input
          type="email"
          placeholder="Email"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
        />

        <select style={inputStyle}>
          <option>Select Role</option>
          <option>Admin</option>
          <option>Doctor</option>
          <option>Nurse</option>
          <option>Patient</option>
        </select>

        <button
          onClick={() => navigate("/nurse")}
          style={buttonStyle}
        >
          Login
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "#1e3c72",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Login;