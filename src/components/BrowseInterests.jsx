import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInterestsWithSubInterests } from "../managers/interestManager";
import { filterInterestsBySearchTerm } from "../utils/filterUtils";
import NavBar from "./NavBar";
import FullWidthSection from "./common/FullWidthSection";
import HoverCard from "./common/HoverCard";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

export default function BrowseInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const interestRefs = useRef({});

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const data = await getAllInterestsWithSubInterests();
      setInterests(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load interests. Please try again.");
      setLoading(false);
    }
  };

  const handleSubInterestClick = (subInterestId) => {
    navigate(`/subinterest/${subInterestId}`);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId && interestRefs.current[categoryId]) {
      interestRefs.current[categoryId].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const filteredInterests = filterInterestsBySearchTerm(interests, searchTerm);

  if (loading) {
    return (
      <div style={{
        marginTop: "180px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-purple)",
      }}>
        <NavBar />
        <div className="text-center">
          <Spinner color="dark" />
          <p className="mt-3">Loading interests...</p>
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
        containerMaxWidth="1000px"
      >
        <div className="text-center">
          <h1 className="mb-3">Browse Interests</h1>
          <p className="lead mb-0">
            Explore all available interests and find new communities to join
          </p>
        </div>
      </FullWidthSection>

      {/* Search Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="60px 20px"
        minHeight="200px"
        containerMaxWidth="1000px"
      >
        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="search">Search Interests</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="categoryJump">Quick Jump to Category</Label>
                <Input
                  id="categoryJump"
                  type="select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">-- Select a category --</option>
                  {interests.map((interest) => (
                    <option key={interest.id} value={interest.id}>
                      {interest.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </div>
      </FullWidthSection>

      {/* Interests Section */}
      <FullWidthSection
        backgroundColor="var(--color-light-green)"
        padding="80px 20px 150px"
        minHeight="500px"
        containerMaxWidth="1200px"
      >
        {error && <Alert color="danger" className="text-center">{error}</Alert>}

        {filteredInterests.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">
              No interests found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredInterests.map((interest, index) => (
              <Col key={interest.id} xs={12}>
                <div
                  ref={(el) => (interestRefs.current[interest.id] = el)}
                  style={{ scrollMarginTop: "100px" }}
                >
                  <div
                    style={{
                      backgroundColor: index % 2 === 0 ? "rgba(226, 226, 226, 0.7)" : "rgba(196, 186, 255, 0.3)",
                      padding: "30px",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="mb-3">
                      <h4 className="mb-2">{interest.name}</h4>
                      {interest.description && (
                        <p className="text-muted">{interest.description}</p>
                      )}
                    </div>

                    {interest.subInterests && interest.subInterests.length > 0 ? (
                      <div>
                        <h6 className="mb-3 text-muted">
                          {interest.subInterests.length} sub-interest
                          {interest.subInterests.length !== 1 ? "s" : ""}
                        </h6>
                        <Row className="g-3">
                          {interest.subInterests.map((subInterest) => (
                            <Col key={subInterest.id} md={6} lg={4}>
                              <HoverCard
                                backgroundColor="rgba(255, 255, 255, 0.8)"
                                borderWidth="2px"
                                hoverBorderColor="var(--color-cyan)"
                                height="100%"
                                onClick={() =>
                                  handleSubInterestClick(subInterest.id)
                                }
                              >
                                <h6 className="mb-1">
                                  {subInterest.name}
                                </h6>
                                {subInterest.description && (
                                  <p className="text-muted small mb-0">
                                    {subInterest.description.length > 100
                                      ? `${subInterest.description.substring(
                                          0,
                                          100
                                        )}...`
                                      : subInterest.description}
                                  </p>
                                )}
                              </HoverCard>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">
                        No sub-interests available for this category yet.
                      </p>
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </FullWidthSection>
    </div>
  );
}
