import { Button, ButtonGroup } from "reactstrap";

/**
 * Reusable RSVP button group component
 * @param {object} myAttendance - Current user's attendance object (or null)
 * @param {function} onRsvp - Callback function when RSVP is clicked, receives status
 * @param {boolean} loading - Whether RSVP action is in progress
 * @param {boolean} disabled - Whether buttons should be disabled
 */
export default function RsvpButtonGroup({
  myAttendance,
  onRsvp,
  loading = false,
  disabled = false,
}) {
  const currentStatus = myAttendance?.status;

  return (
    <ButtonGroup>
      <Button
        color={currentStatus === "Going" ? "success" : "outline-success"}
        onClick={() => onRsvp("Going")}
        disabled={loading || disabled}
      >
        {loading && currentStatus === "Going" ? "..." : "Going"}
      </Button>
      <Button
        color={currentStatus === "Maybe" ? "warning" : "outline-warning"}
        onClick={() => onRsvp("Maybe")}
        disabled={loading || disabled}
      >
        {loading && currentStatus === "Maybe" ? "..." : "Maybe"}
      </Button>
      <Button
        color={
          currentStatus === "Not Going" ? "secondary" : "outline-secondary"
        }
        onClick={() => onRsvp("Not Going")}
        disabled={loading || disabled}
      >
        {loading && currentStatus === "Not Going" ? "..." : "Not Going"}
      </Button>
    </ButtonGroup>
  );
}
