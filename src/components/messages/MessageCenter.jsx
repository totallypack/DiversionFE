import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getConversations } from "../../managers/messageManager";
import NavBar from "../NavBar";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import { Row, Col } from "reactstrap";

export default function MessageCenter() {
  const { userId: urlUserId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(urlUserId || null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    // Poll for new conversations every 30 seconds
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (urlUserId) {
      // If URL has userId, find the conversation and set it as selected
      const conversation = conversations.find((c) => c.userId === urlUserId);
      if (conversation) {
        setSelectedUserId(urlUserId);
        setSelectedUserName(conversation.displayName || conversation.username);
      }
    }
  }, [urlUserId, conversations]);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setLoading(false);
    }
  };

  const handleSelectConversation = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />

      {/* Message Center Container */}
      <div
        style={{
          flex: 1,
          marginTop: "80px",
          backgroundColor: "var(--color-light-grey)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            height: "calc(100vh - 140px)",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row style={{ height: "100%", margin: 0 }}>
            {/* Conversations List */}
            <Col
              md={4}
              style={{
                borderRight: "1px solid #dee2e6",
                padding: 0,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <div
                className="p-3"
                style={{
                  borderBottom: "1px solid #dee2e6",
                  backgroundColor: "var(--color-light-grey)",
                }}
              >
                <h5 className="mb-0">Messages</h5>
              </div>
              <ConversationList
                conversations={conversations}
                selectedUserId={selectedUserId}
                onSelectConversation={handleSelectConversation}
                loading={loading}
              />
            </Col>

            {/* Message Thread */}
            <Col md={8} style={{ padding: 0, height: "100%" }}>
              <MessageThread
                otherUserId={selectedUserId}
                otherUserName={selectedUserName}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
