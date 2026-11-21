import API from "../api";

const recipeRequests = new Map();

export const getAllRecipes = async (page = 1, limit = 20) => {
  const res = await API.get(`/recipes?page=${page}&limit=${limit}`);
  return res.data;
};

export const getRecipe = (id) => {
  let request = recipeRequests.get(id);
  if (!request) {
    request = API.get(`/recipes/${id}`)
      .then((res) => res.data)
      .finally(() => recipeRequests.delete(id));
    recipeRequests.set(id, request);
  }
  return request;
};

export const getRecipes = async () => {
  const res = await API.get("/recipes");
  return res.data.data || res.data;
};

export const createRecipe = async (recipeData) => {
  const formData = new FormData();
  const { image, ...fields } = recipeData;

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
  });
  if (image) formData.append("image", image);

  const res = await API.post("/recipes", formData);
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