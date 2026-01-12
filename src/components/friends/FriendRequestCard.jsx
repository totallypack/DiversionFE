import { useState } from "react";
import { Card, CardBody, Button, Spinner } from "reactstrap";

export default function FriendRequestCard({ request, type, onAction }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await onAction(request.id, action);
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = type === "received"
    ? request.senderDisplayName || request.senderUsername
    : request.receiverDisplayName || request.receiverUsername;

  const userId = type === "received" ? request.senderId : request.receiverId;

  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{displayName}</h5>
            <p className="text-muted mb-0 small">
              {type === "received" ? "Wants to be your friend" : "Request sent"}
            </p>
            <p className="text-muted mb-0 small">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="d-flex gap-2">
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                {type === "received" && (
                  <>
                    <Button
                      color="dark"
                      size="sm"
                      onClick={() => handleAction("accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={() => handleAction("reject")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {type === "sent" && (
                  <Button
                    color="secondary"
                    outline
                    size="sm"
                    onClick={() => handleAction("cancel")}
                  >
                    Cancel
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
