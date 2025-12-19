const apiUrl = "/api/userprofile";

export const getMyProfile = async () => {
  const res = await fetch(`${apiUrl}/me`, {
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
    if (res.status === 401 || res.status === 500) {
      throw new Error("Unauthorized");
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json().then((error) => {
        throw error;
      });
    }
    throw new Error("Failed to load profile");
  }
  return await res.json();
};

export const createProfile = async (profileData) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    credentials: "include",
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return res.status === 204 ? null : await res.json();
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${apiUrl}/${userId}`, {
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
