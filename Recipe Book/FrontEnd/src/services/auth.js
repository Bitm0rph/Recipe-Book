import API from "../api.js";

export const register = async (name, email, password) => {
  const res = await API.post("/auth/register", { name, email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { user, token };   // return both
};

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { user, token };   // return both
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
