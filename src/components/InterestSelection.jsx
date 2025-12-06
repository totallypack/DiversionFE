import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInterests } from "../managers/interestManager";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Spinner,
} from "reactstrap";

export default function InterestSelection() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadInterests();
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
          <h2 className="text-center mb-4">What are you interested in?</h2>
          <p className="text-center text-muted mb-5">
            Select a category to explore specific interests
          </p>

          {error && <Alert color="danger">{error}</Alert>}

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
        </Col>
      </Row>
    </Container>
  );
}
