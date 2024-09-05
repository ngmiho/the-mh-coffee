import axios from "./customized-axios";

export const fetchGetAllToppings = () => axios.get("/api/toppings");

export const fetchGetToppingById = (id) => axios.get(`/api/toppings/${id}`);

export const postCreateTopping = (data) => axios.post("/api/toppings", data);

export const putUpdateTopping = (id, data) =>
  axios.put(`/api/toppings/${id}`, data);

export const deleteToppingById = (id) => axios.delete(`/api/toppings/${id}`);
