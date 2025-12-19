import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../managers/eventManager";
import { getMyProfile } from "../managers/profileManager";
import { getMyAttendanceForEvent, rsvpToEvent, updateRsvp, deleteRsvp } from "../managers/eventAttendeeManager";
import { formatDateTime } from "../utils/dateUtils";
import NavBar from "./NavBar";
import RsvpButtonGroup from "./RsvpButtonGroup";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Spinner,
  Button,
  Badge,
} from "reactstrap";

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [myAttendance, setMyAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const [eventData, profileData, attendanceData] = await Promise.all([
        getEventById(id),
        getMyProfile(),
        getMyAttendanceForEvent(id),
      ]);
      setEvent(eventData);
      setCurrentUser(profileData);
      setMyAttendance(attendanceData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load event details. Please try again.");
      setLoading(false);
    }
  };

  const isOrganizer = currentUser && event && currentUser.userId === event.organizerId;

  const handleRsvp = async (status) => {
    setRsvpLoading(true);
    try {
      if (myAttendance) {
        await updateRsvp(myAttendance.id, status);
      } else {
        await rsvpToEvent(id, status);
      }
      await loadEvent();
    } catch (err) {
      setError(err.message || "Failed to RSVP. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async () => {
    if (!myAttendance) return;
    setRsvpLoading(true);
    try {
      await deleteRsvp(myAttendance.id);
      await loadEvent();
    } catch (err) {
      setError(err.message || "Failed to cancel RSVP. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleEditEvent = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    try {
      await deleteEvent(id);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="mt-5 text-center">
          <Spinner color="primary" />
          <p className="mt-3">Loading event...</p>
        </Container>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <NavBar />
        <Container className="mt-5">
          <Alert color="danger" fade={false}>
            {error || "Event not found"}
          </Alert>
          <Button color="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="mb-4">
              <CardBody>
                <div className="mb-4">
                  <h2 className="mb-3">{event.title}</h2>
                  <div className="mb-3">
                    {event.interestTag && (
                      <Badge
                        color="info"
                        className="me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/subinterest/${event.interestTag.id}`)
                        }
                      >
                        {event.interestTag.name}
                      </Badge>
                    )}
                    <Badge color={event.eventType === "Online" ? "success" : "primary"}>
                      {event.eventType === "Online" ? "Online Event" : "In-Person Event"}
                    </Badge>
                    {event.requiresRsvp && (
                      <Badge color="warning" className="ms-2">
                        RSVP Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted mb-1">
                    <strong>Organizer:</strong> {event.organizerUsername}
                  </p>
                </div>

                {event.description && (
                  <div className="mb-4">
                    <h5 className="mb-2">Description</h5>
                    <p className="text-muted">{event.description}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h5 className="mb-3">Event Details</h5>
                  <div className="mb-2">
                    <strong>Start:</strong>{" "}
                    <span className="text-muted">
                      {formatDateTime(event.startDateTime)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>End:</strong>{" "}
                    <span className="text-muted">
                      {formatDateTime(event.endDateTime)}
                    </span>
                  </div>

                  {event.eventType === "Online" && event.meetingUrl && (
                    <div className="mb-2">
                      <strong>Meeting Link:</strong>{" "}
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        {event.meetingUrl}
                      </a>
                    </div>
                  )}

                  {event.eventType === "InPerson" && (event.streetAddress || event.city || event.state) && (
                    <div className="mb-2">
                      <strong>Location:</strong>{" "}
                      <span className="text-muted">
                        {event.streetAddress && (
                          <>
                            {event.streetAddress}
                            <br />
                          </>
                        )}
                        {event.city && event.state
                          ? `${event.city}, ${event.state}`
                          : event.city || event.state}
                      </span>
                    </div>
                  )}
                </div>

                {event.attendees && event.attendees.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">
                      Attendees ({event.attendeeCount} going)
                    </h5>
                    <ul className="list-unstyled">
                      {event.attendees
                        .filter((a) => a.status === "Going")
                        .map((attendee) => (
                          <li key={attendee.id} className="mb-1">
                            <span
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                              onClick={() => navigate(`/profile/${attendee.userId}`)}
                              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                            >
                              {attendee.username}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  {isOrganizer ? (
                    //organizer controls
                    <div className="d-flex gap-2 flex-wrap">
                      <Button color="primary" onClick={handleEditEvent}>
                        Edit Event
                      </Button>
                      <Button color="danger" outline onClick={handleDeleteEvent}>
                        Delete Event
                      </Button>
                      <Button color="secondary" outline onClick={() => navigate("/dashboard")}>
                        Return to Home
                      </Button>
                    </div>
                  ) : (
                    //non-organizer controls (RSVP)
                    <div>
                      <div className="mb-3">
                        <h6 className="mb-2">
                          {myAttendance ? "Your RSVP Status" : "RSVP to this Event"}
                        </h6>
                        <RsvpButtonGroup
                          myAttendance={myAttendance}
                          onRsvp={handleRsvp}
                          loading={rsvpLoading}
                        />
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        {myAttendance && (
                          <Button
                            color="danger"
                            outline
                            onClick={handleCancelRsvp}
                            disabled={rsvpLoading}
                            size="sm"
                          >
                            {rsvpLoading ? "Canceling..." : "Cancel RSVP"}
                          </Button>
                        )}
                        <Button color="secondary" outline onClick={() => navigate("/dashboard")} size="sm">
                          Return to Home
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
