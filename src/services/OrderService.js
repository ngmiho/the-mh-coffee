import axios from "./customized-axios";

export const fetchGetAllOrders = () => axios.get("/api/orders");

export const fetchGetOrdersWithCriteria = (startDate, endDate) =>
  axios.get(
    `/api/orders/searchWithCriteria?pageNo=0&pageSize=100&search=createDate%3E${startDate}&search=createDate%3C${endDate}`
  );

export const fetchGetOrderById = (id) => axios.get(`/api/orders/${id}`);

export const putUpdateOrderStatus = (data) =>
  axios.put("/api/orders/order/update-status", data);

export const postCreateOrder = (data) => axios.post("/api/orders", data);

export const putUpdateOrder = (id, data) =>
  axios.put(`/api/orders/${id}`, data);

export const deleteOrderById = (id) => axios.delete(`/api/orders/${id}`);
