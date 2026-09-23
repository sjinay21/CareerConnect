const API_URL = "http://localhost:5000";

export const customFetch = async (endpoint, options = {}) => {
  options.credentials = "include";
  
  if (!options.headers) {
    options.headers = {};
  }
  
  const fullUrl = API_URL + endpoint;
  const response = await fetch(fullUrl, options);
  
  if (response.status === 401 && typeof window !== "undefined" && !window.location.href.includes("login")) {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  
  return response;
};

export const loginUser = async (data) => {
  return await customFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data) => {
  return await customFetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const logoutUser = async () => {
  const response = await customFetch("/logout", {
    method: "POST",
  });
  if (typeof window !== "undefined") {
     localStorage.removeItem("user");
  }
  return response;
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") return false;
  return localStorage.getItem("user") !== null;
};

export const getUserProfile = async () => {
  return await customFetch("/users/profile", {
    method: "GET",
  });
};

export const updateUserProfile = async (data) => {
  return await customFetch("/users/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const getPosts = async () => {
  return await customFetch("/posts/getPosts", {
    method: "GET",
  });
};

export const createPost = async (formData) => {
 
  return await customFetch("/posts/create", {
    method: "POST",
    body: formData,
  });
};

export const updatePost = async (postId, content, formData) => {
  return await customFetch("/posts/update", {
    method: "PUT",
    body: formData,
  });
};

export const deletePost = async (postId) => {
  return await customFetch("/posts/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId }),
  });
};

export const islikePost = async (postId) => {
  return await customFetch("/like/islike", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId }),
  });
};
