import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../managers/eventManager";
import NavBar from "./NavBar";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load event details. Please try again.");
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
                            {attendee.username}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <Button color="primary" onClick={() => navigate("/dashboard")}>
                    Return to Home
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
