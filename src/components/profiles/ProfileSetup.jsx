import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, updateProfile, getMyProfile } from "../../managers/profileManager";
import { US_STATES } from "../../constants/locationConstants";
import ErrorAlert from "../common/ErrorAlert";
import NavBar from "../NavBar";
import FullWidthSection from "../common/FullWidthSection";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";

export default function ProfileSetup() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [userType, setUserType] = useState("Regular");
  const [businessName, setBusinessName] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [imageError, setImageError] = useState(false);
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
      if (profile && profile.id !== "00000000-0000-0000-0000-000000000000") {
        setIsEdit(true);
        setDisplayName(profile.displayName || "");
        setBio(profile.bio || "");
        setCity(profile.city || "");
        setState(profile.state || "");
        setDob(profile.dob ? profile.dob.split("T")[0] : "");
        setProfilePicUrl(profile.profilePicUrl || "");
        setUserType(profile.userType || "Regular");
        setBusinessName(profile.businessName || "");
        setBusinessWebsite(profile.businessWebsite || "");
        setBusinessHours(profile.businessHours || "");
        setBusinessCategory(profile.businessCategory || "");
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
        userType: userType,
        businessName: userType === "Business" ? (businessName.trim() || null) : null,
        businessWebsite: userType === "Business" ? (businessWebsite.trim() || null) : null,
        businessHours: userType === "Business" ? (businessHours.trim() || null) : null,
        businessCategory: userType === "Business" ? (businessCategory.trim() || null) : null,
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
          <h1 className="mb-3">
            {isEdit ? "Edit Your Profile" : "Create Your Profile"}
          </h1>
          <p className="lead mb-0">
            {isEdit
              ? "Update your profile information"
              : "Tell us about yourself to get started"}
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
              {isEdit
                ? "Profile updated successfully! Redirecting to your profile..."
                : "Profile created successfully! Redirecting to interest selection..."}
            </Alert>
          )}

          <ErrorAlert errors={errors} />

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
                  <Label for="userType">Account Type <span className="text-danger">*</span></Label>
                  <Input
                    id="userType"
                    type="select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Regular">Regular User</option>
                    <option value="Business">Business Account</option>
                    <option value="Caregiver">Caregiver Account</option>
                  </Input>
                  <div className="small text-muted mt-1">
                    {userType === "Business" && "Business accounts can create paid events and workshops"}
                    {userType === "Caregiver" && "Caregiver accounts can manage dependents and access specialized resources"}
                    {userType === "Regular" && "Standard account for discovering and attending events"}
                  </div>
                </FormGroup>

                {userType === "Business" && (
                  <>
                    <FormGroup>
                      <Label for="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        disabled={loading}
                        placeholder="Your business name"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="businessWebsite">Business Website</Label>
                      <Input
                        id="businessWebsite"
                        type="url"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        disabled={loading}
                        placeholder="https://your-business.com"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="businessHours">Business Hours</Label>
                      <Input
                        id="businessHours"
                        type="text"
                        value={businessHours}
                        onChange={(e) => setBusinessHours(e.target.value)}
                        disabled={loading}
                        placeholder="e.g., Mon-Fri 9am-5pm"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="businessCategory">Business Category</Label>
                      <Input
                        id="businessCategory"
                        type="select"
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select a category...</option>
                        <option value="Arts & Crafts">Arts & Crafts</option>
                        <option value="Education">Education</option>
                        <option value="Fitness & Wellness">Fitness & Wellness</option>
                        <option value="Technology">Technology</option>
                        <option value="Music & Performance">Music & Performance</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Other">Other</option>
                      </Input>
                    </FormGroup>
                  </>
                )}

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
                    onChange={(e) => {
                      setProfilePicUrl(e.target.value);
                      setImageError(false);
                    }}
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
                      {!imageError ? (
                        <img
                          src={profilePicUrl}
                          alt="Profile preview"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div>
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              borderRadius: "50%",
                              backgroundColor: "#6c757d",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "48px",
                              fontWeight: "bold",
                            }}
                          >
                            {displayName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="text-danger small mt-2">
                            ⚠️ Unable to load image from this URL
                          </div>
                        </div>
                      )}
                    </div>
                  </FormGroup>
                )}

            <div className="d-grid gap-2">
              <Button color="secondary" type="submit" disabled={loading}>
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
        </div>
      </FullWidthSection>
    </div>
  );
}
