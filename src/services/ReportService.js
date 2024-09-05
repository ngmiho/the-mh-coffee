import axios from "./customized-axios";

export const fetchGetRevenueByDrink = (startDate, endDate) =>
  axios.get(`/api/reports/drinks?startDate=${startDate}&endDate=${endDate}`);

export const fetchGetRevenueByDate = (startDate, endDate) =>
  axios.get(`/api/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
