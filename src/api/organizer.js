import api from "./axios.js";

// export const getOrganizers = () => api.get("/organizers");

export const getOrganizers = (params = {}) =>
    api.get("/organizers", { params });

export const getOrganizerById = (id) => api.get(`/organizers/${id}`);

export const createOrganizer = (data) => api.post(`/organizers`, data);

export const updateOrganizer = (id, data) =>
    api.put(`/organizers/${id}`, data);

export const deleteOrganizer = (id) => api.delete(`/organizers/${id}`);