import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
// import { Button } from "./components/ui/Button";
import { Button } from "./components/ui/Button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="font-bold">hello</div>
      <Button>Book Appointment</Button>
    </>
  );
}

export default App;
