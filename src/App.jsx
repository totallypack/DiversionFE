  import { Routes, Route } from "react-router-dom";
  import "./App.css";
  import Home from "./components/Home";
  import Login from "./components/Login";
  import Register from "./components/Register";
  import ProfileSetup from "./components/ProfileSetup";
  import Dashboard from "./components/Dashboard";
  import InterestSelection from "./components/InterestSelection";
  import SubInterestSelection from "./components/SubInterestSelection";
  import SubInterestDetail from "./components/SubInterestDetail";
  import BrowseInterests from "./components/BrowseInterests";
  import ProfileView from "./components/ProfileView";
  import CreateEvent from "./components/CreateEvent";
  import EditEvent from "./components/EditEvent";
  import EventDetail from "./components/EventDetail";
  import Friends from "./components/Friends";

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
          <Route path="/browse-interests" element={<BrowseInterests />} />
          <Route path="/subinterest/:id" element={<SubInterestDetail />} />
          <Route path="/my-profile" element={<ProfileView />} />
          <Route path="/my-profile-view" element={<ProfileView />} />
          <Route path="/profile/:userId" element={<ProfileView />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </div>
    );
  }

  export default App;
