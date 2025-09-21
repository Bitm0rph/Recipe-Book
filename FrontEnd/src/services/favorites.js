import API from "../api";

// Fetch all favorite recipes for the current user
export const getFavorites = async () => {
    const res = await API.get("/favorites"); // protected route
    return res.data; // array of recipe objects
};

export const addFavorite = async (recipeId) => {
    const res = await API.post(`/favorites/${recipeId}`);
    return res.data;
};

export const removeFavorite = async (recipeId) => {
    const res = await API.delete(`/favorites/${recipeId}`);
    return res.data;
};