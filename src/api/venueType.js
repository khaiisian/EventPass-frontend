import api from "./axios.js";

// export const getVenueTypes = () => api.get("/venuetypes");

export const getVenueTypes = (params = {}) =>
    api.get("/venuetypes", { params });

export const getVenueTypeById = (id) => api.get(`/venuetypes/${id}`);

export const createVenueType = (data) => api.post(`/venuetypes`, data);

export const updateVenueType = (id, data) =>
    api.put(`/venuetypes/${id}`, data);

export const deleteVenueType = (id) => api.delete(`/venuetypes/${id}`);