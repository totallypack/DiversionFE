import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllInterests } from "../managers/interestManager";
import { getMyInterests } from "../managers/userInterestManager";
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

export default function InterestSelection() {
  const [interests, setInterests] = useState([]);
  const [myInterestsCount, setMyInterestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadInterests();
    loadMyInterestsCount();

    // Show success message if coming from adding interests
    if (location.state?.showSuccessMessage) {
      const count = location.state?.addedCount || 0;
      setSuccessMessage(`Successfully added ${count} interest${count !== 1 ? 's' : ''}!`);

      // Clear the message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const loadInterests = async () => {
    try {
      const data = await getAllInterests();
      setInterests(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load interests. Please try again.");
      setLoading(false);
    }
  };

  const loadMyInterestsCount = async () => {
    try {
      const myInterests = await getMyInterests();
      setMyInterestsCount(myInterests.length);
    } catch (err) {
      // Silently fail - user may not have any interests yet
      setMyInterestsCount(0);
    }
  };

  const handleDoneSelecting = () => {
    navigate("/my-profile");
  };

  const handleInterestClick = (interestId) => {
    navigate(`/select-subinterests/${interestId}`);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="mt-3">Loading interests...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-2">What are you interested in?</h2>
              <p className="text-muted mb-0">
                Select a category to explore specific interests
              </p>
            </div>
            {myInterestsCount > 0 && (
              <div className="text-center">
                <Badge color="primary" pill style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}>
                  {myInterestsCount} interest{myInterestsCount !== 1 ? 's' : ''} selected
                </Badge>
              </div>
            )}
          </div>

          {successMessage && <Alert color="success">{successMessage}</Alert>}
          {error && <Alert color="danger">{error}</Alert>}

          {myInterestsCount > 0 && (
            <div className="text-center mb-4">
              <Button
                color="success"
                size="lg"
                onClick={handleDoneSelecting}
              >
                Done Selecting - Go to Profile
              </Button>
            </div>
          )}

          <Row className="g-3">
            {interests.map((interest) => (
              <Col key={interest.id} md={6} lg={4}>
                <Card
                  className="h-100 interest-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleInterestClick(interest.id)}
                >
                  <CardBody className="text-center">
                    <h5>{interest.name}</h5>
                    <p className="text-muted small mb-0">
                      {interest.description}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {myInterestsCount > 0 && (
            <div className="text-center mt-5">
              <Button
                color="success"
                size="lg"
                onClick={handleDoneSelecting}
              >
                Done Selecting - Go to Profile
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
