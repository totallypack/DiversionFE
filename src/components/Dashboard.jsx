import { useState, useEffect } from "react";
import { Button, Badge, Alert } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAllEvents, getNearbyEvents } from "../managers/eventManager";
import { getFriendActivityFeed } from "../managers/activityManager";
import { getMyProfile } from "../managers/profileManager";
import { sortEventsByDate } from "../utils/transformUtils";
import NavBar from "./NavBar";
import ActivityFeedItem from "./ActivityFeedItem";
import FullWidthSection from "./common/FullWidthSection";
import EmptyState from "./common/EmptyState";
import LoadingSpinner from "./common/LoadingSpinner";
import HoverCard from "./common/HoverCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [userZipCode, setUserZipCode] = useState(null);
  const [zipError, setZipError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
    loadActivities();
    loadUserProfile();
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

  const loadUserProfile = async () => {
    try {
      const profile = await getMyProfile();
      if (profile.zipCode) {
        setUserZipCode(profile.zipCode);
        setZipError(null);
        loadNearbyEvents(profile.zipCode);
      } else {
        setZipError("Add a zip code to your profile to see nearby events.");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setZipError("Unable to load your profile.");
    }
  };

  const loadNearbyEvents = async (zipCode) => {
    if (!zipCode) return;

    setLoadingNearby(true);
    try {
      const nearbyEventsData = await getNearbyEvents(zipCode);
      setNearbyEvents(nearbyEventsData);
      setLoadingNearby(false);
    } catch (error) {
      console.error("Failed to load nearby events:", error);
      setLoadingNearby(false);
    }
  };

  const username = localStorage.getItem("username") || "Friend";

  return (
    <>
      <NavBar />

      {/* Welcome Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="100px 20px 60px"
        minHeight="250px"
        containerMaxWidth="900px"
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="mb-3">Hello, {username}!</h1>
          <p className="lead mb-0">
            Welcome back! Here's what's happening in your community today.
          </p>
        </div>
      </FullWidthSection>

      {/* Friend Activity Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="400px"
        containerMaxWidth="1200px"
      >
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
          <LoadingSpinner message="Loading activity..." />
        ) : activities.length > 0 ? (
          <div style={{
            backgroundColor: "transparent",
            padding: "0px",
            borderRadius: "0px",
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
          <EmptyState
            title="No friend activity yet"
            message="Add friends to see what they're up to!"
            actionText="Find Friends"
            actionLink="/friends"
            backgroundColor="transparent"
          />
        )}
      </FullWidthSection>

      {/* Events Near You Section */}
      <FullWidthSection
        backgroundColor="var(--color-cyan)"
        padding="80px 20px"
        minHeight="400px"
        containerMaxWidth="1200px"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Events Near You</h2>
        </div>

        {loadingNearby ? (
          <LoadingSpinner message="Loading nearby events..." />
        ) : zipError ? (
          <Alert color="info" className="text-center">
            <strong>Zip code needed</strong>
            <p className="mb-0 mt-2">{zipError}</p>
            <Button
              color="primary"
              size="sm"
              className="mt-2"
              tag={Link}
              to="/profile-setup"
            >
              Add Zip Code
            </Button>
          </Alert>
        ) : nearbyEvents.length > 0 ? (
          <div>
            <p className="text-center mb-3">
              <strong>{nearbyEvents.length} event{nearbyEvents.length !== 1 ? 's' : ''} in your area (Zip: {userZipCode})</strong>
            </p>
            <div className="d-flex flex-column gap-3">
              {nearbyEvents.slice(0, 10).map((event) => (
                <HoverCard
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h4 className="mb-2">{event.title}</h4>
                      <div className="mb-2">
                        <Badge
                          color="primary"
                          className="me-2"
                          pill
                        >
                          In-Person
                        </Badge>
                        {event.interestTagName && (
                          <Badge color="info" pill>{event.interestTagName}</Badge>
                        )}
                      </div>
                      <p className="text-muted mb-1">
                        {event.city}, {event.state} {event.zipCode}
                      </p>
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
                </HoverCard>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No nearby events found"
            message="There are no upcoming events in your area. Try exploring all events or create your own!"
            actionText="View All Events"
            actionLink="/browse-interests"
            backgroundColor="transparent"
          />
        )}
      </FullWidthSection>

      {/* Upcoming Events Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px"
        minHeight="400px"
        containerMaxWidth="1200px"
      >
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
          <LoadingSpinner message="Loading events..." />
        ) : events.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {events.slice(0, 5).map((event) => (
              <HoverCard
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
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
              </HoverCard>
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
          <EmptyState
            title="No upcoming events yet"
            message="Create your first event or explore interests to find events!"
            actionText="Create Event"
            actionLink="/events/create"
            secondaryActionText="Browse Interests"
            secondaryActionLink="/browse-interests"
          />
        )}
      </FullWidthSection>

      {/* Recommended Section */}
      <FullWidthSection
        backgroundColor="var(--color-coral)"
        padding="80px 80px 150px"
        minHeight="400px"
        containerMaxWidth="1200px"
      >
        <div className="mb-4">
          <h2 className="mb-2">Recommended For You</h2>
          <p className="mb-0">
            Discover new interests and events tailored to your preferences
          </p>
        </div>

        <div style={{
          backgroundColor: "rgba(226, 226, 226, 0.6)",
          padding: "80px 80px",
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
      </FullWidthSection>
    </>
  );
}
