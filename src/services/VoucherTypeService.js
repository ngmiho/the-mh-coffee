import axios from "./customized-axios";

export const fetchAllVoucherTypes = () => axios.get("/api/voucher-types");

export const fetchGetVoucherTypeById = (id) => axios.get(`/api/voucher-types/${id}`);

export const postCreateVoucherType = (data) => axios.post("/api/voucher-types", data);

export const putUpdateVoucherType = (id, data) =>
  axios.put(`/api/voucher-types/${id}`, data);

export const deleteVoucherTypeById = (id) =>
  axios.delete(`/api/voucher-types/${id}`);
