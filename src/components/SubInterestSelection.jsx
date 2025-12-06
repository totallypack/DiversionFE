import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterestById } from "../managers/interestManager";
import { addInterest } from "../managers/userInterestManager";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Alert,
  Spinner,
  Badge,
} from "reactstrap";

export default function SubInterestSelection() {
  const [interest, setInterest] = useState(null);
  const [selectedSubInterests, setSelectedSubInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { interestId } = useParams();

  useEffect(() => {
    loadInterest();
  }, [interestId]);

  const loadInterest = async () => {
    try {
      const data = await getInterestById(interestId);
      setInterest(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load sub-interests. Please try again.");
      setLoading(false);
    }
  };

  const toggleSubInterest = (subInterestId) => {
    setSelectedSubInterests((prev) =>
      prev.includes(subInterestId)
        ? prev.filter((id) => id !== subInterestId)
        : [...prev, subInterestId]
    );
  };

  const handleAddToProfile = async () => {
    if (selectedSubInterests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Add each selected sub-interest
      for (const subInterestId of selectedSubInterests) {
        await addInterest(subInterestId);
      }

      // Redirect to profile view with onboarding flag
      navigate("/my-profile-view", { state: { onboarding: true } });
    } catch (err) {
      setSaving(false);
      if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to add interests. Please try again.");
      }
    }
  };

  const handleBackToCategories = () => {
    navigate("/select-interests");
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="mt-3">Loading interests...</p>
      </Container>
    );
  }

  if (!interest) {
    return (
      <Container className="mt-5">
        <Alert color="danger">Interest not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="mb-4">
            <Button
              color="link"
              onClick={handleBackToCategories}
              className="p-0 mb-3"
            >
              ← Back to Categories
            </Button>
            <h2>{interest.name}</h2>
            <p className="text-muted">{interest.description}</p>
            <p className="text-muted">
              Select the specific interests that resonate with you
            </p>
          </div>

          {error && <Alert color="danger">{error}</Alert>}

          {selectedSubInterests.length > 0 && (
            <Alert color="info" className="d-flex justify-content-between align-items-center">
              <span>
                {selectedSubInterests.length} interest
                {selectedSubInterests.length !== 1 ? "s" : ""} selected
              </span>
              <Button
                color="primary"
                onClick={handleAddToProfile}
                disabled={saving}
              >
                {saving ? "Adding..." : "Add to Profile"}
              </Button>
            </Alert>
          )}

          <Row className="g-3">
            {interest.subInterests && interest.subInterests.length > 0 ? (
              interest.subInterests.map((subInterest) => (
                <Col key={subInterest.id} md={6} lg={4}>
                  <Card
                    className={`h-100 ${
                      selectedSubInterests.includes(subInterest.id)
                        ? "border-primary"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSubInterest(subInterest.id)}
                  >
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start">
                        <h6>{subInterest.name}</h6>
                        {selectedSubInterests.includes(subInterest.id) && (
                          <Badge color="primary">✓</Badge>
                        )}
                      </div>
                      {subInterest.description && (
                        <p className="text-muted small mb-0">
                          {subInterest.description}
                        </p>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert color="info">
                  No specific interests available in this category yet.
                </Alert>
              </Col>
            )}
          </Row>

          {selectedSubInterests.length > 0 && (
            <div className="text-center mt-4">
              <Button
                color="primary"
                size="lg"
                onClick={handleAddToProfile}
                disabled={saving}
              >
                {saving ? "Adding to Profile..." : "Add to Profile"}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
