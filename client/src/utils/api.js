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

export const getComments = async (postId) => {
  return await customFetch(`/comments/getcomments?postId=${postId}`, {
    method: "GET",
  });
};

export const addComment = async (postId, content, parentCommentId = null) => {
  const body = { postId, content }; 
  if (parentCommentId) {
    body.parentCommentId = parentCommentId;
  }
  
  return await customFetch("/comments/addcomments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

/* export const updateComment = async (commentId, content) => {
  return await customFetch("/comments/updatecomments", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, content }),
  });
};

export const deleteComment = async (commentId) => {
  return await customFetch("/comments/deletecomments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId }),
  });
}; */

export const getExperiences = async (userId = "") => {
  const query = userId ? `?userId=${userId}` : "";
  return await customFetch(`/experiences/getexperiences${query}`, {
    method: "GET",
  });
};

export const createExperience = async (data) => {
  return await customFetch("/experiences/addexperience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateExperience = async (id, data) => {
  return await customFetch(`/experiences/updateexperience/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteExperience = async (id) => {
  return await customFetch(`/experiences/deleteexperience/${id}`, {
    method: "DELETE",
  });
};
