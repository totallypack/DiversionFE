  import { Routes, Route } from "react-router-dom";
  import "./App.css";
  import Home from "./components/Home";
  import Login from "./components/Login";
  import Register from "./components/Register";
  import ProfileSetup from "./components/ProfileSetup";

  function App() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileSetup />} />
        </Routes>
      </div>
    );
  }

  export default App;
