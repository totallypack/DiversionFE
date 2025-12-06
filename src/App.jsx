  import { Routes, Route } from "react-router-dom";
  import "./App.css";
  import Home from "./components/Home";
  import Login from "./components/Login";
  import Register from "./components/Register";
  import ProfileSetup from "./components/ProfileSetup";
  import Dashboard from "./components/Dashboard";
  import InterestSelection from "./components/InterestSelection";
  import SubInterestSelection from "./components/SubInterestSelection";
  import ProfileView from "./components/ProfileView";

  function App() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/select-interests" element={<InterestSelection />} />
          <Route path="/select-subinterests/:interestId" element={<SubInterestSelection />} />
          <Route path="/my-profile" element={<ProfileView />} />
          <Route path="/my-profile-view" element={<ProfileView />} />
        </Routes>
      </div>
    );
  }

  export default App;
