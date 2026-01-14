import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { blockUser, unblockUser, getBlockingStatus } from "../../managers/userBlockManager";
import "./BlockButton.css";

export default function BlockButton({ userId, username, onBlockChange }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBlockingStatus();
  }, [userId]);

  const checkBlockingStatus = async () => {
    try {
      const status = await getBlockingStatus(userId);
      setIsBlocked(status.userBlockedOther);
      // Note: We'd need to store the block ID separately if we want to track it
    } catch (err) {
      console.error("Failed to check blocking status:", err);
    }
  };

  const toggle = () => {
    setModal(!modal);
    setError(null);
  };

  const handleBlock = async () => {
    setLoading(true);
    setError(null);

    try {
      await blockUser(userId);
      setIsBlocked(true);
      toggle();
      if (onBlockChange) {
        onBlockChange(true);
      }
    } catch (err) {
      console.error("Failed to block user:", err);
      setError("Failed to block user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    setError(null);

    try {
      // We need to get the block ID first
      const blockedUsers = await import("../../managers/userBlockManager").then(m => m.getBlockedUsers());
      const block = blockedUsers.find(b => b.blockedUserId === userId);

      if (block) {
        await unblockUser(block.id);
        setIsBlocked(false);
        toggle();
        if (onBlockChange) {
          onBlockChange(false);
        }
      }
    } catch (err) {
      console.error("Failed to unblock user:", err);
      setError("Failed to unblock user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color={isBlocked ? "secondary" : "warning"}
        outline
        size="sm"
        onClick={toggle}
        className="block-button"
      >
        {isBlocked ? "🔓 Unblock" : "🚫 Block"}
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isBlocked ? "Unblock User" : "Block User"}
        </ModalHeader>
        <ModalBody>
          {isBlocked ? (
            <>
              <p>Are you sure you want to unblock <strong>{username}</strong>?</p>
              <p>You will be able to see each other's content and interact again.</p>
            </>
          ) : (
            <>
              <p>Are you sure you want to block <strong>{username}</strong>?</p>
              <p>When you block someone:</p>
              <ul>
                <li>You won't see their events, posts, or profile</li>
                <li>They won't see your events, posts, or profile</li>
                <li>You can't send messages to each other</li>
                <li>You can't send friend requests to each other</li>
              </ul>
              <p className="text-muted">You can unblock them at any time from your settings.</p>
            </>
          )}
          {error && <div className="text-danger mt-2">{error}</div>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button
            color={isBlocked ? "primary" : "warning"}
            onClick={isBlocked ? handleUnblock : handleBlock}
            disabled={loading}
          >
            {loading ? "Processing..." : isBlocked ? "Unblock" : "Block"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
