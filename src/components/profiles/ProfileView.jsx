import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { getMyProfile, getUserProfile } from "../../managers/profileManager";
import { getMyInterests } from "../../managers/userInterestManager";
import { getMyEvents, getRsvpdEvents, getUserEvents } from "../../managers/eventManager";
import { checkFriendship, addFriend, removeFriend, sendFriendRequest, getFriendRequestStatus, cancelFriendRequest, acceptFriendRequest } from "../../managers/friendManager";
import { transformInterestsForDisplay } from "../../utils/transformUtils";
import NavBar from "../NavBar";
import EventCard from "../events/EventCard";
import FullWidthSection from "../common/FullWidthSection";
import ReportButton from "../common/ReportButton";
import BlockButton from "../common/BlockButton";
import {
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Badge,
} from "reactstrap";

export default function ProfileView() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const [rsvpdEvents, setRsvpdEvents] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [requestStatus, setRequestStatus] = useState("none"); // "none", "sent", "received", "friends"
  const [requestId, setRequestId] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnboarding = location.state?.onboarding === true;
  const isOwnProfile = !userId || (currentUser && currentUser.userId === userId);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      const myProfile = await getMyProfile();
      setCurrentUser(myProfile);

      if (!userId || myProfile.userId === userId) {
        // Loading own profile
        const [interestsData, eventsData, rsvpdEventsData] = await Promise.all([
          getMyInterests(),
          getMyEvents(),
          getRsvpdEvents(),
        ]);
        setProfile(myProfile);
        setInterests(interestsData);
        setEvents(eventsData);
        setRsvpdEvents(rsvpdEventsData);
      } else {
        const [otherProfile, friendStatus, requestStatusData, otherUserEvents] = await Promise.all([
          getUserProfile(userId),
          checkFriendship(userId),
          getFriendRequestStatus(userId),
          getUserEvents(userId),
        ]);

        setProfile(otherProfile);
        setIsFriend(friendStatus);
        setRequestStatus(requestStatusData.status);
        setRequestId(requestStatusData.requestId);
        const transformedInterests = transformInterestsForDisplay(otherProfile.interests);
        setInterests(transformedInterests);
        setEvents(otherUserEvents);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setFriendLoading(true);
    try {
      const result = await sendFriendRequest(userId);
      setRequestStatus("sent");
      setRequestId(result.id);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to send friend request.");
    } finally {
      setFriendLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setFriendLoading(true);
    try {
      await cancelFriendRequest(requestId);
      setRequestStatus("none");
      setRequestId(null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to cancel request.");
    } finally {
      setFriendLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setFriendLoading(true);
    try {
      await acceptFriendRequest(requestId);
      setIsFriend(true);
      setRequestStatus("friends");
      setRequestId(null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to accept request.");
    } finally {
      setFriendLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }
    setFriendLoading(true);
    try {
      await removeFriend(userId);
      setIsFriend(false);
    } catch (err) {
      setError(err.message || "Failed to remove friend.");
    } finally {
      setFriendLoading(false);
    }
  };

  const handleContinue = () => {
    localStorage.setItem("onboardingComplete", "true");
    navigate("/dashboard");
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleAddMoreInterests = () => {
    navigate("/select-interests");
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
          <p className="mt-3">Loading profile...</p>
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
      {!isOnboarding && <NavBar />}

      {/* Profile Header */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding={isOnboarding ? "50px 20px 60px" : "130px 20px 60px"}
        minHeight="400px"
        containerMaxWidth="1200px"
      >
        {isOnboarding && (
          <Alert color="success" className="text-center mb-4" fade={false}>
            <h4>Profile Setup Complete!</h4>
            <p className="mb-0">
              Review your profile and click Continue when you're ready
            </p>
          </Alert>
        )}

        {error && <Alert color="danger" className="text-center mb-4" fade={false}>{error}</Alert>}

        <div style={{ position: "relative" }}>
          {/* Edit/Action Button */}
          {isOwnProfile ? (
            <div style={{ position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)" }}>
              <Button
                color="secondary"
                size="lg"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <div style={{ position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)" }}>
              {isFriend ? (
                <Button
                  color="secondary"
                  outline
                  size="lg"
                  onClick={handleRemoveFriend}
                  disabled={friendLoading}
                >
                  {friendLoading ? "Removing..." : "Remove Friend"}
                </Button>
              ) : requestStatus === "sent" ? (
                <Button
                  color="secondary"
                  outline
                  size="lg"
                  onClick={handleCancelRequest}
                  disabled={friendLoading}
                >
                  {friendLoading ? "Cancelling..." : "Cancel Request"}
                </Button>
              ) : requestStatus === "received" ? (
                <div className="d-flex gap-2">
                  <Button
                    color="dark"
                    size="lg"
                    onClick={handleAcceptRequest}
                    disabled={friendLoading}
                  >
                    {friendLoading ? "Accepting..." : "Accept Request"}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    size="lg"
                    onClick={() => navigate("/friend-requests")}
                  >
                    View Requests
                  </Button>
                </div>
              ) : (
                <Button
                  color="dark"
                  size="lg"
                  onClick={handleSendRequest}
                  disabled={friendLoading}
                >
                  {friendLoading ? "Sending..." : "Send Friend Request"}
                </Button>
              )}
            </div>
          )}

          {/* Report and Block Buttons for other users */}
          {!isOwnProfile && (
            <div style={{ position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)" }}>
              <div className="d-flex gap-2">
                <ReportButton
                  entityType="User"
                  entityId={userId}
                  entityLabel={`User: ${profile?.displayName || profile?.username}`}
                />
                <BlockButton
                  userId={userId}
                  username={profile?.displayName || profile?.username}
                  onBlockChange={(isBlocked) => {
                    if (isBlocked) {
                      // Navigate away when user is blocked
                      navigate("/dashboard");
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="text-center">
            <div className="mb-4">
              {profile?.profilePicUrl && !imageError ? (
                <img
                  src={profile.profilePicUrl}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    marginTop: "100px",
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "150px",
                    height: "150px",
                    marginTop: "100px",
                  }}
                >
                  <span className="display-3 text-white">
                    {profile?.displayName?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            <h2 className="mb-3">
              {profile?.displayName || "User"}
              {profile?.userType === "Business" && profile?.isVerified && (
                <span className="ms-2" style={{ fontSize: "1.2rem", color: "var(--color-cyan)" }} title="Verified Business">
                  ✓
                </span>
              )}
            </h2>
            {profile?.userType && profile.userType !== "Regular" && (
              <p className="text-muted mb-2">
                <strong>Account Type:</strong> {profile.userType === "Business" ? "Business Account" : "Caregiver Account"}
              </p>
            )}
            {profile?.userType === "Business" && profile?.businessName && (
              <p className="text-muted mb-2">
                <strong>Business:</strong> {profile.businessName}
                {profile.businessCategory && ` (${profile.businessCategory})`}
              </p>
            )}
            {profile?.userType === "Business" && profile?.businessWebsite && (
              <p className="text-muted mb-2">
                <strong>Website:</strong>{" "}
                <a href={profile.businessWebsite} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-cyan)" }}>
                  {profile.businessWebsite}
                </a>
              </p>
            )}
            {profile?.userType === "Business" && profile?.businessHours && (
              <p className="text-muted mb-2">
                <strong>Hours:</strong> {profile.businessHours}
              </p>
            )}
            {(profile?.city || profile?.state) && (
              <p className="text-muted mb-2">
                <strong>Location:</strong>{" "}
                {profile.city && profile.state
                  ? `${profile.city}, ${profile.state}`
                  : profile.city || profile.state}
              </p>
            )}
            {profile?.dob && (
              <p className="text-muted mb-3">
                <strong>Date of Birth:</strong>{" "}
                {new Date(profile.dob).toLocaleDateString()}
              </p>
            )}
            {profile?.bio && (
              <div className="mt-4 mx-auto" style={{ maxWidth: "600px" }}>
                <h5>Bio</h5>
                <p className="text-muted">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </FullWidthSection>

      {/* Interests Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="300px"
        containerMaxWidth="1200px"
      >
        <div className="mb-4">
          <h3>{isOwnProfile ? "My Interests" : "Interests"}</h3>
          {isOwnProfile && (
            <Button
              color="dark"
              outline
              className="mt-3"
              onClick={handleAddMoreInterests}
            >
              Add More Interests
            </Button>
          )}
        </div>

        {interests.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {interests.map((userInterest) => (
              <Badge
                key={userInterest.id}
                color="cyan"
                pill
                className="p-2"
                style={{
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  backgroundColor: "rgba(226, 226, 226, 0.8)",
                  color: "var(--color-black)"
                }}
                onClick={() => navigate(`/subinterest/${userInterest.subInterest.id}`)}
              >
                {userInterest.subInterest.name}
                <small className="ms-1" style={{ opacity: 0.7 }}>
                  ({userInterest.subInterest.interest.name})
                </small>
              </Badge>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-muted">
              {isOwnProfile ? (
                <>
                  No interests selected yet.{" "}
                  <Link to="/select-interests" style={{ color: "var(--color-hot-pink)" }}>
                    Add some interests
                  </Link>{" "}
                  to get personalized recommendations!
                </>
              ) : (
                "This user hasn't added any interests yet."
              )}
            </p>
          </div>
        )}
      </FullWidthSection>

      {/* Events Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px"
        minHeight="300px"
        containerMaxWidth="1200px"
      >
        <div className="mb-4">
          <h3>{isOwnProfile ? "My Events" : `${profile?.displayName}'s Events`}</h3>
          {isOwnProfile && (
            <Button
              color="dark"
              outline
              className="mt-3"
              onClick={() => navigate("/events/create")}
            >
              Create Event
            </Button>
          )}
        </div>

        {events.length > 0 ? (
          <Row className="g-3">
            {events.map((event) => (
              <Col key={event.id} md={6} lg={4}>
                <EventCard
                  event={event}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div>
            <p className="text-muted">
              {isOwnProfile ? (
                <>
                  You haven't created any events yet.{" "}
                  <Link to="/events/create" style={{ color: "var(--color-cyan)" }}>
                    Create your first event
                  </Link>!
                </>
              ) : (
                "This user hasn't created any events yet."
              )}
            </p>
          </div>
        )}
      </FullWidthSection>

      {/* RSVP'd Events Section - Only for own profile */}
      {isOwnProfile && (
        <FullWidthSection
          backgroundColor="var(--color-coral)"
          padding="80px 20px 150px"
          minHeight="300px"
          containerMaxWidth="1200px"
        >
          <div className="mb-4">
            <h3>RSVP'd Events</h3>
          </div>

          {rsvpdEvents.length > 0 ? (
            <Row className="g-3">
              {rsvpdEvents.map((event) => (
                <Col key={event.id} md={6} lg={4}>
                  <EventCard
                    event={event}
                    onClick={() => navigate(`/events/${event.id}`)}
                    showRsvpStatus={true}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              <p className="text-muted">
                You haven't RSVP'd to any events yet.{" "}
                <Link to="/browse-interests" style={{ color: "var(--color-cyan)" }}>
                  Find events to join
                </Link>!
              </p>
            </div>
          )}
        </FullWidthSection>
      )}

      {isOnboarding && (
        <div style={{
          backgroundColor: "var(--color-light-green)",
          padding: "50px 20px",
          textAlign: "center"
        }}>
          <Button
            color="dark"
            size="lg"
            onClick={handleContinue}
          >
            Continue to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
