const apiUrl = "/api";

export const getAllInterests = async () => {
  const res = await fetch(`${apiUrl}/interests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const getAllInterestsWithSubInterests = async () => {
  const res = await fetch(`${apiUrl}/interests/with_subinterests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const getInterestById = async (id) => {
  const res = await fetch(`${apiUrl}/interests/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const getSubInterestsByInterest = async (interestId) => {
  const res = await fetch(`${apiUrl}/subinterests/interest/${interestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};
