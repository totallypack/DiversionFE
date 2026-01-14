import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
} from "reactstrap";
import { search } from "../../managers/searchManager";
import "./SearchResults.css";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({ events: [], users: [], communities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await search(searchQuery, activeTab === "all" ? null : activeTab);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const totalResults =
    (results.events?.length || 0) +
    (results.users?.length || 0) +
    (results.communities?.length || 0);

  return (
    <Container className="search-results-container">
      <Row className="mb-4">
        <Col>
          <h2>Search Results for "{searchQuery}"</h2>
          <p className="text-muted">{totalResults} results found</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "all" ? "active" : ""}
                onClick={() => setActiveTab("all")}
                style={{ cursor: "pointer" }}
              >
                All ({totalResults})
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "events" ? "active" : ""}
                onClick={() => setActiveTab("events")}
                style={{ cursor: "pointer" }}
              >
                Events ({results.events?.length || 0})
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
                style={{ cursor: "pointer" }}
              >
                Users ({results.users?.length || 0})
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "communities" ? "active" : ""}
                onClick={() => setActiveTab("communities")}
                style={{ cursor: "pointer" }}
              >
                Communities ({results.communities?.length || 0})
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          {/* Events */}
          {(activeTab === "all" || activeTab === "events") && results.events && results.events.length > 0 && (
            <Row className="mb-4">
              <Col>
                <h4>Events</h4>
                {results.events.map((event) => (
                  <Card key={event.id} className="mb-3 search-result-card">
                    <CardBody>
                      <CardTitle tag="h5">
                        <Link to={`/events/${event.id}`} className="search-result-link">
                          {event.title}
                        </Link>
                      </CardTitle>
                      <CardText>
                        <small className="text-muted">
                          {formatDate(event.startDateTime)}
                          {event.city && event.state && ` • ${event.city}, ${event.state}`}
                          {event.eventType === "Online" && " • Online Event"}
                        </small>
                      </CardText>
                      <CardText>{event.description?.substring(0, 200)}</CardText>
                      <small className="text-muted">
                        Organized by {event.organizerUsername}
                        {event.interestTagName && (
                          <Badge color="secondary" className="ms-2">
                            {event.interestTagName}
                          </Badge>
                        )}
                      </small>
                    </CardBody>
                  </Card>
                ))}
              </Col>
            </Row>
          )}

          {/* Users */}
          {(activeTab === "all" || activeTab === "users") && results.users && results.users.length > 0 && (
            <Row className="mb-4">
              <Col>
                <h4>Users</h4>
                {results.users.map((user) => (
                  <Card key={user.userId} className="mb-3 search-result-card">
                    <CardBody>
                      <CardTitle tag="h5">
                        <Link to={`/profile/${user.userId}`} className="search-result-link">
                          {user.displayName || user.username}
                        </Link>
                      </CardTitle>
                      <CardText>
                        <small className="text-muted">@{user.username}</small>
                        {user.city && user.state && (
                          <small className="text-muted"> • {user.city}, {user.state}</small>
                        )}
                        {user.isFriend && (
                          <Badge color="primary" className="ms-2">
                            Friend
                          </Badge>
                        )}
                      </CardText>
                      {user.bio && <CardText>{user.bio.substring(0, 150)}</CardText>}
                    </CardBody>
                  </Card>
                ))}
              </Col>
            </Row>
          )}

          {/* Communities */}
          {(activeTab === "all" || activeTab === "communities") &&
            results.communities &&
            results.communities.length > 0 && (
              <Row className="mb-4">
                <Col>
                  <h4>Communities</h4>
                  {results.communities.map((community) => (
                    <Card key={community.id} className="mb-3 search-result-card">
                      <CardBody>
                        <CardTitle tag="h5">
                          <Link to={`/communities/${community.id}`} className="search-result-link">
                            {community.name}
                          </Link>
                          {community.isPrivate && (
                            <Badge color="warning" className="ms-2">
                              Private
                            </Badge>
                          )}
                          {community.isMember && (
                            <Badge color="success" className="ms-2">
                              Member
                            </Badge>
                          )}
                        </CardTitle>
                        <CardText>
                          <small className="text-muted">
                            {community.memberCount} members • Created by {community.creatorUsername}
                          </small>
                        </CardText>
                        {community.description && (
                          <CardText>{community.description.substring(0, 200)}</CardText>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </Col>
              </Row>
            )}

          {/* No results */}
          {totalResults === 0 && (
            <Row>
              <Col className="text-center py-5">
                <p>No results found for "{searchQuery}"</p>
                <p className="text-muted">Try different keywords or check your spelling</p>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
