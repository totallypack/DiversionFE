import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubInterestById } from "../managers/interestManager";
import {
  getMyInterests,
  addInterest,
  removeInterestBySubInterestId,
} from "../managers/userInterestManager";
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

export default function SubInterestDetail() {
  const [subInterest, setSubInterest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isInMyInterests, setIsInMyInterests] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadSubInterest();
  }, [id]);

  const loadSubInterest = async () => {
    try {
      const data = await getSubInterestById(id);
      setSubInterest(data);

      // Check if user has this interest
      try {
        const myInterests = await getMyInterests();
        const hasInterest = myInterests.some(
          (ui) => ui.subInterest.id === id
        );
        setIsInMyInterests(hasInterest);
      } catch (err) {
        // User might not be logged in, that's okay
        setIsInMyInterests(false);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load subinterest details. Please try again.");
      setLoading(false);
    }
  };

  const handleAddToInterests = async () => {
    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await addInterest(id);
      setIsInMyInterests(true);
      setSuccessMessage("Added to your interests!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add interest. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromInterests = async () => {
    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await removeInterestBySubInterestId(id);
      setIsInMyInterests(false);
      setSuccessMessage("Removed from your interests!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to remove interest. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="mt-5 text-center">
          <Spinner color="primary" />
          <p className="mt-3">Loading...</p>
        </Container>
      </>
    );
  }

  if (error || !subInterest) {
    return (
      <>
        <NavBar />
        <Container className="mt-5">
          <Alert color="danger">{error || "SubInterest not found"}</Alert>
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
          <div className="mb-4">
            <span className="text-muted">{subInterest.interest.name}</span>
            {" > "}
            <span className="fw-bold">{subInterest.name}</span>
          </div>

          {successMessage && <Alert color="success" fade={false}>{successMessage}</Alert>}
          {error && <Alert color="danger" fade={false}>{error}</Alert>}

          <Card className="mb-4">
            <CardBody>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="mb-2">{subInterest.name}</h2>
                  <Badge color="info" className="mb-3">
                    {subInterest.interest.name}
                  </Badge>
                </div>
                <div>
                  {isInMyInterests ? (
                    <Button
                      color="danger"
                      outline
                      onClick={handleRemoveFromInterests}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Removing..." : "Remove from My Interests"}
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={handleAddToInterests}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Adding..." : "Add to My Interests"}
                    </Button>
                  )}
                </div>
              </div>

              {subInterest.description ? (
                <div>
                  <h5 className="mb-3">About</h5>
                  <p className="text-muted">{subInterest.description}</p>
                </div>
              ) : (
                <p className="text-muted">
                  No description available for this interest yet.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="mb-3">Groups & Communities</h5>
              <Alert color="info" className="mb-0">
                <div className="text-center py-4">
                  <h6>Coming Soon!</h6>
                  <p className="mb-0">
                    Groups and communities for this interest will be available
                    soon. Check back later to connect with others who share this
                    interest.
                  </p>
                </div>
              </Alert>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="mt-4 text-center">
            <Button
              color="secondary"
              outline
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
}
