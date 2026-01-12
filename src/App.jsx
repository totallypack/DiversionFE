  import { Routes, Route } from "react-router-dom";
  import "./App.css";
  import Home from "./components/Home";
  import Login from "./components/Login";
  import SignUp from "./components/SignUp";
  import ProfileSetup from "./components/profiles/ProfileSetup";
  import Dashboard from "./components/Dashboard";
  import InterestSelection from "./components/interests/InterestSelection";
  import SubInterestSelection from "./components/interests/SubInterestSelection";
  import SubInterestDetail from "./components/interests/SubInterestDetail";
  import BrowseInterests from "./components/interests/BrowseInterests";
  import ProfileView from "./components/profiles/ProfileView";
  import CreateEvent from "./components/events/CreateEvent";
  import EditEvent from "./components/events/EditEvent";
  import EventDetail from "./components/events/EventDetail";
  import Friends from "./components/friends/Friends";
  import FriendRequests from "./components/friends/FriendRequests";

  function App() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/select-interests" element={<InterestSelection />} />
          <Route path="/select-subinterests/:interestId" element={<SubInterestSelection />} />
          <Route path="/browse-interests" element={<BrowseInterests />} />
          <Route path="/subinterest/:id" element={<SubInterestDetail />} />
          <Route path="/my-profile" element={<ProfileView />} />
          <Route path="/profile/:userId" element={<ProfileView />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friend-requests" element={<FriendRequests />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </div>
    );
  }

  export default App;
