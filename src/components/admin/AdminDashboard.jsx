import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  Table,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  getPendingReports,
  getAllReports,
  reviewReport,
  banUser,
  unbanUser,
  getModerationStats,
  getModerationActions,
} from "../../managers/moderationManager";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingReports, setPendingReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("Resolved");
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const statsData = await getModerationStats();
      setStats(statsData);

      if (activeTab === "pending") {
        const pending = await getPendingReports();
        setPendingReports(pending);
      } else if (activeTab === "all") {
        const all = await getAllReports();
        setAllReports(all);
      } else if (activeTab === "actions") {
        const actionsData = await getModerationActions();
        setActions(actionsData);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (report) => {
    setSelectedReport(report);
    setReviewStatus("Resolved");
    setAdminNotes("");
    setActionType("");
    setActionReason("");
    setReviewModal(true);
  };

  const closeReviewModal = () => {
    setReviewModal(false);
    setSelectedReport(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await reviewReport(
        selectedReport.id,
        reviewStatus,
        adminNotes || null,
        actionType || null,
        actionReason || null
      );
      closeReviewModal();
      loadData();
    } catch (err) {
      console.error("Failed to review report:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "UnderReview":
        return "info";
      case "Resolved":
        return "success";
      case "Dismissed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <NavBar />
      <Container className="admin-dashboard">
        <Row className="mb-4">
          <Col>
            <h1>Admin Dashboard</h1>
            <p className="text-muted">Moderation & Safety Management</p>
          </Col>
        </Row>

        {/* Statistics Cards */}
        {stats && (
          <Row className="mb-4">
            <Col md="3">
              <Card className="stat-card">
                <CardBody>
                  <CardTitle tag="h6" className="text-muted">
                    Pending Reports
                  </CardTitle>
                  <h2>{stats.pendingReportsCount}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="stat-card">
                <CardBody>
                  <CardTitle tag="h6" className="text-muted">
                    Under Review
                  </CardTitle>
                  <h2>{stats.underReviewReportsCount}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="stat-card">
                <CardBody>
                  <CardTitle tag="h6" className="text-muted">
                    Banned Users
                  </CardTitle>
                  <h2>{stats.bannedUsersCount}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="stat-card">
                <CardBody>
                  <CardTitle tag="h6" className="text-muted">
                    Actions (30d)
                  </CardTitle>
                  <h2>{stats.moderationActionsLast30Days}</h2>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tabs */}
        <Row className="mb-4">
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "pending" ? "active" : ""}
                  onClick={() => setActiveTab("pending")}
                  style={{ cursor: "pointer" }}
                >
                  Pending Reports
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "all" ? "active" : ""}
                  onClick={() => setActiveTab("all")}
                  style={{ cursor: "pointer" }}
                >
                  All Reports
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "actions" ? "active" : ""}
                  onClick={() => setActiveTab("actions")}
                  style={{ cursor: "pointer" }}
                >
                  Moderation Actions
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Pending Reports Table */}
        {!loading && activeTab === "pending" && (
          <Row>
            <Col>
              {pendingReports.length === 0 ? (
                <p className="text-center text-muted py-5">No pending reports</p>
              ) : (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Reporter</th>
                      <th>Reported User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>{report.reportedEntityType}</td>
                        <td>{report.reason}</td>
                        <td>{report.reporterUsername}</td>
                        <td>{report.reportedUsername || "N/A"}</td>
                        <td>{formatDate(report.createdAt)}</td>
                        <td>
                          <Badge color={getStatusColor(report.status)}>{report.status}</Badge>
                        </td>
                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => openReviewModal(report)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        )}

        {/* All Reports Table */}
        {!loading && activeTab === "all" && (
          <Row>
            <Col>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Reporter</th>
                    <th>Reported User</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Reviewed By</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.reportedEntityType}</td>
                      <td>{report.reason}</td>
                      <td>{report.reporterUsername}</td>
                      <td>{report.reportedUsername || "N/A"}</td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <Badge color={getStatusColor(report.status)}>{report.status}</Badge>
                      </td>
                      <td>{report.reviewedByAdminUsername || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}

        {/* Moderation Actions Table */}
        {!loading && activeTab === "actions" && (
          <Row>
            <Col>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Reason</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action) => (
                    <tr key={action.id}>
                      <td>{action.id}</td>
                      <td>{action.adminUsername}</td>
                      <td>
                        <Badge color="info">{action.actionType}</Badge>
                      </td>
                      <td>{action.targetUsername || action.targetEntityType}</td>
                      <td>{action.reason}</td>
                      <td>{formatDate(action.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Container>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} toggle={closeReviewModal} size="lg">
        <ModalHeader toggle={closeReviewModal}>Review Report</ModalHeader>
        <ModalBody>
          {selectedReport && (
            <>
              <div className="mb-3">
                <strong>Report ID:</strong> {selectedReport.id}
                <br />
                <strong>Type:</strong> {selectedReport.reportedEntityType}
                <br />
                <strong>Reason:</strong> {selectedReport.reason}
                <br />
                <strong>Reporter:</strong> {selectedReport.reporterUsername}
                <br />
                <strong>Reported User:</strong> {selectedReport.reportedUsername || "N/A"}
                <br />
                <strong>Date:</strong> {formatDate(selectedReport.createdAt)}
                <br />
                {selectedReport.details && (
                  <>
                    <strong>Details:</strong>
                    <p className="mt-2 p-2 bg-light rounded">{selectedReport.details}</p>
                  </>
                )}
              </div>

              <Form onSubmit={handleReviewSubmit}>
                <FormGroup>
                  <Label for="reviewStatus">Review Decision *</Label>
                  <Input
                    type="select"
                    id="reviewStatus"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    required
                  >
                    <option value="Resolved">Resolved</option>
                    <option value="Dismissed">Dismissed</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="actionType">Action to Take (Optional)</Label>
                  <Input
                    type="select"
                    id="actionType"
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                  >
                    <option value="">No Action</option>
                    <option value="BanUser">Ban User</option>
                    <option value="DeleteEvent">Delete Event</option>
                    <option value="DeleteMessage">Delete Message</option>
                    <option value="WarnUser">Warn User</option>
                  </Input>
                </FormGroup>

                {actionType && (
                  <FormGroup>
                    <Label for="actionReason">Action Reason</Label>
                    <Input
                      type="text"
                      id="actionReason"
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Why are you taking this action?"
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label for="adminNotes">Admin Notes (Optional)</Label>
                  <Input
                    type="textarea"
                    id="adminNotes"
                    rows="3"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this review..."
                  />
                </FormGroup>
              </Form>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeReviewModal} disabled={processing}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleReviewSubmit} disabled={processing}>
            {processing ? "Submitting..." : "Submit Review"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
