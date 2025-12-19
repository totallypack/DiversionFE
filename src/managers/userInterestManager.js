const apiUrl = "/api/userinterests";

export const getMyInterests = async () => {
  const res = await fetch(apiUrl, {
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

export const addInterest = async (subInterestId) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ subInterestId }),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const removeInterest = async (userInterestId) => {
  const res = await fetch(`${apiUrl}/${userInterestId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res.status === 204 ? null : await res.json();
};

export const removeInterestBySubInterestId = async (subInterestId) => {
  const res = await fetch(`${apiUrl}/subinterest/${subInterestId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res.status === 204 ? null : await res.json();
};
