import { useState, useEffect } from "react";
import { Container, Button, Spinner, Badge } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAllEvents } from "../managers/eventManager";
import { getFriendActivityFeed } from "../managers/activityManager";
import { sortEventsByDate } from "../utils/transformUtils";
import NavBar from "./NavBar";
import ActivityFeedItem from "./ActivityFeedItem";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
    loadActivities();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await getAllEvents();
      const sortedEvents = sortEventsByDate(eventsData);
      setEvents(sortedEvents);
      setLoadingEvents(false);
    } catch (error) {
      console.error("Failed to load events:", error);
      setLoadingEvents(false);
    }
  };

  const loadActivities = async () => {
    try {
      const activitiesData = await getFriendActivityFeed();
      setActivities(activitiesData);
      setLoadingActivities(false);
    } catch (error) {
      console.error("Failed to load activities:", error);
      setLoadingActivities(false);
    }
  };

  const username = localStorage.getItem("username") || "Friend";

  return (
    <>
      <NavBar />

      {/* Welcome Section - Purple */}
      <section style={{
        backgroundColor: "var(--color-purple)",
        width: "100vw",
        margin: 0,
        padding: "100px 20px 60px",
        minHeight: "250px",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw"
      }}>
        <Container style={{ maxWidth: "900px", textAlign: "center" }}>
          <h1 className="mb-3">Hello, {username}!</h1>
          <p className="lead mb-0">
            Welcome back! Here's what's happening in your community today.
          </p>
        </Container>
      </section>

      {/* Friend Activity Section - Light Grey */}
      <section style={{
        backgroundColor: "var(--color-light-grey)",
        width: "100vw",
        margin: 0,
        padding: "80px 20px",
        minHeight: "400px",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw"
      }}>
        <Container style={{ maxWidth: "1200px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Friend Activity</h2>
            <Button
              color="dark"
              outline
              size="sm"
              tag={Link}
              to="/friends"
            >
              View All Friends
            </Button>
          </div>

          {loadingActivities ? (
            <div className="text-center py-5">
              <Spinner color="dark" />
              <p className="mt-3">Loading activity...</p>
            </div>
          ) : activities.length > 0 ? (
            <div style={{
              backgroundColor: "transparent",
              padding: "30px",
              borderRadius: "8px",
              maxHeight: "500px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
            className="hide-scrollbar">
              {activities.slice(0, 10).map((activity, index) => (
                <ActivityFeedItem
                  key={`${activity.activityType}-${activity.userId}-${activity.timestamp}-${index}`}
                  activity={activity}
                  showBorder={index < Math.min(activities.length, 10) - 1}
                />
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: "transparent",
              padding: "60px 30px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4>No friend activity yet</h4>
              <p className="text-muted mb-3">
                Add friends to see what they're up to!
              </p>
              <Button color="dark" size="sm" tag={Link} to="/friends">
                Find Friends
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Upcoming Events Section - Cyan */}
      <section style={{
        backgroundColor: "var(--color-cyan)",
        width: "100vw",
        margin: 0,
        padding: "80px 20px",
        minHeight: "400px",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw"
      }}>
        <Container style={{ maxWidth: "1200px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Upcoming Events</h2>
            <Button
              color="dark"
              outline
              size="sm"
              tag={Link}
              to="/events/create"
            >
              Create Event
            </Button>
          </div>

          {loadingEvents ? (
            <div className="text-center py-5">
              <Spinner color="dark" />
              <p className="mt-3">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: "rgba(226, 226, 226, 0.6)",
                    padding: "20px 30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "2px solid transparent"
                  }}
                  onClick={() => navigate(`/events/${event.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = "var(--color-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h4 className="mb-2">{event.title}</h4>
                      <div className="mb-2">
                        <Badge
                          color={event.eventType === "Online" ? "success" : "primary"}
                          className="me-2"
                          pill
                        >
                          {event.eventType === "Online" ? "Online" : "In-Person"}
                        </Badge>
                        {event.interestTagName && (
                          <Badge color="info" pill>{event.interestTagName}</Badge>
                        )}
                      </div>
                      <p className="text-muted mb-0">
                        {new Date(event.startDateTime).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}{" "}
                        at{" "}
                        {new Date(event.startDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {events.length > 5 && (
                <div className="text-center mt-3">
                  <p className="mb-2">
                    <strong>and {events.length - 5} more events...</strong>
                  </p>
                  <Button color="dark" size="sm" tag={Link} to="/browse-interests">
                    View All Events
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: "rgba(226, 226, 226, 0.6)",
              padding: "60px 30px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <h4>No upcoming events yet</h4>
              <p className="text-muted mb-3">
                Create your first event or explore interests to find events!
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Button color="dark" size="sm" tag={Link} to="/events/create">
                  Create Event
                </Button>
                <Button color="dark" outline size="sm" tag={Link} to="/browse-interests">
                  Browse Interests
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Recommended Section - Coral */}
      <section style={{
        backgroundColor: "var(--color-coral)",
        width: "100vw",
        margin: 0,
        padding: "80px 20px",
        minHeight: "400px",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw"
      }}>
        <Container style={{ maxWidth: "1200px" }}>
          <div className="mb-4">
            <h2 className="mb-2">Recommended For You</h2>
            <p className="mb-0">
              Discover new interests and events tailored to your preferences
            </p>
          </div>

          <div style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "80px 30px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3 className="mb-3">Coming Soon</h3>
            <p className="text-muted mb-4">
              We're building personalized recommendations based on your interests and activity.
            </p>
            <Button color="dark" outline tag={Link} to="/browse-interests">
              Explore Interests
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
