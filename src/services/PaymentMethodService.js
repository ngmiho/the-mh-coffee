import axios from "./customized-axios";

export const fetchAllPaymentMethods = () => axios.get("/api/payment-methods");

export const fetchGetPaymentMethodById = (id) =>
  axios.get(`/api/payment-methods/${id}`);

export const postCreatePaymentMethod = (data) =>
  axios.post("/api/payment-methods", data);

export const putUpdatePaymentMethod = (id, data) =>
  axios.put(`/api/payment-methods/${id}`, data);

export const deletePaymentMethodById = (id) =>
  axios.delete(`/api/payment-methods/${id}`);
