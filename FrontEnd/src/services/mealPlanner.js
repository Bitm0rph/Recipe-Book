import API from "../api";

export const getMealPlans = async (start, end) => {
  const res = await API.get(`/meal-plans?start=${start}&end=${end}`);
  return res.data;
};

export const createMealPlan = async (mealPlan) => {
  const res = await API.post("/meal-plans", mealPlan);
  return res.data;
};

export const deleteMealPlan = async (id) => {
  const res = await API.delete(`/meal-plans/${id}`);
  return res.data;
};

export const getShoppingList = async (weekStart) => {
  const res = await API.get(`/shopping-list/${weekStart}`);
  return res.data;
};

export const generateShoppingList = async (weekStart) => {
  const res = await API.post(`/shopping-list/${weekStart}/generate`);
  return res.data;
};

export const addShoppingItem = async (weekStart, item) => {
  const res = await API.post(`/shopping-list/${weekStart}/items`, item);
  return res.data;
};

export const updateShoppingItem = async (weekStart, itemId, updates) => {
  const res = await API.patch(`/shopping-list/${weekStart}/items/${itemId}`, updates);
  return res.data;
};

export const deleteShoppingItem = async (weekStart, itemId) => {
  const res = await API.delete(`/shopping-list/${weekStart}/items/${itemId}`);
  return res.data;
};
