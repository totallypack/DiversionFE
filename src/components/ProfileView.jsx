import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getMyProfile } from "../managers/profileManager";
import { getMyInterests } from "../managers/userInterestManager";
import { getMyEvents } from "../managers/eventManager";
import NavBar from "./NavBar";
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
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is part of onboarding (no navbar should show)
  const isOnboarding = location.state?.onboarding === true;

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [profileData, interestsData, eventsData] = await Promise.all([
        getMyProfile(),
        getMyInterests(),
        getMyEvents(),
      ]);
      setProfile(profileData);
      setInterests(interestsData);
      setEvents(eventsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // Mark onboarding as complete
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
                  <h3>My Profile</h3>
                  <Button
                    color="primary"
                    outline
                    size="sm"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
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
                      {profile.location && (
                        <p className="text-muted">
                          <strong>Location:</strong> {profile.location}
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
                  <h4>My Interests</h4>
                  <Button
                    color="primary"
                    outline
                    size="sm"
                    onClick={handleAddMoreInterests}
                  >
                    Add More
                  </Button>
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
                  <Alert color="info">
                    No interests selected yet.{" "}
                    <Link to="/select-interests">Add some interests</Link> to
                    get personalized recommendations!
                  </Alert>
                )}
              </CardBody>
            </Card>

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
                        <Card
                          className="h-100 border"
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onClick={() => navigate(`/events/${event.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <CardBody>
                            <h6 className="mb-2">{event.title}</h6>
                            <div className="mb-2">
                              <Badge color={event.eventType === "Online" ? "success" : "primary"} className="me-1">
                                {event.eventType === "Online" ? "Online" : "In-Person"}
                              </Badge>
                              {event.interestTagName && (
                                <Badge color="info">{event.interestTagName}</Badge>
                              )}
                            </div>
                            <p className="text-muted small mb-1">
                              <strong>Start:</strong>{" "}
                              {new Date(event.startDateTime).toLocaleDateString()}{" "}
                              {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {event.description && (
                              <p className="text-muted small mb-0">
                                {event.description.length > 80
                                  ? `${event.description.substring(0, 80)}...`
                                  : event.description}
                              </p>
                            )}
                          </CardBody>
                        </Card>
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

            <Card>
              <CardBody>
                <h4>RSVP'd Events</h4>
                <div className="text-center py-4 text-muted">
                  <em>RSVP'd events will show here</em>
                </div>
              </CardBody>
            </Card>

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
