import { useState, useEffect, useRef } from "react";
import { getCommunityMessages, sendCommunityMessage } from "../../managers/messageManager";
import { Input, Button, Alert, Spinner } from "reactstrap";

export default function CommunityForum({ communityId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    // Poll for new messages every 10 seconds
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [communityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const data = await getCommunityMessages(communityId);
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load messages.");
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError("");

    try {
      await sendCommunityMessage(communityId, newMessage.trim());
      setNewMessage("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner color="dark" />
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3">Forum</h4>

      {error && <Alert color="danger" fade={false}>{error}</Alert>}

      {/* Messages Container */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          padding: "20px",
          minHeight: "400px",
          maxHeight: "600px",
          overflowY: "auto",
          marginBottom: "20px",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="mb-3 pb-3"
              style={{ borderBottom: "1px solid #dee2e6" }}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <strong style={{ color: "var(--color-dark)" }}>
                  {message.senderDisplayName || message.senderUsername}
                </strong>
                <small className="text-muted">
                  {new Date(message.sentAt).toLocaleString()}
                </small>
              </div>
              {message.replyToSenderName && (
                <div
                  className="small text-muted mb-1"
                  style={{
                    paddingLeft: "10px",
                    borderLeft: "2px solid var(--color-cyan)",
                  }}
                >
                  Replying to {message.replyToSenderName}
                </div>
              )}
              <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-muted p-5">
            <p>No messages yet. Be the first to start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage}>
        <div className="d-flex gap-2">
          <Input
            type="textarea"
            rows="2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            maxLength={5000}
          />
          <Button
            color="dark"
            type="submit"
            disabled={sending || !newMessage.trim()}
            style={{ minWidth: "100px" }}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
        <div className="small text-muted mt-1">
          {newMessage.length}/5000 characters
        </div>
      </form>
    </div>
  );
}
