export const validateEventForm = ({
  title,
  startDateTime,
  endDateTime,
  interestTagId,
  eventType,
  meetingUrl,
  city,
  state,
}) => {
  const errors = [];

  if (!title.trim()) {
    errors.push("Title is required");
  }

  if (!startDateTime) {
    errors.push("Start date and time are required");
  }

  if (!endDateTime) {
    errors.push("End date and time are required");
  }

  if (
    startDateTime &&
    endDateTime &&
    new Date(endDateTime) <= new Date(startDateTime)
  ) {
    errors.push("End date must be after start date");
  }

  if (startDateTime && new Date(startDateTime) <= new Date()) {
    errors.push("Start date must be in the future");
  }

  if (!interestTagId) {
    errors.push("Please select an interest tag");
  }

  if (eventType === "Online" && !meetingUrl.trim()) {
    errors.push("Meeting URL is required for online events");
  }

  if (eventType === "InPerson" && !city.trim()) {
    errors.push("City is required for in-person events");
  }

  if (eventType === "InPerson" && !state) {
    errors.push("State is required for in-person events");
  }

  return errors;
};
