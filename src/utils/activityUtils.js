export const getRsvpText = (status) => {
  switch (status) {
    case "Going":
      return "is going to";
    case "Maybe":
      return "might attend";
    case "Not Going":
      return "is not going to";
    default:
      return "RSVPed to";
  }
};

export const getRsvpBadgeColor = (status) => {
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

export const getActivityDisplayName = (activity) => {
  return activity.displayName || activity.username || "User";
};
