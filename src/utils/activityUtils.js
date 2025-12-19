/**
 * Gets the RSVP text based on status
 * @param {string} status - RSVP status (Going, Maybe, Not Going)
 * @returns {string} Text description of RSVP action
 */
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

/**
 * Gets the badge color for RSVP status
 * @param {string} status - RSVP status (Going, Maybe, Not Going)
 * @returns {string} Bootstrap color name
 */
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

/**
 * Gets display name from activity user data
 * @param {object} activity - Activity object
 * @returns {string} Display name or username
 */
export const getActivityDisplayName = (activity) => {
  return activity.displayName || activity.username || "User";
};
