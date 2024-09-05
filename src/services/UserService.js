import axios from "./customized-axios";
export const fetchGetAllUsers = () => axios.get("/api/users");
export const fetchGetUserById = (id) => axios.get(`/api/users/${id}`);
export const postCreateUser = (data) => axios.post("/api/users", data);
export const putUpdateUser = (id, data) => axios.put(`/api/users/${id}`, data);
export const deleteUserById = (id) => axios.delete(`/api/users/delete/${id}`);
export const putLockUser = (id) => axios.put(`/api/users/lock/${id}`);