import API from "../api";

export const getCategories = async () => {
    const res = await API.get("/categories");
    return res.data.data || res.data;
};

export const getCategoryById = async (id) => {
    const res = await API.get(`/categories/${id}`);
    return res.data; // { _id, name }
};