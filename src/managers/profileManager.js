const apiUrl = "/api/userprofile";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getMyProfile = async () => {
  const res = await fetch(`${apiUrl}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null; // Profile doesn't exist yet
    }
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const createProfile = async (profileData) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const updateProfile = async (profileData) => {
  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res.status === 204 ? null : await res.json();
};

export const deleteProfile = async () => {
  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res.status === 204 ? null : await res.json();
};
