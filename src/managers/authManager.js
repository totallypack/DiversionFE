  const apiUrl = "/api/auth";

  export const register = async (userData) => {
    const res = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      return res.json().then((error) => {
        throw error;
      });
    }
    return await res.json();
  };

  export const login = async (credentials) => {
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      return res.json().then((error) => {
        throw error;
      });
    }
    return await res.json();
  };
