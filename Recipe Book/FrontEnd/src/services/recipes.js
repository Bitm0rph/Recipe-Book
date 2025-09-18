import API from "../api";

export const getAllRecipes = async (page = 1, limit = 20) => {
  const res = await API.get(`/recipes?page=${page}&limit=${limit}`);
  return res.data;
};

export const getRecipe = async (id) => {
  const res = await API.get(`/recipes/${id}`);
  return res.data;
};

export const getRecipes = async () => {
  const res = await API.get("/recipes");
  return res.data;
};

export const createRecipe = async (recipeData) => {
  const res = await API.post("/recipes", recipeData);
  return res.data;
};

export const updateRecipe = async (id, updates) => {
  const res = await API.put(`/recipes/${id}`, updates);
  return res.data;
};

export const deleteRecipe = async (id) => {
  const res = await API.delete(`/recipes/${id}`);
  return res.data;
};

export const getUserRecipes = async (userId) => {
  const res = await API.get(`/recipes/user/${userId}`);
  return res.data;
};

export const getRecipesByCategory = async (categoryId) => {
  const res = await API.get(`/recipes/category/${categoryId}`);
  return res.data; // array of recipes
};