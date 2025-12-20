export const apiGet = (url) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

export const apiPost = (url, data) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(err => Promise.reject(err));
    }
    return res.json();
  });

export const apiPut = (url, data) =>
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status === 204) return null;
    if (!res.ok) {
      return res.json().then(err => Promise.reject(err));
    }
    return res.json();
  });

export const apiDelete = (url) =>
  fetch(url, {
    method: "DELETE",
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  });
