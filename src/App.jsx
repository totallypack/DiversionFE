  import { Routes, Route } from "react-router-dom";
  import "./App.css";
  import Register from "./components/Register";

  function App() {
    return (
      <div className="App">
        <h1>Welcome to Diversion!</h1>
        <Routes>
          <Route path="/" element={<h2>Diversion - Special Interest Communities</h2>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  export default App;
