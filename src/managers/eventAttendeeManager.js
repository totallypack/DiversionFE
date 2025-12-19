const apiUrl = "/api/eventattendees";

export const getEventAttendees = async (eventId) => {
  const res = await fetch(`${apiUrl}/event/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const getMyAttendance = async () => {
  const res = await fetch(`${apiUrl}/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const getMyAttendanceForEvent = async (eventId) => {
  const res = await fetch(`${apiUrl}/event/${eventId}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const rsvpToEvent = async (eventId, status = "Going") => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ eventId, status }),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const updateRsvp = async (attendeeId, status) => {
  const res = await fetch(`${apiUrl}/${attendeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return;
};

export const deleteRsvp = async (attendeeId) => {
  const res = await fetch(`${apiUrl}/${attendeeId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return;
};
