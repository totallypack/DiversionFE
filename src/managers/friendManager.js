const apiUrl = "/api/friendships";

export const getMyFriends = async () => {
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

export const searchUsers = async (query) => {
  const res = await fetch(`${apiUrl}/search?query=${encodeURIComponent(query)}`, {
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

export const addFriend = async (friendId) => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ friendId }),
  });

  if (!res.ok) {
    return res.json().then((error) => {
      throw error;
    });
  }
  return await res.json();
};

export const removeFriend = async (friendId) => {
  const res = await fetch(`${apiUrl}/${friendId}`, {
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

export const checkFriendship = async (otherUserId) => {
  const res = await fetch(`${apiUrl}/check/${otherUserId}`, {
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
