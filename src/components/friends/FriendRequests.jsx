import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
} from "../../managers/friendManager";
import NavBar from "../NavBar";
import FullWidthSection from "../common/FullWidthSection";
import FriendRequestCard from "./FriendRequestCard";
import { Nav, NavItem, NavLink, Alert, Spinner } from "reactstrap";

export default function FriendRequests() {
  const [activeTab, setActiveTab] = useState("received");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const [received, sent] = await Promise.all([
        getReceivedRequests(),
        getSentRequests(),
      ]);
      setReceivedRequests(received);
      setSentRequests(sent);
      setLoading(false);
    } catch (err) {
      setError("Failed to load friend requests. Please try again.");
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setError("");
    setSuccess("");

    try {
      if (action === "accept") {
        await acceptFriendRequest(requestId);
        setSuccess("Friend request accepted!");
      } else if (action === "reject") {
        await rejectFriendRequest(requestId);
        setSuccess("Friend request rejected.");
      } else if (action === "cancel") {
        await cancelFriendRequest(requestId);
        setSuccess("Friend request cancelled.");
      }

      // Reload requests after action
      await loadRequests();
    } catch (err) {
      setError(err.message || "Failed to process request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-light-grey)",
      }}>
        <div className="text-center">
          <Spinner color="dark" />
          <p className="mt-3">Loading friend requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginBottom: "-20px",
      minHeight: "calc(100vh + 100px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <NavBar />

      {/* Header Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="130px 20px 60px"
        minHeight="250px"
        containerMaxWidth="1200px"
      >
        <div className="text-center">
          <h1 className="mb-3">Friend Requests</h1>
          <p className="lead mb-0">
            Manage your pending friend requests
          </p>
        </div>
      </FullWidthSection>

      {/* Content Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px 150px"
        minHeight="400px"
        containerMaxWidth="1200px"
      >
        {error && <Alert color="danger" fade={false}>{error}</Alert>}
        {success && <Alert color="success" fade={false}>{success}</Alert>}

        {/* Tabs */}
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={activeTab === "received" ? "active" : ""}
              onClick={() => setActiveTab("received")}
              style={{ cursor: "pointer" }}
            >
              Received ({receivedRequests.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "sent" ? "active" : ""}
              onClick={() => setActiveTab("sent")}
              style={{ cursor: "pointer" }}
            >
              Sent ({sentRequests.length})
            </NavLink>
          </NavItem>
        </Nav>

        {/* Received Requests */}
        {activeTab === "received" && (
          <div>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  type="received"
                  onAction={handleAction}
                />
              ))
            ) : (
              <div className="text-center p-5">
                <p className="text-muted">No pending friend requests</p>
              </div>
            )}
          </div>
        )}

        {/* Sent Requests */}
        {activeTab === "sent" && (
          <div>
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  type="sent"
                  onAction={handleAction}
                />
              ))
            ) : (
              <div className="text-center p-5">
                <p className="text-muted">No sent friend requests</p>
              </div>
            )}
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
