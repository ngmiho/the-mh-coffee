import axios from "./customized-axios";

export const fetchAllOrderDetails = () => axios.get("/api/order-details");

export const fetchGetOrderDetailById = (id) => axios.get(`/api/order-details/${id}`);

export const postCreateOrderDetail = (data) => axios.post("/api/order-details", data);

export const putUpdateOrderDetail = (id, data) =>
  axios.put(`/api/order-details/${id}`, data);

export const deleteOrderDetailById = (id) =>
  axios.delete(`/api/order-details/${id}`);
