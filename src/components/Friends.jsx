import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFriends, searchUsers, removeFriend, addFriend } from "../managers/friendManager";
import NavBar from "./NavBar";
import FullWidthSection from "./common/FullWidthSection";
import {
  Input,
  Button,
  Alert,
  Spinner,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const loadFriends = async () => {
    try {
      const data = await getMyFriends();
      setFriends(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load friends");
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }
    try {
      await removeFriend(friendId);
      await loadFriends();
    } catch (err) {
      setError("Failed to remove friend");
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await addFriend(userId);
      await loadFriends();
      if (searchQuery.trim().length >= 2) {
        performSearch();
      }
    } catch (err) {
      setError("Failed to add friend");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-purple)",
      }}>
        <NavBar />
        <div className="text-center">
          <Spinner color="dark" />
          <p className="mt-3">Loading friends...</p>
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
      <NavBar />

      {/* Header Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="130px 20px 60px"
        minHeight="250px"
        containerMaxWidth="900px"
      >
        <div className="text-center">
          <h1 className="mb-3">Friends</h1>
          <p className="lead mb-0">
            Connect with people who share your interests
          </p>
        </div>
      </FullWidthSection>

      {/* Search Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="300px"
        containerMaxWidth="900px"
      >
        {error && <Alert color="danger" className="mb-4">{error}</Alert>}

        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <h3 className="mb-4">Search Users</h3>
          <Input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />
          {searching && <div className="text-center"><Spinner size="sm" /></div>}
          {searchResults.length > 0 && (
            <ListGroup>
              {searchResults.map((user) => (
                <ListGroupItem
                  key={user.userId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div
                    style={{ cursor: "pointer", flex: 1 }}
                    onClick={() => navigate(`/profile/${user.userId}`)}
                  >
                    <div>
                      <strong>{user.displayName || user.username}</strong>
                    </div>
                    <div className="text-muted small">
                      @{user.username}
                      {user.city && user.state && ` • ${user.city}, ${user.state}`}
                    </div>
                  </div>
                  {user.isFriend ? (
                    <Button
                      color="warning"
                      outline
                      size="sm"
                      onClick={() => handleRemoveFriend(user.userId)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => handleAddFriend(user.userId)}
                    >
                      Add Friend
                    </Button>
                  )}
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </div>
      </FullWidthSection>

      {/* Friends List Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px 150px"
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
          <h3 className="mb-4">My Friends ({friends.length})</h3>
          {friends.length > 0 ? (
            <ListGroup>
              {friends.map((friendship) => (
                <ListGroupItem
                  key={friendship.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div
                    style={{ cursor: "pointer", flex: 1 }}
                    onClick={() => navigate(`/profile/${friendship.friendId}`)}
                  >
                    <div>
                      <strong>{friendship.friendDisplayName || friendship.friendUsername}</strong>
                    </div>
                    <div className="text-muted small">@{friendship.friendUsername}</div>
                  </div>
                  <Button
                    color="warning"
                    outline
                    size="sm"
                    onClick={() => handleRemoveFriend(friendship.friendId)}
                  >
                    Remove
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <Alert color="info">
              You don't have any friends yet. Search for users above to add friends!
            </Alert>
          )}
        </div>
      </FullWidthSection>
    </div>
  );
}
