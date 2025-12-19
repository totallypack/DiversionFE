import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInterestsWithSubInterests } from "../managers/interestManager";
import { filterInterestsBySearchTerm } from "../utils/filterUtils";
import NavBar from "./NavBar";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
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
      <>
        <NavBar />
        <Container className="mt-5 text-center">
          <Spinner color="primary" />
          <p className="mt-3">Loading interests...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="mb-4">
              <h2>Browse Interests</h2>
              <p className="text-muted">
                Explore all available interests and find new communities to join
              </p>
            </div>

            <Card className="mb-4">
              <CardBody>
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
              </CardBody>
            </Card>

            {error && <Alert color="danger" fade={false}>{error}</Alert>}

            {filteredInterests.length === 0 ? (
              <Alert color="info" fade={false}>
                No interests found matching your search. Try different keywords.
              </Alert>
            ) : (
              <Row className="g-4">
                {filteredInterests.map((interest) => (
                  <Col key={interest.id} xs={12}>
                    <div
                      ref={(el) => (interestRefs.current[interest.id] = el)}
                      style={{ scrollMarginTop: "100px" }}
                    >
                      <Card>
                    <CardBody>
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
                                <Card
                                  className="h-100 border"
                                  style={{
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                  onClick={() =>
                                    handleSubInterestClick(subInterest.id)
                                  }
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 8px rgba(0,0,0,0.1)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                  }}
                                >
                                  <CardBody className="p-3">
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
                                  </CardBody>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ) : (
                        <Alert color="light" className="mb-0" fade={false}>
                          No sub-interests available for this category yet.
                        </Alert>
                      )}
                    </CardBody>
                  </Card>
                    </div>
                  </Col>
                ))}
            </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
