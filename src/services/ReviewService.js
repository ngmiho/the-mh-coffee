import axios from "./customized-axios";

export const fetchAllReview = () => axios.get("/api/reviews");
