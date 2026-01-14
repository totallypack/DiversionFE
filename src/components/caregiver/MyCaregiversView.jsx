import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Badge, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { getMyCaregivers, updateCareRelationshipPermissions, revokeCareRelationship, reactivateCareRelationship, deleteCareRelationship } from "../../managers/caregiverManager";
import { useNavigate } from "react-router-dom";

export const MyCaregiversView = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCaregivers();
  }, []);

  const loadCaregivers = async () => {
    try {
      setLoading(true);
      const data = await getMyCaregivers();
      setCaregivers(data);
      setError(null);
    } catch (err) {
      setError("Failed to load caregivers");
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
      await loadCaregivers();
      setEditingId(null);
      setPermissions({});
    } catch (err) {
      setError("Failed to update permissions");
      console.error(err);
    }
  };

  const handleRevoke = async (relationshipId) => {
    if (window.confirm("Are you sure you want to revoke access for this caregiver? You can reactivate it later.")) {
      try {
        await revokeCareRelationship(relationshipId);
        await loadCaregivers();
      } catch (err) {
        setError("Failed to revoke relationship");
        console.error(err);
      }
    }
  };

  const handleReactivate = async (relationshipId) => {
    try {
      await reactivateCareRelationship(relationshipId);
      await loadCaregivers();
    } catch (err) {
      setError("Failed to reactivate relationship");
      console.error(err);
    }
  };

  const handleDelete = async (relationshipId) => {
    if (window.confirm("Are you sure you want to permanently remove this caregiver? This cannot be undone.")) {
      try {
        await deleteCareRelationship(relationshipId);
        await loadCaregivers();
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
        <p>Loading caregivers...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Caregivers</h2>

      {error && <Alert color="danger">{error}</Alert>}

      {caregivers.length === 0 ? (
        <Alert color="info">
          You do not have any caregivers assigned. You can accept caregiver requests from your inbox.
        </Alert>
      ) : (
        <Row>
          {caregivers.map((relationship) => (
            <Col md={6} lg={4} key={relationship.id} className="mb-3">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <CardTitle tag="h5" className="mb-0">
                      {relationship.caregiverDisplayName || relationship.caregiverUsername}
                    </CardTitle>
                    {relationship.isActive ? (
                      <Badge color="success">Active</Badge>
                    ) : (
                      <Badge color="secondary">Revoked</Badge>
                    )}
                  </div>

                  <p className="text-muted small mb-2">@{relationship.caregiverUsername}</p>
                  <p className="text-muted small mb-3">
                    Since: {new Date(relationship.createdAt).toLocaleDateString()}
                    {relationship.revokedAt && (
                      <>
                        <br />
                        Revoked: {new Date(relationship.revokedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>

                  {editingId === relationship.id ? (
                    <Form>
                      <p className="small mb-2">
                        <strong>Update permissions for this caregiver:</strong>
                      </p>
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
                        <strong>Current Permissions:</strong>
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
                          onClick={() => handleViewProfile(relationship.caregiverId)}
                        >
                          View Profile
                        </Button>
                        {relationship.isActive ? (
                          <>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => handleEditPermissions(relationship)}
                            >
                              Edit Permissions
                            </Button>
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => handleRevoke(relationship.id)}
                            >
                              Revoke Access
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
                          Remove
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
