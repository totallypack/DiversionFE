import { ListGroup, ListGroupItem, Badge, Spinner } from "reactstrap";

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  loading,
}) {
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner color="dark" size="sm" />
        <p className="mt-2 small">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted small">
          No conversations yet. Send a message to a friend to start!
        </p>
      </div>
    );
  }

  return (
    <ListGroup flush>
      {conversations.map((conversation) => (
        <ListGroupItem
          key={conversation.userId}
          action
          active={selectedUserId === conversation.userId}
          onClick={() => onSelectConversation(conversation.userId, conversation.displayName || conversation.username)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <strong className="d-block text-truncate">
                  {conversation.displayName || conversation.username}
                </strong>
                {conversation.lastMessageTime && (
                  <small className="text-muted ms-2">
                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                  </small>
                )}
              </div>
              {conversation.lastMessageContent && (
                <p
                  className="mb-0 small text-muted text-truncate"
                  style={{ maxWidth: "100%" }}
                >
                  {conversation.lastMessageContent}
                </p>
              )}
            </div>
            {conversation.unreadCount > 0 && (
              <Badge color="danger" pill className="ms-2">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
