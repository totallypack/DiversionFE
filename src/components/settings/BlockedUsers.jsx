import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Spinner,
  Alert,
} from "reactstrap";
import { getBlockedUsers, unblockUser } from "../../managers/userBlockManager";
import "./BlockedUsers.css";

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unblocking, setUnblocking] = useState(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error("Failed to load blocked users:", err);
      setError("Failed to load blocked users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockId) => {
    setUnblocking(blockId);
    try {
      await unblockUser(blockId);
      await loadBlockedUsers();
    } catch (err) {
      console.error("Failed to unblock user:", err);
      setError("Failed to unblock user. Please try again.");
    } finally {
      setUnblocking(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <NavBar />
      <Container className="blocked-users-container">
        <Row className="mb-4">
          <Col>
            <h1>Blocked Users</h1>
            <p className="text-muted">
              Manage users you've blocked. Blocked users cannot interact with you.
            </p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3">
            <Col>
              <Alert color="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {loading ? (
          <Row>
            <Col className="text-center py-5">
              <Spinner color="dark" />
              <p className="mt-3">Loading blocked users...</p>
            </Col>
          </Row>
        ) : blockedUsers.length === 0 ? (
          <Row>
            <Col>
              <Card>
                <CardBody className="text-center py-5">
                  <h4>No blocked users</h4>
                  <p className="text-muted">You haven't blocked anyone yet.</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Blocked On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockedUsers.map((block) => (
                        <tr key={block.id}>
                          <td>
                            <div>
                              <strong>
                                {block.blockedDisplayName || block.blockedUsername}
                              </strong>
                              <br />
                              <small className="text-muted">
                                @{block.blockedUsername}
                              </small>
                            </div>
                          </td>
                          <td>{formatDate(block.createdAt)}</td>
                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => handleUnblock(block.id)}
                              disabled={unblocking === block.id}
                            >
                              {unblocking === block.id ? "Unblocking..." : "Unblock"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="mt-4">
          <Col>
            <Link to="/my-profile" className="btn btn-secondary">
              Back to Profile
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
