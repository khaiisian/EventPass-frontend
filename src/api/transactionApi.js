import api from "./axios.js";

export const buyTickets = (data) => api.post(`/transactions/buyTickets`, data);
