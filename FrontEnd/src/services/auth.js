import API from "../api.js";


export const register = async (formData) => {
  const res = await API.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  const { accessToken, user } = res.data.data;
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  return { user, token: accessToken };   // return both
};

export const login = async (email, password) => {
  const res = await API.post("/users/login", { email, password });
  const { accessToken, user } = res.data.data;   // Note: backend wraps inside ApiResponse
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  return { user, token: accessToken };
};


export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  // optional: you can implement /auth/me route in backend
  const token = localStorage.getItem("token");
  if (!token) return null;
  return true; // just a placeholder
};
