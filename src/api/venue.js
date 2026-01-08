import api from "./axios.js";

export const getVenues = (params = {}) =>
    api.get("/venues", { params });

export const getTopVenues = () => api.get("/venues/getTopVenues");

export const getVenueById = (id) => api.get(`/venues/${id}`);

export const createVenue = (data) => api.post(`/venues`, data);

export const updateVenue = (id, data) =>
    api.post(`/venues/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteVenue = (id) => api.delete(`/venues/${id}`);