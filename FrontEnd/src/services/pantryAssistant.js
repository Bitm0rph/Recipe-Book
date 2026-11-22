import API from "../api";

export const getPantrySuggestions = async (ingredients, preferences) => {
  const res = await API.post("/ai/pantry-assistant/suggestions", { ingredients, preferences });
  return res.data;
};
