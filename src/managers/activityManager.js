const apiUrl = "/api/activity";

export const getFriendActivityFeed = async () => {
  const res = await fetch(`${apiUrl}/feed`, {
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
