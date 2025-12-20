export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateTimeString) => {
  return new Date(dateTimeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now - activityTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return activityTime.toLocaleDateString();
};
