import { useState, useEffect, useRef } from "react";
import { getMessagesWith, sendDirectMessage } from "../../managers/messageManager";
import { getMyProfile } from "../../managers/profileManager";
import { Input, Button, Alert, Spinner } from "reactstrap";

export default function MessageThread({ otherUserId, otherUserName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (otherUserId) {
      loadMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCurrentUser = async () => {
    try {
      const profile = await getMyProfile();
      setCurrentUserId(profile.userId);
    } catch (err) {
      console.error("Failed to load current user:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const data = await getMessagesWith(otherUserId);
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
      await sendDirectMessage(otherUserId, newMessage.trim());
      setNewMessage("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!otherUserId) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100%" }}
      >
        <p className="text-muted">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner color="dark" />
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      {/* Header */}
      <div
        className="p-3"
        style={{
          borderBottom: "1px solid #dee2e6",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <h5 className="mb-0">{otherUserName}</h5>
      </div>

      {error && (
        <div className="p-3">
          <Alert color="danger" fade={false}>
            {error}
          </Alert>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-grow-1 p-3"
        style={{
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`mb-3 d-flex ${
                  isOwnMessage ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    backgroundColor: isOwnMessage
                      ? "var(--color-cyan)"
                      : "#e9ecef",
                    color: isOwnMessage ? "white" : "black",
                  }}
                >
                  <p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
                    {message.content}
                  </p>
                  <small
                    style={{
                      opacity: 0.8,
                      fontSize: "0.75rem",
                    }}
                  >
                    {new Date(message.sentAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted p-5">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        className="p-3"
        style={{
          borderTop: "1px solid #dee2e6",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <form onSubmit={handleSendMessage}>
          <div className="d-flex gap-2">
            <Input
              type="textarea"
              rows="2"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              maxLength={2000}
            />
            <Button
              color="dark"
              type="submit"
              disabled={sending || !newMessage.trim()}
              style={{ minWidth: "80px" }}
            >
              {sending ? "..." : "Send"}
            </Button>
          </div>
          <div className="small text-muted mt-1">
            {newMessage.length}/2000 characters
          </div>
        </form>
      </div>
    </div>
  );
}
