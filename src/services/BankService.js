import axios from "./customized-axios";

export const fetchAllBanks = () => axios.get("/api/banks");

export const fetchGetBankById = (id) => axios.get(`/api/banks/${id}`);

export const postCreateBank = (data) => axios.post("/api/banks", data);

export const putUpdateBank = (id, data) => axios.put(`/api/banks/${id}`, data);

export const deleteBankById = (id) => axios.delete(`/api/banks/${id}`);
