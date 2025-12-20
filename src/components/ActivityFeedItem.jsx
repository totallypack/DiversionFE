import { useState } from "react";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../utils/dateUtils";
import {
  getActivityDisplayName,
  getRsvpText,
} from "../utils/activityUtils";

export default function ActivityFeedItem({ activity, showBorder = true }) {
  const displayName = getActivityDisplayName(activity);
  const [imageError, setImageError] = useState(false);

  const renderProfilePic = () => {
    const defaultAvatar = (
      <span
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "var(--color-hot-pink)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-black)",
          fontWeight: "bold",
          fontSize: "16px",
          marginRight: "8px",
          verticalAlign: "middle",
        }}
      >
        {displayName?.charAt(0).toUpperCase() || "?"}
      </span>
    );

    if (activity.profilePicUrl && !imageError) {
      return (
        <img
          src={activity.profilePicUrl}
          alt={displayName}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "8px",
            verticalAlign: "middle",
          }}
          onError={() => setImageError(true)}
        />
      );
    }
    return defaultAvatar;
  };

  const renderActivityMessage = () => {
    switch (activity.activityType) {
      case "EventCreated":
        return (
          <>
            {renderProfilePic()}
            <Link
              to={`/profile/${activity.userId}`}
              className="text-decoration-none"
            >
              <strong style={{ color: "var(--color-black)" }}>{displayName}</strong>
            </Link>{" "}
            created a new event:{" "}
            <Link
              to={`/events/${activity.eventId}`}
              className="text-decoration-none"
              style={{ color: "var(--color-hot-pink)" }}
            >
              {activity.eventTitle}
            </Link>
          </>
        );

      case "EventRSVP":
        const rsvpText = getRsvpText(activity.rsvpStatus);
        return (
          <>
            {renderProfilePic()}
            <Link
              to={`/profile/${activity.userId}`}
              className="text-decoration-none"
            >
              <strong style={{ color: "var(--color-black)" }}>{displayName}</strong>
            </Link>{" "}
            {rsvpText}{" "}
            <Link
              to={`/events/${activity.eventId}`}
              className="text-decoration-none"
              style={{ color: "var(--color-hot-pink)" }}
            >
              {activity.eventTitle}
            </Link>
          </>
        );

      case "InterestAdded":
        return (
          <>
            {renderProfilePic()}
            <Link
              to={`/profile/${activity.userId}`}
              className="text-decoration-none"
            >
              <strong style={{ color: "var(--color-black)" }}>{displayName}</strong>
            </Link>{" "}
            added interest:{" "}
            <Link
              to={`/subinterest/${activity.subInterestId}`}
              className="text-decoration-none"
              style={{ color: "var(--color-hot-pink)" }}
            >
              {activity.subInterestName}
            </Link>
            <span className="text-muted ms-1">({activity.interestName})</span>
          </>
        );

      default:
        return <>{displayName} did something</>;
    }
  };

  return (
    <div className="pb-3 mb-3">
      <p className="mb-1 small">{renderActivityMessage()}</p>
      <small className="text-muted">{getTimeAgo(activity.timestamp)}</small>

      {showBorder && (
        <div
          style={{
            width: "30%",
            height: ".5px",
            backgroundColor: "var(--color-hot-pink)",
            margin: "12px auto 0",
          }}
        />
      )}
    </div>
  );
}
