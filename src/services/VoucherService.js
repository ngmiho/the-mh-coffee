import axios from "./customized-axios";

export const fetchAllVouchers = () => axios.get("/api/vouchers");

export const fetchAllValidVouchers = () => axios.get("/api/vouchers/valid");

export const fetchGetVoucherById = (id) => axios.get(`/api/vouchers/${id}`);

export const postCreateVoucher = (data) => axios.post("/api/vouchers", data);

export const putUpdateVoucher = (id, data) =>
  axios.put(`/api/vouchers/${id}`, data);

export const deleteVoucherById = (id) => axios.delete(`/api/vouchers/${id}`);
