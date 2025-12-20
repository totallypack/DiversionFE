import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubInterestById } from "../managers/interestManager";
import {
  getMyInterests,
  addInterest,
  removeInterestBySubInterestId,
} from "../managers/userInterestManager";
import NavBar from "./NavBar";
import FullWidthSection from "./common/FullWidthSection";
import {
  Container,
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

      try {
        const myInterests = await getMyInterests();
        const hasInterest = myInterests.some(
          (ui) => ui.subInterest.id === id
        );
        setIsInMyInterests(hasInterest);
      } catch (err) {
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
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !subInterest) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-light-grey)",
      }}>
        <NavBar />
        <Container className="mt-5">
          <Alert color="danger" className="text-center">{error || "SubInterest not found"}</Alert>
          <div className="text-center">
            <Button color="dark" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Container>
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
        minHeight="300px"
        containerMaxWidth="900px"
      >
        <div className="text-center">
          <div className="mb-3">
            <span className="text-muted">{subInterest.interest.name}</span>
            {" > "}
            <span className="fw-bold">{subInterest.name}</span>
          </div>
          <h1 className="mb-3">{subInterest.name}</h1>
          <Badge color="info" style={{ fontSize: "0.9rem" }}>
            {subInterest.interest.name}
          </Badge>

          <div className="mt-4">
            {isInMyInterests ? (
              <Button
                color="secondary"
                outline
                size="lg"
                onClick={handleRemoveFromInterests}
                disabled={actionLoading}
              >
                {actionLoading ? "Removing..." : "Remove from My Interests"}
              </Button>
            ) : (
              <Button
                color="dark"
                size="lg"
                onClick={handleAddToInterests}
                disabled={actionLoading}
              >
                {actionLoading ? "Adding..." : "Add to My Interests"}
              </Button>
            )}
          </div>
        </div>
      </FullWidthSection>

      {/* About Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px"
        minHeight="300px"
        containerMaxWidth="900px"
      >
        {successMessage && <Alert color="success" className="text-center mb-4">{successMessage}</Alert>}

        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <h4 className="mb-3">About</h4>
          {subInterest.description ? (
            <p className="text-muted mb-0">{subInterest.description}</p>
          ) : (
            <p className="text-muted mb-0">
              No description available for this interest yet.
            </p>
          )}
        </div>
      </FullWidthSection>

      {/* Communities Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px 150px"
        minHeight="300px"
        containerMaxWidth="900px"
      >
        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <h4 className="mb-3">Groups & Communities</h4>
          <div className="text-center py-4">
            <h5>Coming Soon!</h5>
            <p className="mb-3 text-muted">
              Groups and communities for this interest will be available
              soon. Check back later to connect with others who share this
              interest.
            </p>
            <Button
              color="secondary"
              outline
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </div>
      </FullWidthSection>
    </div>
  );
}
