import axios from "./customized-axios";

export const fetchAllCategories = () => axios.get("/api/categories");

export const fetchGetCategoryById = (id) => axios.get(`/api/categories/${id}`);

export const postCreateCategory = (data) => axios.post("/api/categories", data);

export const putUpdateCategory = (id, data) =>
  axios.put(`/api/categories/${id}`, data);

export const deleteCategoryById = (id) => axios.delete(`/api/categories/${id}`);
