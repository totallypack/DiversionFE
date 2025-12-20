import { Badge } from "reactstrap";
import { formatDate, formatTime } from "../utils/dateUtils";
import HoverCard from "./common/HoverCard";

export default function EventCard({ event, onClick, showRsvpStatus = false }) {
  const getRsvpBadgeColor = (status) => {
    switch (status) {
      case "Going":
        return "success";
      case "Maybe":
        return "warning";
      case "Not Going":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <HoverCard
      backgroundColor="white"
      hoverTransform="translateY(-2px)"
      hoverShadow="0 4px 8px rgba(0,0,0,0.1)"
      borderWidth="1px"
      borderColor="#dee2e6"
      height="100%"
      onClick={onClick}
    >
        {showRsvpStatus && event.rsvpStatus && (
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="mb-0">{event.title}</h6>
            <Badge color={getRsvpBadgeColor(event.rsvpStatus)} pill>
              {event.rsvpStatus}
            </Badge>
          </div>
        )}
        {!showRsvpStatus && <h6 className="mb-2">{event.title}</h6>}

        <div className="mb-2">
          <Badge
            color={event.eventType === "Online" ? "success" : "primary"}
            className="me-1"
          >
            {event.eventType === "Online" ? "Online" : "In-Person"}
          </Badge>
          {event.interestTagName && (
            <Badge color="info">{event.interestTagName}</Badge>
          )}
        </div>

        <p className="text-muted small mb-1">
          <strong>Start:</strong> {formatDate(event.startDateTime)}{" "}
          {formatTime(event.startDateTime)}
        </p>

        {event.description && (
          <p className="text-muted small mb-0">
            {event.description.length > 80
              ? `${event.description.substring(0, 80)}...`
              : event.description}
          </p>
        )}
    </HoverCard>
  );
}
