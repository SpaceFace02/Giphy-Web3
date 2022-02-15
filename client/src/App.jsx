import { useState } from "react";
import "./App.css";
import {
  Navbar,
  Footer,
  Loader,
  Services,
  Transactions,
  Welcome,
} from "./components";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Transactions />
    </div>
  );
}

export default App;
