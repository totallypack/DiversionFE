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
  import CommunityList from "./components/communities/CommunityList";
  import CreateCommunity from "./components/communities/CreateCommunity";
  import CommunityDetail from "./components/communities/CommunityDetail";
  import MessageCenter from "./components/messages/MessageCenter";
  import SearchResults from "./components/search/SearchResults";
  import BlockedUsers from "./components/settings/BlockedUsers";
  import AdminDashboard from "./components/admin/AdminDashboard";
  import AdminRoute from "./components/admin/AdminRoute";
  import { MyRecipientsView } from "./components/caregiver/MyRecipientsView";
  import { MyCaregiversView } from "./components/caregiver/MyCaregiversView";
  import { CaregiverRequestInbox } from "./components/caregiver/CaregiverRequestInbox";
  import { CaregiverRequestSent } from "./components/caregiver/CaregiverRequestSent";

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
          <Route path="/search" element={<SearchResults />} />
          <Route path="/settings/blocked-users" element={<BlockedUsers />} />
          <Route path="/my-profile" element={<ProfileView />} />
          <Route path="/profile/:userId" element={<ProfileView />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friend-requests" element={<FriendRequests />} />
          <Route path="/communities" element={<CommunityList />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
          <Route path="/communities/:id" element={<CommunityDetail />} />
          <Route path="/messages" element={<MessageCenter />} />
          <Route path="/messages/:userId" element={<MessageCenter />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/caregiver/recipients" element={<MyRecipientsView />} />
          <Route path="/caregiver/my-caregivers" element={<MyCaregiversView />} />
          <Route path="/caregiver/requests/received" element={<CaregiverRequestInbox />} />
          <Route path="/caregiver/requests/sent" element={<CaregiverRequestSent />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    );
  }

  export default App;
