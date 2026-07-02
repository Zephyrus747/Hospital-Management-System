import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");

      const user = res.data.find(
        (u) =>
          u.username === username &&
          u.password === password
      );

      if (!user) {
        alert("Invalid Username or Password");
        return;
      }

      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "doctor":
          navigate("/doctor");
          break;

        case "nurse":
          navigate("/nurse");
          break;

        case "patient":
          navigate("/patient");
          break;

        default:
          alert("Invalid Role");
      }
    } catch (err) {
      console.log(err);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1e3c72,#2a5298)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "430px",
          background: "#fff",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            color: "#1e3c72",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          🏥 HMS Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Login to continue
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={login}
          style={buttonStyle}
        >
          Login
        </button>

        <div
          style={{
            marginTop: "25px",
            background: "#f5f7fa",
            borderRadius: "10px",
            padding: "15px",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#1e3c72",
              marginBottom: "12px",
            }}
          >
            Demo Login Credentials
          </h3>

          <div style={{ marginBottom: "10px" }}>
            <strong>👨‍💼 Admin</strong>
            <br />
            Username: <b>admin</b>
            <br />
            Password: <b>admin123</b>
          </div>

          <hr />

          <div style={{ margin: "10px 0" }}>
            <strong>👨‍⚕️ Doctor</strong>
            <br />
            Username: <b>jdorian</b>
            <br />
            Password: <b>doctor123</b>
          </div>

          <hr />

          <div style={{ margin: "10px 0" }}>
            <strong>👩‍⚕️ Nurse</strong>
            <br />
            Username: <b>cespinosa</b>
            <br />
            Password: <b>nurse123</b>
          </div>

          <hr />

          <div style={{ marginTop: "10px" }}>
            <strong>🧑 Patient</strong>
            <br />
            Username: <b>jsmith</b>
            <br />
            Password: <b>patient123</b>
          </div>
        </div>
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
  boxSizing: "border-box",
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
  fontWeight: "bold",
};

export default Login;