import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Badge, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { getMyRecipients, updateCareRelationshipPermissions, revokeCareRelationship, reactivateCareRelationship, deleteCareRelationship } from "../../managers/caregiverManager";
import { useNavigate } from "react-router-dom";

export const MyRecipientsView = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      const data = await getMyRecipients();
      setRecipients(data);
      setError(null);
    } catch (err) {
      setError("Failed to load recipients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermissions = (relationship) => {
    setEditingId(relationship.id);
    setPermissions({
      canManageEvents: relationship.canManageEvents,
      canManageProfile: relationship.canManageProfile,
      canManageFriendships: relationship.canManageFriendships,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPermissions({});
  };

  const handleSavePermissions = async (relationshipId) => {
    try {
      await updateCareRelationshipPermissions(relationshipId, permissions);
      await loadRecipients();
      setEditingId(null);
      setPermissions({});
    } catch (err) {
      setError("Failed to update permissions");
      console.error(err);
    }
  };

  const handleRevoke = async (relationshipId) => {
    if (window.confirm("Are you sure you want to revoke this care relationship? You can reactivate it later.")) {
      try {
        await revokeCareRelationship(relationshipId);
        await loadRecipients();
      } catch (err) {
        setError("Failed to revoke relationship");
        console.error(err);
      }
    }
  };

  const handleReactivate = async (relationshipId) => {
    try {
      await reactivateCareRelationship(relationshipId);
      await loadRecipients();
    } catch (err) {
      setError("Failed to reactivate relationship");
      console.error(err);
    }
  };

  const handleDelete = async (relationshipId) => {
    if (window.confirm("Are you sure you want to permanently delete this care relationship? This cannot be undone.")) {
      try {
        await deleteCareRelationship(relationshipId);
        await loadRecipients();
      } catch (err) {
        setError("Failed to delete relationship");
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
        <p>Loading recipients...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Recipients</h2>

      {error && <Alert color="danger">{error}</Alert>}

      {recipients.length === 0 ? (
        <Alert color="info">
          You are not currently providing care for any recipients.
        </Alert>
      ) : (
        <Row>
          {recipients.map((relationship) => (
            <Col md={6} lg={4} key={relationship.id} className="mb-3">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <CardTitle tag="h5" className="mb-0">
                      {relationship.recipientDisplayName || relationship.recipientUsername}
                    </CardTitle>
                    {relationship.isActive ? (
                      <Badge color="success">Active</Badge>
                    ) : (
                      <Badge color="secondary">Revoked</Badge>
                    )}
                  </div>

                  <p className="text-muted small mb-2">@{relationship.recipientUsername}</p>
                  <p className="text-muted small mb-3">
                    Since: {new Date(relationship.createdAt).toLocaleDateString()}
                  </p>

                  {editingId === relationship.id ? (
                    <Form>
                      <FormGroup check className="mb-2">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={permissions.canManageEvents}
                            onChange={(e) =>
                              setPermissions((prev) => ({
                                ...prev,
                                canManageEvents: e.target.checked,
                              }))
                            }
                            disabled={!relationship.isActive}
                          />
                          Manage Events
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mb-2">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={permissions.canManageProfile}
                            onChange={(e) =>
                              setPermissions((prev) => ({
                                ...prev,
                                canManageProfile: e.target.checked,
                              }))
                            }
                            disabled={!relationship.isActive}
                          />
                          Manage Profile
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mb-3">
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={permissions.canManageFriendships}
                            onChange={(e) =>
                              setPermissions((prev) => ({
                                ...prev,
                                canManageFriendships: e.target.checked,
                              }))
                            }
                            disabled={!relationship.isActive}
                          />
                          Manage Friendships
                        </Label>
                      </FormGroup>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleSavePermissions(relationship.id)}
                        className="me-2"
                      >
                        Save
                      </Button>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <div className="mb-3">
                        <strong>Permissions:</strong>
                        <ul className="list-unstyled mt-2 mb-0">
                          <li>
                            {relationship.canManageEvents ? "✓" : "✗"} Manage Events
                          </li>
                          <li>
                            {relationship.canManageProfile ? "✓" : "✗"} Manage Profile
                          </li>
                          <li>
                            {relationship.canManageFriendships ? "✓" : "✗"} Manage Friendships
                          </li>
                        </ul>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => handleViewProfile(relationship.recipientId)}
                        >
                          View Profile
                        </Button>
                        {relationship.isActive ? (
                          <>
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => handleRevoke(relationship.id)}
                            >
                              Revoke
                            </Button>
                          </>
                        ) : (
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => handleReactivate(relationship.id)}
                          >
                            Reactivate
                          </Button>
                        )}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(relationship.id)}
                        >
                          Delete
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
