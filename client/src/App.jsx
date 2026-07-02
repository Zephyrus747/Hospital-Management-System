import { useState } from "react";
import "./App.css";
import { Router, Sidebar } from "lucide-react";
import Navbar from "./components/Navbar";
import { PatientDashboard } from "./pages/patient/PatientDashboard";
// // import { Button } from "./components/ui/Button";
// import { Button } from "./components/ui/Button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PatientDashboard></PatientDashboard>
    </>
  );
}

export default App;
