import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../managers/eventManager";
import { getAllInterestsWithSubInterests } from "../managers/interestManager";
import { US_STATES } from "../constants/locationConstants";
import { validateEventForm } from "../utils/eventValidation";
import NavBar from "./NavBar";
import ErrorAlert from "./common/ErrorAlert";
import FullWidthSection from "./common/FullWidthSection";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [eventType, setEventType] = useState("Online");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [interestTagId, setInterestTagId] = useState("");
  const [selectedInterestId, setSelectedInterestId] = useState("");
  const [requiresRsvp, setRequiresRsvp] = useState(false);
  const [interests, setInterests] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const data = await getAllInterestsWithSubInterests();
      setInterests(data);
      setLoadingInterests(false);
    } catch (error) {
      setErrors(["Failed to load interests. Please try again."]);
      setLoadingInterests(false);
    }
  };

  const handleInterestChange = (e) => {
    const newInterestId = e.target.value;
    setSelectedInterestId(newInterestId);
    setInterestTagId(""); // Reset subinterest selection when interest changes
  };

  const getFilteredSubInterests = () => {
    if (!selectedInterestId) return [];
    const selectedInterest = interests.find((i) => i.id === selectedInterestId);
    return selectedInterest?.subInterests || [];
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateEventForm({
      title,
      startDateTime,
      endDateTime,
      interestTagId,
      eventType,
      meetingUrl,
      city,
      state,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: title.trim(),
        description: description.trim() || null,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: new Date(endDateTime).toISOString(),
        eventType,
        streetAddress: eventType === "InPerson" ? streetAddress.trim() || null : null,
        city: eventType === "InPerson" ? city.trim() : null,
        state: eventType === "InPerson" ? state : null,
        meetingUrl: eventType === "Online" ? meetingUrl.trim() : null,
        interestTagId,
        requiresRsvp,
      };

      const result = await createEvent(eventData);
      navigate(`/events/${result.id}`);
    } catch (error) {
      setLoading(false);
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["Failed to create event. Please try again."]);
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
          <h1 className="mb-3">Create A New Event</h1>
          <p className="lead mb-0">
            Organize a gathering for your community
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
          <ErrorAlert errors={errors} />

          {loadingInterests ? (
            <div className="text-center">
              <p>Loading interests...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="title">
                        Event Title <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        placeholder="Enter event title"
                        maxLength={200}
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
                        placeholder="Describe your event..."
                        maxLength={2000}
                      />
                      <div className="small text-muted mt-1">
                        {description.length}/2000 characters
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label for="interest">
                        Interest Category <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="interest"
                        type="select"
                        value={selectedInterestId}
                        onChange={handleInterestChange}
                        disabled={loading}
                      >
                        <option value="">-- Select a category --</option>
                        {interests.map((interest) => (
                          <option key={interest.id} value={interest.id}>
                            {interest.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    {selectedInterestId && (
                      <FormGroup>
                        <Label for="interestTag">
                          Specific Interest <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="interestTag"
                          type="select"
                          value={interestTagId}
                          onChange={(e) => setInterestTagId(e.target.value)}
                          disabled={loading}
                        >
                          <option value="">-- Select a specific interest --</option>
                          {getFilteredSubInterests().map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    )}

                    <FormGroup>
                      <Label for="startDateTime">
                        Start Date & Time <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="startDateTime"
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        disabled={loading}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="endDateTime">
                        End Date & Time <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="endDateTime"
                        type="datetime-local"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        disabled={loading}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="eventType">
                        Event Type <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="eventType"
                        type="select"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        disabled={loading}
                      >
                        <option value="Online">Online</option>
                        <option value="InPerson">In-Person</option>
                      </Input>
                    </FormGroup>

                    {eventType === "Online" && (
                      <FormGroup>
                        <Label for="meetingUrl">
                          Meeting URL <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="meetingUrl"
                          type="url"
                          value={meetingUrl}
                          onChange={(e) => setMeetingUrl(e.target.value)}
                          disabled={loading}
                          placeholder="https://zoom.us/j/..."
                        />
                      </FormGroup>
                    )}

                    {eventType === "InPerson" && (
                      <>
                        <FormGroup>
                          <Label for="streetAddress">Street Address</Label>
                          <Input
                            id="streetAddress"
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            disabled={loading}
                            placeholder="123 Main Street"
                            maxLength={500}
                          />
                          <div className="small text-muted mt-1">
                            Enter the street address or venue name
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <Label for="city">
                            City <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={loading}
                            placeholder="Enter city"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label for="state">
                            State <span className="text-danger">*</span>
                          </Label>
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
                      </>
                    )}

                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={requiresRsvp}
                          onChange={(e) => setRequiresRsvp(e.target.checked)}
                          disabled={loading}
                        />{" "}
                        Require RSVP
                      </Label>
                      <div className="small text-muted mt-1">
                        If checked, users must RSVP to attend
                      </div>
                    </FormGroup>

                    <div className="d-grid gap-2 mt-4">
                      <Button color="secondary" type="submit" disabled={loading}>
                        {loading ? "Creating Event..." : "Create Event"}
                      </Button>
                      <Button
                        color="secondary"
                        outline
                        onClick={() => navigate(-1)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
            </Form>
          )}
        </div>
      </FullWidthSection>
    </div>
  );
}
