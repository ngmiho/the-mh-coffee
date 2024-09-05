import axios from "./customized-axios";

export const fetchGetAllRoles = () => axios.get("/api/roles");
