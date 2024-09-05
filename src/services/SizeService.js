import axios from "./customized-axios";

export const fetchGetAllSizes = () => axios.get("/api/sizes");

export const fetchGetSizeById = (id) => axios.get(`/api/sizes/${id}`);

export const postCreateSize = (data) => axios.post("/api/sizes", data);

export const putUpdateSize = (id, data) => axios.put(`/api/sizes/${id}`, data);

export const deleteSizeById = (id) => axios.delete(`/api/sizes/${id}`);
