import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Alert, Form, FormGroup, Label, Input } from "reactstrap";
import { getReceivedCaregiverRequests, acceptCaregiverRequest, rejectCaregiverRequest } from "../../managers/caregiverManager";
import { useNavigate } from "react-router-dom";

export const CaregiverRequestInbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [customPermissions, setCustomPermissions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getReceivedCaregiverRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load caregiver requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAccept = (request) => {
    setAcceptingId(request.id);
    setCustomPermissions({
      canManageEvents: request.requestCanManageEvents,
      canManageProfile: request.requestCanManageProfile,
      canManageFriendships: request.requestCanManageFriendships,
    });
  };

  const handleCancelAccept = () => {
    setAcceptingId(null);
    setCustomPermissions({});
  };

  const handleAccept = async (requestId) => {
    try {
      await acceptCaregiverRequest(requestId, customPermissions);
      await loadRequests();
      setAcceptingId(null);
      setCustomPermissions({});
    } catch (err) {
      setError("Failed to accept request");
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm("Are you sure you want to reject this caregiver request?")) {
      try {
        await rejectCaregiverRequest(requestId);
        await loadRequests();
      } catch (err) {
        setError("Failed to reject request");
        console.error(err);
      }
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Loading requests...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Caregiver Requests</h2>

      {error && <Alert color="danger">{error}</Alert>}

      {requests.length === 0 ? (
        <Alert color="info">
          You have no pending caregiver requests.
        </Alert>
      ) : (
        <Row>
          {requests.map((request) => (
            <Col md={6} lg={4} key={request.id} className="mb-3">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <CardTitle tag="h5" className="mb-0">
                      {request.senderDisplayName || request.senderUsername}
                    </CardTitle>
                    <Badge color="warning">Pending</Badge>
                  </div>

                  <p className="text-muted small mb-2">@{request.senderUsername}</p>
                  <p className="text-muted small mb-3">
                    Sent: {new Date(request.createdAt).toLocaleDateString()}
                  </p>

                  {request.requestMessage && (
                    <CardText className="mb-3 p-2 bg-light rounded">
                      <small>{request.requestMessage}</small>
                    </CardText>
                  )}

                  {acceptingId === request.id ? (
                    <Form>
                      <p className="small mb-2">
                        <strong>Customize permissions:</strong>
                      </p>
                      <FormGroup check className="mb-2">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={customPermissions.canManageEvents}
                            onChange={(e) =>
                              setCustomPermissions((prev) => ({
                                ...prev,
                                canManageEvents: e.target.checked,
                              }))
                            }
                          />
                          Allow managing my events
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mb-2">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={customPermissions.canManageProfile}
                            onChange={(e) =>
                              setCustomPermissions((prev) => ({
                                ...prev,
                                canManageProfile: e.target.checked,
                              }))
                            }
                          />
                          Allow managing my profile
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mb-3">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={customPermissions.canManageFriendships}
                            onChange={(e) =>
                              setCustomPermissions((prev) => ({
                                ...prev,
                                canManageFriendships: e.target.checked,
                              }))
                            }
                          />
                          Allow managing my friendships
                        </Label>
                      </FormGroup>
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        className="me-2"
                      >
                        Confirm Accept
                      </Button>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={handleCancelAccept}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <div className="mb-3">
                        <strong>Requested Permissions:</strong>
                        <ul className="list-unstyled mt-2 mb-0">
                          <li>
                            {request.requestCanManageEvents ? "✓" : "✗"} Manage Events
                          </li>
                          <li>
                            {request.requestCanManageProfile ? "✓" : "✗"} Manage Profile
                          </li>
                          <li>
                            {request.requestCanManageFriendships ? "✓" : "✗"} Manage Friendships
                          </li>
                        </ul>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => handleViewProfile(request.senderId)}
                        >
                          View Profile
                        </Button>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleStartAccept(request)}
                        >
                          Accept
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
