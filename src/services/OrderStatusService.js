import axios from "./customized-axios";

export const fetchGetAllOrderStatuses = () => axios.get("/api/order-statuses");
