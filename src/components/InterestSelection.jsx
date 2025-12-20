import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllInterests } from "../managers/interestManager";
import { getMyInterests } from "../managers/userInterestManager";
import {
  Alert,
  Spinner,
  Button,
  Badge,
} from "reactstrap";
import FullWidthSection from "./common/FullWidthSection";

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

    if (location.state?.showSuccessMessage) {
      const count = location.state?.addedCount || 0;
      setSuccessMessage(`Successfully added ${count} interest${count !== 1 ? 's' : ''}!`);

      setTimeout(() => setSuccessMessage(""), 3000);

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
      <div style={{
        marginTop: "-180px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-purple)",
      }}>
        <div className="text-center">
          <Spinner color="dark" />
          <p className="mt-3">Loading interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: "-180px",
      marginBottom: "-20px",
      minHeight: "calc(100vh + 100px)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-grey)"
        padding="130px 20px 60px"
        minHeight="250px"
        containerMaxWidth="800px"
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="mb-3">What are you interested in?</h1>
          <p className="lead mb-0">
            Select a category to explore specific interests
          </p>
          {myInterestsCount > 0 && (
            <div className="mt-4">
              <Badge color="primary" pill style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}>
                {myInterestsCount} interest{myInterestsCount !== 1 ? 's' : ''} selected
              </Badge>
            </div>
          )}
        </div>
      </FullWidthSection>

      {/* Interests Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px 150px"
        minHeight="500px"
        containerMaxWidth="1200px"
      >
        {successMessage && <Alert color="success" className="text-center">{successMessage}</Alert>}
        {error && <Alert color="danger" className="text-center">{error}</Alert>}

        {myInterestsCount > 0 && (
          <div className="text-center mb-5">
            <Button
              color="dark"
              size="lg"
              onClick={handleDoneSelecting}
            >
              Done Selecting - Go to Profile
            </Button>
          </div>
        )}

        <div className="row g-4">
          {interests.map((interest) => (
            <div key={interest.id} className="col-md-6 col-lg-4">
              <div
                style={{
                  backgroundColor: "rgba(226, 226, 226, 0.6)",
                  padding: "30px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  height: "100%",
                  textAlign: "center",
                  border: "2px solid transparent",
                }}
                onClick={() => handleInterestClick(interest.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "var(--color-cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <h4 className="mb-3">{interest.name}</h4>
                <p className="text-muted mb-0">
                  {interest.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {myInterestsCount > 0 && (
          <div className="text-center mt-5">
            <Button
              color="dark"
              size="lg"
              onClick={handleDoneSelecting}
            >
              Done Selecting - Go to Profile
            </Button>
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
