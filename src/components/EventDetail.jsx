import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../managers/eventManager";
import { getMyProfile } from "../managers/profileManager";
import { getMyAttendanceForEvent, rsvpToEvent, updateRsvp, deleteRsvp } from "../managers/eventAttendeeManager";
import { formatDateTime } from "../utils/dateUtils";
import NavBar from "./NavBar";
import RsvpButtonGroup from "./RsvpButtonGroup";
import FullWidthSection from "./common/FullWidthSection";
import {
  Container,
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
      const [eventData, profileData] = await Promise.all([
        getEventById(id),
        getMyProfile(),
      ]);
      setEvent(eventData);
      setCurrentUser(profileData);

      try {
        const attendanceData = await getMyAttendanceForEvent(id);
        setMyAttendance(attendanceData);
      } catch (err) {
        setMyAttendance(null);
      }

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
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-light-grey)",
      }}>
        <NavBar />
        <div className="text-center">
          <Spinner color="dark" />
          <p className="mt-3">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-light-grey)",
      }}>
        <NavBar />
        <Container className="mt-5">
          <Alert color="danger" className="text-center">
            {error || "Event not found"}
          </Alert>
          <div className="text-center">
            <Button color="dark" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Container>
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

      {/* Event Header Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="130px 20px 60px"
        minHeight="300px"
        containerMaxWidth="900px"
      >
        <div className="text-center">
          <h1 className="mb-3">{event.title}</h1>
          <div className="mb-3">
            {event.interestTag && (
              <Badge
                color="info"
                className="me-2"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                onClick={() =>
                  navigate(`/subinterest/${event.interestTag.id}`)
                }
              >
                {event.interestTag.name}
              </Badge>
            )}
            <Badge
              color={event.eventType === "Online" ? "success" : "primary"}
              style={{ fontSize: "0.9rem" }}
            >
              {event.eventType === "Online" ? "Online Event" : "In-Person Event"}
            </Badge>
            {event.requiresRsvp && (
              <Badge color="warning" className="ms-2" style={{ fontSize: "0.9rem" }}>
                RSVP Required
              </Badge>
            )}
          </div>
          <p className="text-muted mb-0">
            <strong>Organizer:</strong> {event.organizerUsername}
          </p>
        </div>
      </FullWidthSection>

      {/* Event Details Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="400px"
        containerMaxWidth="900px"
      >
        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          {event.description && (
            <div className="mb-4">
              <h4 className="mb-3">Description</h4>
              <p className="text-muted">{event.description}</p>
            </div>
          )}

          <div className="mb-4">
            <h4 className="mb-3">Event Details</h4>
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
                  style={{ color: "var(--color-cyan)" }}
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
            <div>
              <h4 className="mb-3">
                Attendees ({event.attendeeCount} going)
              </h4>
              <ul className="list-unstyled">
                {event.attendees
                  .filter((a) => a.status === "Going")
                  .map((attendee) => (
                    <li key={attendee.id} className="mb-1">
                      <span
                        style={{ cursor: "pointer", color: "var(--color-black)" }}
                        onClick={() => navigate(`/profile/${attendee.userId}`)}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                          e.target.style.color = "var(--color-cyan)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                          e.target.style.color = "var(--color-black)";
                        }}
                      >
                        {attendee.username}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </FullWidthSection>

      {/* RSVP/Actions Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px 150px"
        minHeight="300px"
        containerMaxWidth="800px"
      >
        {isOrganizer ? (
          <div className="text-center">
            <h4 className="mb-4">Organizer Controls</h4>
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <Button color="dark" size="lg" onClick={handleEditEvent}>
                Edit Event
              </Button>
              <Button color="secondary" outline size="lg" onClick={handleDeleteEvent}>
                Delete Event
              </Button>
              <Button color="secondary" outline size="lg" onClick={() => navigate("/dashboard")}>
                Return to Home
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <h4 className="mb-3">
                {myAttendance ? "Your RSVP Status" : "RSVP to this Event"}
              </h4>
              <RsvpButtonGroup
                myAttendance={myAttendance}
                onRsvp={handleRsvp}
                loading={rsvpLoading}
              />
            </div>
            <div className="d-flex gap-3 flex-wrap justify-content-center mt-4">
              {myAttendance && (
                <Button
                  color="danger"
                  outline
                  size="lg"
                  onClick={handleCancelRsvp}
                  disabled={rsvpLoading}
                >
                  {rsvpLoading ? "Canceling..." : "Cancel RSVP"}
                </Button>
              )}
              <Button color="secondary" outline size="lg" onClick={() => navigate("/dashboard")}>
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
