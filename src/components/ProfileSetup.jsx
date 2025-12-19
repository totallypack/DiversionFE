import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, updateProfile, getMyProfile } from "../managers/profileManager";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export default function ProfileSetup() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    displayName: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    try {
      const profile = await getMyProfile();
      if (profile) {
        setIsEdit(true);
        setDisplayName(profile.displayName || "");
        setBio(profile.bio || "");
        setCity(profile.city || "");
        setState(profile.state || "");
        setDob(profile.dob ? profile.dob.split("T")[0] : "");
        setProfilePicUrl(profile.profilePicUrl || "");
      }
    } catch (error) {
      if (error.message === "Unauthorized" || error.message === "Failed to load profile") {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Error loading profile:", error);
      }
    }
  };

  const validateDisplayName = (value) => {
    if (!value || value.trim().length === 0) {
      return "Display name is required";
    }
    if (value.length < 2 || value.length > 50) {
      return "Display name must be between 2 and 50 characters";
    }
    return "";
  };

  const handleDisplayNameChange = (e) => {
    const value = e.target.value;
    setDisplayName(value);
    setFieldErrors({ ...fieldErrors, displayName: validateDisplayName(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const displayNameError = validateDisplayName(displayName);
    setFieldErrors({ displayName: displayNameError });

    if (displayNameError) {
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        displayName: displayName.trim(),
        bio: bio.trim() || null,
        city: city.trim() || null,
        state: state || null,
        dob: dob || null,
        profilePicUrl: profilePicUrl.trim() || null,
      };

      if (isEdit) {
        await updateProfile(profileData);
      } else {
        await createProfile(profileData);
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        if (isEdit) {
          navigate("/my-profile");
        } else {
          navigate("/select-interests");
        }
      }, 2000);
    } catch (error) {
      setLoading(false);
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["Failed to save profile. Please try again."]);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <CardBody>
              <h2 className="text-center mb-4">
                {isEdit ? "Edit Your Profile" : "Create Your Profile"}
              </h2>

              {success && (
                <Alert color="success" fade={false}>
                  {isEdit
                    ? "Profile updated successfully! Redirecting to your profile..."
                    : "Profile created successfully! Redirecting to interest selection..."}
                </Alert>
              )}

              {errors.length > 0 && (
                <Alert color="danger" fade={false}>
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="displayName">
                    Display Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={handleDisplayNameChange}
                    invalid={!!fieldErrors.displayName}
                    disabled={loading}
                    placeholder="How should we call you?"
                  />
                  {fieldErrors.displayName && (
                    <div className="text-danger small mt-1">
                      {fieldErrors.displayName}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="bio">Bio</Label>
                  <Input
                    id="bio"
                    type="textarea"
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={loading}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <div className="small text-muted mt-1">
                    {bio.length}/500 characters
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label for="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your city"
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="state">State</Label>
                  <Input
                    id="state"
                    type="select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select a state...</option>
                    {US_STATES.map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    disabled={loading}
                  />
                  <div className="small text-muted mt-1">
                    Optional - helps us show age-appropriate content
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label for="profilePicUrl">Profile Picture URL</Label>
                  <Input
                    id="profilePicUrl"
                    type="url"
                    value={profilePicUrl}
                    onChange={(e) => setProfilePicUrl(e.target.value)}
                    disabled={loading}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <div className="small text-muted mt-1">
                    Optional - Enter a URL to your profile picture
                  </div>
                </FormGroup>

                {profilePicUrl && (
                  <FormGroup>
                    <Label>Preview</Label>
                    <div className="text-center">
                      <img
                        src={profilePicUrl}
                        alt="Profile preview"
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </FormGroup>
                )}

                <div className="d-grid gap-2">
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading
                      ? isEdit
                        ? "Updating..."
                        : "Creating..."
                      : isEdit
                      ? "Update Profile"
                      : "Create Profile"}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    onClick={() => navigate("/")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
