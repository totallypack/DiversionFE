import { Button, ButtonGroup } from "reactstrap";

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
        color={currentStatus === "Going" ? "secondary" : "outline-secondary"}
        onClick={() => onRsvp("Going")}
        disabled={loading || disabled}
      >
        {loading && currentStatus === "Going" ? "..." : "Going"}
      </Button>
      <Button
        color={currentStatus === "Maybe" ? "secondary" : "outline-secondary"}
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
