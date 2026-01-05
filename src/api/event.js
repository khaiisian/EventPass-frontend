import api from "./axios.js";

export const getEvents = () => api.get("/events");

export const getEventById = (id) => api.get(`/events/${id}`);

export const getTopEvents = () => api.get("/events/topevents");

export const createEvent = (data) => api.post(`/events`, data);

// export const updateEvent = (id, data) =>
//     api.put(`/events/${id}`, data);

export const updateEvent = (id, data) =>
    api.post(`/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteEvent = (id) => api.delete(`/events/${id}`);