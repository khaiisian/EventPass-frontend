import api from "./axios.js";

export const getVenues = () => api.get("/venues");

export const getVenueById = (id) => api.get(`/venues/${id}`);

export const createVenue = (data) => api.post(`/venues`, data);

export const updateVenue = (id, data) =>
    api.post(`/venues/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteVenue = (id) => api.delete(`/venues/${id}`);