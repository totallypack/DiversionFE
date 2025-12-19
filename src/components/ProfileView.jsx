import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { getMyProfile, getUserProfile } from "../managers/profileManager";
import { getMyInterests } from "../managers/userInterestManager";
import { getMyEvents, getRsvpdEvents } from "../managers/eventManager";
import { checkFriendship, addFriend, removeFriend } from "../managers/friendManager";
import { transformInterestsForDisplay } from "../utils/transformUtils";
import NavBar from "./NavBar";
import EventCard from "./EventCard";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
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
  const [friendLoading, setFriendLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        // Loading another user's profile
        const [otherProfile, friendStatus] = await Promise.all([
          getUserProfile(userId),
          checkFriendship(userId),
        ]);

        setProfile(otherProfile);
        setIsFriend(friendStatus);
        // Transform interests from SubInterestWithInterestDto to match UserInterestDto structure
        const transformedInterests = transformInterestsForDisplay(otherProfile.interests);
        setInterests(transformedInterests);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    setFriendLoading(true);
    try {
      await addFriend(userId);
      setIsFriend(true);
    } catch (err) {
      setError(err.message || "Failed to add friend.");
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
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }

  return (
    <>
      {!isOnboarding && <NavBar />}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={10}>
            {isOnboarding && (
              <Alert color="success" className="text-center">
                <h4>Profile Setup Complete!</h4>
                <p className="mb-0">
                  Review your profile and click Continue when you're ready
                </p>
              </Alert>
            )}

            {error && <Alert color="danger">{error}</Alert>}

            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3>{isOwnProfile ? "My Profile" : `${profile?.displayName || "User"}'s Profile`}</h3>
                  {isOwnProfile ? (
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      {isFriend ? (
                        <Button
                          color="warning"
                          outline
                          size="sm"
                          onClick={handleRemoveFriend}
                          disabled={friendLoading}
                        >
                          {friendLoading ? "Removing..." : "Remove Friend"}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          size="sm"
                          onClick={handleAddFriend}
                          disabled={friendLoading}
                        >
                          {friendLoading ? "Adding..." : "Add Friend"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {profile ? (
                  <Row>
                    <Col md={3} className="text-center mb-3">
                      {profile.profilePicUrl ? (
                        <img
                          src={profile.profilePicUrl}
                          alt="Profile"
                          className="rounded-circle"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                          style={{ width: "150px", height: "150px" }}
                        >
                          <span className="display-3 text-white">
                            {profile.displayName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </Col>
                    <Col md={9}>
                      <h4>{profile.displayName}</h4>
                      {(profile.city || profile.state) && (
                        <p className="text-muted">
                          <strong>Location:</strong>{" "}
                          {profile.city && profile.state
                            ? `${profile.city}, ${profile.state}`
                            : profile.city || profile.state}
                        </p>
                      )}
                      {profile.dob && (
                        <p className="text-muted">
                          <strong>Date of Birth:</strong>{" "}
                          {new Date(profile.dob).toLocaleDateString()}
                        </p>
                      )}
                      {profile.bio && (
                        <>
                          <h6 className="mt-3">Bio</h6>
                          <p>{profile.bio}</p>
                        </>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <Alert color="warning">
                    Profile not found.{" "}
                    <Link to="/profile">Create your profile</Link>
                  </Alert>
                )}
              </CardBody>
            </Card>

            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4>{isOwnProfile ? "My Interests" : "Interests"}</h4>
                  {isOwnProfile && (
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={handleAddMoreInterests}
                    >
                      Add More
                    </Button>
                  )}
                </div>

                {interests.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {interests.map((userInterest) => (
                      <Badge
                        key={userInterest.id}
                        color="primary"
                        pill
                        className="p-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/subinterest/${userInterest.subInterest.id}`)}
                      >
                        {userInterest.subInterest.name}
                        <small className="ms-1 text-white-50">
                          ({userInterest.subInterest.interest.name})
                        </small>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Alert color="info" fade={false}>
                    {isOwnProfile ? (
                      <>
                        No interests selected yet.{" "}
                        <Link to="/select-interests">Add some interests</Link> to
                        get personalized recommendations!
                      </>
                    ) : (
                      "This user hasn't added any interests yet."
                    )}
                  </Alert>
                )}
              </CardBody>
            </Card>

            {isOwnProfile && (
              <Card className="mb-4">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4>My Events</h4>
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={() => navigate("/events/create")}
                    >
                      Create Event
                    </Button>
                  </div>

                {events.length > 0 ? (
                  <Row className="g-3">
                    {events.map((event) => (
                      <Col key={event.id} md={6}>
                        <EventCard
                          event={event}
                          onClick={() => navigate(`/events/${event.id}`)}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Alert color="info" fade={false}>
                    You haven't created any events yet.{" "}
                    <Link to="/events/create">Create your first event</Link>!
                  </Alert>
                )}
              </CardBody>
            </Card>
            )}

            {isOwnProfile && (
              <Card>
                <CardBody>
                  <h4>RSVP'd Events</h4>
                  {rsvpdEvents.length > 0 ? (
                    <Row className="g-3">
                      {rsvpdEvents.map((event) => (
                        <Col key={event.id} md={6}>
                          <EventCard
                            event={event}
                            onClick={() => navigate(`/events/${event.id}`)}
                            showRsvpStatus={true}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert color="info" fade={false}>
                      You haven't RSVP'd to any events yet.{" "}
                      <Link to="/browse-interests">Find events to join</Link>!
                    </Alert>
                  )}
                </CardBody>
              </Card>
            )}

            {isOnboarding && (
              <div className="text-center mt-4">
                <Button
                  color="success"
                  size="lg"
                  onClick={handleContinue}
                >
                  Continue to Dashboard
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
