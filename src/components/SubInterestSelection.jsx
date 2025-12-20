import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterestById } from "../managers/interestManager";
import { addInterest } from "../managers/userInterestManager";
import FullWidthSection from "./common/FullWidthSection";
import {
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

  const handleAddInterests = async () => {
    if (selectedSubInterests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    setSaving(true);
    setError("");

    try {
      for (const subInterestId of selectedSubInterests) {
        await addInterest(subInterestId);
      }

      navigate("/select-interests", { state: { showSuccessMessage: true, addedCount: selectedSubInterests.length } });
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

  if (!interest) {
    return (
      <div style={{
        marginTop: "-180px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-light-grey)",
      }}>
        <Alert color="danger">Interest not found</Alert>
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
          <Button
            color="link"
            onClick={handleBackToCategories}
            className="mb-3"
            style={{ color: "var(--color-black)", textDecoration: "none" }}
          >
            ← Back to Categories
          </Button>
          <h1 className="mb-3">{interest.name}</h1>
          <p className="lead mb-0">{interest.description}</p>
          <p className="text-muted mt-2">
            Select the specific interests that resonate with you
          </p>
          {selectedSubInterests.length > 0 && (
            <div className="mt-4">
              <Badge color="primary" pill style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}>
                {selectedSubInterests.length} interest{selectedSubInterests.length !== 1 ? 's' : ''} selected
              </Badge>
            </div>
          )}
        </div>
      </FullWidthSection>

      {/* SubInterests Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px 150px"
        minHeight="500px"
        containerMaxWidth="1200px"
      >
        {error && <Alert color="danger" className="text-center">{error}</Alert>}

        {selectedSubInterests.length > 0 && (
          <div className="text-center mb-5">
            <Button
              color="dark"
              size="lg"
              onClick={handleAddInterests}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add & Continue"}
            </Button>
          </div>
        )}

        <div className="row g-4">
          {interest.subInterests && interest.subInterests.length > 0 ? (
            interest.subInterests.map((subInterest) => (
              <div key={subInterest.id} className="col-md-6 col-lg-4">
                <div
                  style={{
                    backgroundColor: "rgba(226, 226, 226, 0.6)",
                    padding: "30px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    height: "100%",
                    textAlign: "center",
                    border: selectedSubInterests.includes(subInterest.id)
                      ? "2px solid var(--color-cyan)"
                      : "2px solid transparent",
                  }}
                  onClick={() => toggleSubInterest(subInterest.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    if (!selectedSubInterests.includes(subInterest.id)) {
                      e.currentTarget.style.borderColor = "var(--color-cyan)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    if (!selectedSubInterests.includes(subInterest.id)) {
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0" style={{ flex: 1 }}>{subInterest.name}</h5>
                    {selectedSubInterests.includes(subInterest.id) && (
                      <Badge color="success" style={{ fontSize: "1rem" }}>✓</Badge>
                    )}
                  </div>
                  {subInterest.description && (
                    <p className="text-muted mb-0">
                      {subInterest.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">
                No specific interests available in this category yet.
              </p>
            </div>
          )}
        </div>

        {selectedSubInterests.length > 0 && (
          <div className="text-center mt-5">
            <Button
              color="dark"
              size="lg"
              onClick={handleAddInterests}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add & Continue"}
            </Button>
          </div>
        )}
      </FullWidthSection>
    </div>
  );
}
