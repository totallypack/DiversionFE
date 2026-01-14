import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { createReport } from "../../managers/reportManager";
import "./ReportButton.css";

export default function ReportButton({ entityType, entityId, entityLabel }) {
  const [modal, setModal] = useState(false);
  const [reason, setReason] = useState("Harassment");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      // Reset form when opening
      setReason("Harassment");
      setDetails("");
      setSuccess(false);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createReport(entityType, entityId, reason, details || null);
      setSuccess(true);
      setTimeout(() => {
        toggle();
      }, 2000);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="danger" outline size="sm" onClick={toggle} className="report-button">
        🚩 Report
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Report {entityLabel || "Content"}</ModalHeader>
        <ModalBody>
          {success ? (
            <div className="text-success">
              <p>✓ Report submitted successfully!</p>
              <p>Our moderation team will review it shortly.</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="reason">Reason *</Label>
                <Input
                  type="select"
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="Harassment">Harassment</option>
                  <option value="Spam">Spam</option>
                  <option value="InappropriateContent">Inappropriate Content</option>
                  <option value="FalseInformation">False Information</option>
                  <option value="Other">Other</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="details">Additional Details (Optional)</Label>
                <Input
                  type="textarea"
                  id="details"
                  rows="4"
                  placeholder="Please provide any additional context that would help our moderation team..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  maxLength="1000"
                />
                <small className="text-muted">{details.length}/1000 characters</small>
              </FormGroup>
              {error && <div className="text-danger mb-2">{error}</div>}
            </Form>
          )}
        </ModalBody>
        {!success && (
          <ModalFooter>
            <Button color="secondary" onClick={toggle} disabled={loading}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
}
