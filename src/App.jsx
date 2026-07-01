import { useState } from "react";
import "./App.css";
// import { Button } from "./components/ui/Button";
import { Button } from "./components/ui/Button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold">
            Hospital Management System
          </h1>
          <p className="mt-2">
            If you can see the Navbar and Sidebar, everything is working!
          </p>
        </main>
      </div>
    </Router>
    </>
  );
}

export default App;
