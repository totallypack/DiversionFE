import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../managers/eventManager";
import { getAllInterestsWithSubInterests } from "../managers/interestManager";
import NavBar from "./NavBar";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [eventType, setEventType] = useState("Online");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [interestTagId, setInterestTagId] = useState("");
  const [requiresRsvp, setRequiresRsvp] = useState(false);
  const [interests, setInterests] = useState([]);
  const [subInterests, setSubInterests] = useState([]);
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

      // Flatten all subinterests for easier selection
      const allSubInterests = data.flatMap((interest) =>
        interest.subInterests.map((sub) => ({
          ...sub,
          interestName: interest.name,
        }))
      );
      setSubInterests(allSubInterests);
      setLoadingInterests(false);
    } catch (error) {
      setErrors(["Failed to load interests. Please try again."]);
      setLoadingInterests(false);
    }
  };

  const validateForm = () => {
    const newErrors = [];

    if (!title.trim()) {
      newErrors.push("Title is required");
    }

    if (!startDateTime) {
      newErrors.push("Start date and time are required");
    }

    if (!endDateTime) {
      newErrors.push("End date and time are required");
    }

    if (startDateTime && endDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
      newErrors.push("End date must be after start date");
    }

    if (startDateTime && new Date(startDateTime) <= new Date()) {
      newErrors.push("Start date must be in the future");
    }

    if (!interestTagId) {
      newErrors.push("Please select an interest tag");
    }

    if (eventType === "Online" && !meetingUrl.trim()) {
      newErrors.push("Meeting URL is required for online events");
    }

    if (eventType === "InPerson" && !location.trim()) {
      newErrors.push("Location is required for in-person events");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateForm();
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
        location: eventType === "InPerson" ? location.trim() : null,
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
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card>
              <CardBody>
                <h2 className="text-center mb-4">Create New Event</h2>

                {errors.length > 0 && (
                  <Alert color="danger" fade={false}>
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

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
                      <Label for="interestTag">
                        Interest Tag <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="interestTag"
                        type="select"
                        value={interestTagId}
                        onChange={(e) => setInterestTagId(e.target.value)}
                        disabled={loading}
                      >
                        <option value="">-- Select an interest --</option>
                        {subInterests.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.interestName} - {sub.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

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
                        <div className="small text-muted mt-1">
                          Enter the virtual meeting link (Zoom, Google Meet, etc.)
                        </div>
                      </FormGroup>
                    )}

                    {eventType === "InPerson" && (
                      <FormGroup>
                        <Label for="location">
                          Location <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          disabled={loading}
                          placeholder="123 Main St, City, State"
                          maxLength={500}
                        />
                        <div className="small text-muted mt-1">
                          Enter the physical address or venue
                        </div>
                      </FormGroup>
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
                      <Button color="primary" type="submit" disabled={loading}>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
