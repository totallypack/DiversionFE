import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCommunity } from "../../managers/communityManager";
import { getAllInterestsWithSubInterests } from "../../managers/interestManager";
import NavBar from "../NavBar";
import ErrorAlert from "../common/ErrorAlert";
import FullWidthSection from "../common/FullWidthSection";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";

export default function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [interestId, setInterestId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [interests, setInterests] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const data = await getAllInterestsWithSubInterests();
      setInterests(data);
    } catch (err) {
      setErrors(["Failed to load interests."]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    if (!name.trim() || name.length < 2) {
      setErrors(["Community name must be at least 2 characters."]);
      return;
    }

    setLoading(true);

    try {
      const communityData = {
        name: name.trim(),
        description: description.trim() || null,
        interestId: interestId || null,
        imageUrl: imageUrl.trim() || null,
        isPrivate,
      };

      const result = await createCommunity(communityData);
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate(`/communities/${result.id}`);
      }, 1500);
    } catch (error) {
      setLoading(false);
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["Failed to create community. Please try again."]);
      }
    }
  };

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
        containerMaxWidth="800px"
      >
        <div className="text-center">
          <h1 className="mb-3">Create A Community</h1>
          <p className="lead mb-0">
            Start a new community for people who share your interests
          </p>
        </div>
      </FullWidthSection>

      {/* Form Section */}
      <FullWidthSection
        backgroundColor="var(--color-purple)"
        padding="80px 20px 150px"
        minHeight="600px"
        containerMaxWidth="800px"
      >
        <div
          style={{
            backgroundColor: "rgba(226, 226, 226, 0.6)",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          {success && (
            <Alert color="success" fade={false}>
              Community created successfully! Redirecting...
            </Alert>
          )}

          <ErrorAlert errors={errors} />

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">
                Community Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Enter community name"
                maxLength={100}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                id="description"
                type="textarea"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Describe your community..."
                maxLength={2000}
              />
              <div className="small text-muted mt-1">
                {description.length}/2000 characters
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="interest">Related Interest (Optional)</Label>
              <Input
                id="interest"
                type="select"
                value={interestId}
                onChange={(e) => setInterestId(e.target.value)}
                disabled={loading}
              >
                <option value="">-- No specific interest --</option>
                {interests.map((interest) => (
                  <option key={interest.id} value={interest.id}>
                    {interest.name}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={loading}
                placeholder="https://example.com/image.jpg"
              />
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  disabled={loading}
                />{" "}
                Make this a private community
              </Label>
              <div className="small text-muted mt-1">
                Private communities are not listed publicly and require an invitation to join
              </div>
            </FormGroup>

            <div className="d-grid gap-2 mt-4">
              <Button color="secondary" type="submit" disabled={loading}>
                {loading ? "Creating Community..." : "Create Community"}
              </Button>
              <Button
                color="secondary"
                outline
                onClick={() => navigate("/communities")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </FullWidthSection>
    </div>
  );
}
