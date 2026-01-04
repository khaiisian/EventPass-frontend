import api from "./axios.js";

export const getEventTypes = () => api.get("/eventtypes");

export const getEventTypeById = (id) => api.get(`/eventtypes/${id}`);

export const createEventType = (data) => api.post(`/eventtypes`, data);

export const updateEventType = (id, data) =>
    api.put(`/eventtypes/${id}`, data);

export const deleteEventType = (id) => api.delete(`/eventtypes/${id}`);