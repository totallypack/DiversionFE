import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCommunity,
  getCommunityMembers,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
} from "../../managers/communityManager";
import NavBar from "../NavBar";
import FullWidthSection from "../common/FullWidthSection";
import CommunityForum from "./CommunityForum";
import {
  Button,
  Alert,
  Spinner,
  Badge,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default function CommunityDetail() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("forum");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCommunity();
  }, [id]);

  const loadCommunity = async () => {
    try {
      const [communityData, membersData] = await Promise.all([
        getCommunity(id),
        getCommunityMembers(id),
      ]);
      setCommunity(communityData);
      setMembers(membersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load community. Please try again.");
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      await joinCommunity(id);
      await loadCommunity();
    } catch (err) {
      setError(err.message || "Failed to join community.");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this community?")) {
      return;
    }
    try {
      await leaveCommunity(id);
      navigate("/communities");
    } catch (err) {
      setError(err.message || "Failed to leave community.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this community? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await deleteCommunity(id);
      navigate("/communities");
    } catch (err) {
      setError(err.message || "Failed to delete community.");
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
          <p className="mt-3">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5">
          <Alert color="danger">Community not found.</Alert>
          <Button onClick={() => navigate("/communities")}>
            Back to Communities
          </Button>
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
          <div className="mb-3">
            <h1 className="mb-2">
              {community.name}
              {community.isPrivate && (
                <Badge color="secondary" className="ms-2">
                  Private
                </Badge>
              )}
            </h1>
            {community.interestName && (
              <Badge color="info" className="mb-2">
                {community.interestName}
              </Badge>
            )}
          </div>

          {community.description && (
            <p className="lead mb-3">{community.description}</p>
          )}

          <p className="text-muted mb-3">
            Created by {community.creatorDisplayName || community.creatorUsername} •{" "}
            {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-center">
            {community.isMember ? (
              <>
                {community.userRole === "Owner" && (
                  <Button color="danger" outline onClick={handleDelete}>
                    Delete Community
                  </Button>
                )}
                {community.userRole !== "Owner" && (
                  <Button color="secondary" outline onClick={handleLeave}>
                    Leave Community
                  </Button>
                )}
              </>
            ) : (
              !community.isPrivate && (
                <Button color="dark" onClick={handleJoin}>
                  Join Community
                </Button>
              )
            )}
            <Button
              color="secondary"
              outline
              onClick={() => navigate("/communities")}
            >
              Back to Communities
            </Button>
          </div>
        </div>
      </FullWidthSection>

      {/* Content Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px 150px"
        minHeight="600px"
        containerMaxWidth="1200px"
      >
        {error && <Alert color="danger" fade={false}>{error}</Alert>}

        {community.isMember ? (
          <>
            {/* Tabs */}
            <Nav tabs className="mb-4">
              <NavItem>
                <NavLink
                  className={activeTab === "forum" ? "active" : ""}
                  onClick={() => setActiveTab("forum")}
                  style={{ cursor: "pointer" }}
                >
                  Forum
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "members" ? "active" : ""}
                  onClick={() => setActiveTab("members")}
                  style={{ cursor: "pointer" }}
                >
                  Members ({members.length})
                </NavLink>
              </NavItem>
            </Nav>

            {/* Forum Tab */}
            {activeTab === "forum" && (
              <CommunityForum communityId={id} />
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div>
                <h4 className="mb-3">Members</h4>
                <ListGroup>
                  {members.map((member) => (
                    <ListGroupItem
                      key={member.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{member.displayName || member.username}</strong>
                        <div className="small text-muted">@{member.username}</div>
                      </div>
                      <Badge
                        color={
                          member.role === "Owner"
                            ? "primary"
                            : member.role === "Moderator"
                            ? "info"
                            : "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">
              {community.isPrivate
                ? "This is a private community. You need an invitation to join."
                : "Join this community to participate in discussions and view members."}
            </p>
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
