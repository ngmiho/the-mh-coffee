import axios from "./customized-axios";

export const fetchAllPaymentMethodBanks = () =>
  axios.get("/api/payment-method-banks");

export const fetchGetPaymentMethodBankById = (id) =>
  axios.get(`/api/payment-method-banks/${id}`);

export const postCreatePaymentMethodBank = (data) =>
  axios.post("/api/payment-method-banks", data);

export const putUpdatePaymentMethodBank = (id, data) =>
  axios.put(`/api/payment-method-banks/${id}`, data);
