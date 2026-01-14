import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input, Alert } from "reactstrap";
import { getMyRecipients } from "../../managers/caregiverManager";

export const ActingAsSelector = ({
  value,
  onChange,
  requiredPermission = null,
  label = "Acting on behalf of",
  includeMyself = true,
  currentUser = null
}) => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      const data = await getMyRecipients();

      // Filter by required permission if specified
      let filtered = data.filter(r => r.isActive);

      if (requiredPermission) {
        filtered = filtered.filter(r => {
          switch (requiredPermission) {
            case "events":
              return r.canManageEvents;
            case "profile":
              return r.canManageProfile;
            case "friendships":
              return r.canManageFriendships;
            default:
              return true;
          }
        });
      }

      setRecipients(filtered);
      setError(null);
    } catch (err) {
      setError("Failed to load recipients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FormGroup>
        <Label>{label}</Label>
        <Input type="select" disabled>
          <option>Loading recipients...</option>
        </Input>
      </FormGroup>
    );
  }

  if (error) {
    return (
      <FormGroup>
        <Label>{label}</Label>
        <Alert color="warning" className="mb-0">{error}</Alert>
      </FormGroup>
    );
  }

  // Only show selector if there are recipients with the required permission
  if (recipients.length === 0) {
    return null;
  }

  return (
    <FormGroup>
      <Label for="actingAs">{label}</Label>
      <Input
        type="select"
        name="actingAs"
        id="actingAs"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        {includeMyself && (
          <option value="">
            {currentUser ? `Myself (${currentUser})` : "Myself"}
          </option>
        )}
        {recipients.map((recipient) => (
          <option key={recipient.id} value={recipient.recipientId}>
            {recipient.recipientDisplayName || recipient.recipientUsername} (@{recipient.recipientUsername})
          </option>
        ))}
      </Input>
      {value && (
        <small className="text-muted">
          You are acting on behalf of this user with the appropriate permissions.
        </small>
      )}
    </FormGroup>
  );
};
