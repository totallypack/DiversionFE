import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge, Alert } from "reactstrap";
import { getSentCaregiverRequests, cancelCaregiverRequest } from "../../managers/caregiverManager";
import { useNavigate } from "react-router-dom";

export const CaregiverRequestSent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getSentCaregiverRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load sent requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await cancelCaregiverRequest(requestId);
        await loadRequests();
      } catch (err) {
        setError("Failed to cancel request");
        console.error(err);
      }
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge color="warning">Pending</Badge>;
      case "Accepted":
        return <Badge color="success">Accepted</Badge>;
      case "Rejected":
        return <Badge color="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Loading sent requests...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Sent Caregiver Requests</h2>

      {error && <Alert color="danger">{error}</Alert>}

      {requests.length === 0 ? (
        <Alert color="info">
          You have not sent any caregiver requests.
        </Alert>
      ) : (
        <Row>
          {requests.map((request) => (
            <Col md={6} lg={4} key={request.id} className="mb-3">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <CardTitle tag="h5" className="mb-0">
                      {request.recipientDisplayName || request.recipientUsername}
                    </CardTitle>
                    {getStatusBadge(request.status)}
                  </div>

                  <p className="text-muted small mb-2">@{request.recipientUsername}</p>
                  <p className="text-muted small mb-3">
                    Sent: {new Date(request.createdAt).toLocaleDateString()}
                    {request.respondedAt && (
                      <>
                        <br />
                        Responded: {new Date(request.respondedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>

                  {request.requestMessage && (
                    <CardText className="mb-3 p-2 bg-light rounded">
                      <small><strong>Your message:</strong><br />{request.requestMessage}</small>
                    </CardText>
                  )}

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
                      onClick={() => handleViewProfile(request.recipientId)}
                    >
                      View Profile
                    </Button>
                    {request.status === "Pending" && (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
