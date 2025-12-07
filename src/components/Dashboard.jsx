import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Button, Badge, Spinner } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAllEvents } from "../managers/eventManager";
import NavBar from "./NavBar";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await getAllEvents();
      // Sort by start date (upcoming first)
      const sortedEvents = eventsData.sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
      );
      setEvents(sortedEvents);
      setLoadingEvents(false);
    } catch (error) {
      console.error("Failed to load events:", error);
      setLoadingEvents(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <Row className="mb-4">
          <Col md={8}>
            <h2 className="mb-0">Welcome to Your Dashboard</h2>
          </Col>
          <Col md={4} className="text-end">
            <Button color="primary" tag={Link} to="/browse-interests">
              Browse Interests
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h4">Your Interests</CardTitle>
                <p className="text-muted">
                  Interests and communities you follow will appear here
                </p>
                <div className="text-center py-4">
                  <em>Coming soon...</em>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <CardTitle tag="h4" className="mb-0">Upcoming Events</CardTitle>
                  <Button
                    color="primary"
                    outline
                    size="sm"
                    tag={Link}
                    to="/events/create"
                  >
                    Create Event
                  </Button>
                </div>

                {loadingEvents ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" size="sm" />
                  </div>
                ) : events.length > 0 ? (
                  <div>
                    {events.slice(0, 3).map((event) => (
                      <Card
                        key={event.id}
                        className="mb-2 border"
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onClick={() => navigate(`/events/${event.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <CardBody className="p-3">
                          <h6 className="mb-1">{event.title}</h6>
                          <div className="mb-1">
                            <Badge color={event.eventType === "Online" ? "success" : "primary"} className="me-1" pill>
                              {event.eventType === "Online" ? "Online" : "In-Person"}
                            </Badge>
                            {event.interestTagName && (
                              <Badge color="info" pill>{event.interestTagName}</Badge>
                            )}
                          </div>
                          <p className="text-muted small mb-0">
                            {new Date(event.startDateTime).toLocaleDateString()}{" "}
                            {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                    {events.length > 3 && (
                      <div className="text-center mt-2">
                        <small className="text-muted">
                          and {events.length - 3} more...
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <p>No upcoming events yet.</p>
                    <Button color="primary" size="sm" tag={Link} to="/events/create">
                      Create the first event
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h4">Recommended For You</CardTitle>
                <p className="text-muted">
                  Discover new interests and events
                </p>
                <div className="text-center py-4">
                  <em>Coming soon...</em>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
