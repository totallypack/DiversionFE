import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPublicCommunities,
  getMyCommunities,
  joinCommunity,
  leaveCommunity,
} from "../../managers/communityManager";
import NavBar from "../NavBar";
import FullWidthSection from "../common/FullWidthSection";
import CommunityCard from "./CommunityCard";
import { Row, Col, Nav, NavItem, NavLink, Alert, Spinner, Button } from "reactstrap";

export default function CommunityList() {
  const [activeTab, setActiveTab] = useState("all");
  const [publicCommunities, setPublicCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const [publicData, myData] = await Promise.all([
        getPublicCommunities(),
        getMyCommunities(),
      ]);
      setPublicCommunities(publicData);
      setMyCommunities(myData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load communities. Please try again.");
      setLoading(false);
    }
  };

  const handleJoin = async (communityId) => {
    try {
      await joinCommunity(communityId);
      await loadCommunities();
    } catch (err) {
      setError(err.message || "Failed to join community.");
    }
  };

  const handleLeave = async (communityId) => {
    if (!window.confirm("Are you sure you want to leave this community?")) {
      return;
    }
    try {
      await leaveCommunity(communityId);
      await loadCommunities();
    } catch (err) {
      setError(err.message || "Failed to leave community.");
    }
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/communities/${communityId}`);
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
          <p className="mt-3">Loading communities...</p>
        </div>
      </div>
    );
  }

  const displayedCommunities = activeTab === "all" ? publicCommunities : myCommunities;

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
          <h1 className="mb-3">Communities</h1>
          <p className="lead mb-3">
            Join communities to connect with people who share your interests
          </p>
          <Button
            color="dark"
            onClick={() => navigate("/communities/create")}
          >
            Create Community
          </Button>
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

        {/* Tabs */}
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
              style={{ cursor: "pointer" }}
            >
              All Communities ({publicCommunities.length})
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "my" ? "active" : ""}
              onClick={() => setActiveTab("my")}
              style={{ cursor: "pointer" }}
            >
              My Communities ({myCommunities.length})
            </NavLink>
          </NavItem>
        </Nav>

        {/* Community Grid */}
        {displayedCommunities.length > 0 ? (
          <Row className="g-3">
            {displayedCommunities.map((community) => (
              <Col key={community.id} md={6} lg={4}>
                <CommunityCard
                  community={community}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                  onClick={handleCommunityClick}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">
              {activeTab === "all"
                ? "No communities available yet. Be the first to create one!"
                : "You haven't joined any communities yet. Explore communities above!"}
            </p>
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
