import api from "./axios.js";

export const getTransactions = (params = {}) =>
    api.get("/transactions", { params });

export const getTransactionById = (id) => api.get(`/transactions/${id}`);

export const getTicketHistory = () => api.get(`/transactions/history`);

export const updateTransaction = (id, data) =>
    api.put(`/transactions/${id}`, data);

export const buyTickets = (data) => api.post(`/transactions/buyTickets`, data);
