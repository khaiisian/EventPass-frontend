import api from "../api/axios";

// export const getUsers = () => api.get("/users");

export const getUsers = (params = {}) =>
    api.get("/users", { params });

export const getUserById = (id) => api.get(`/users/${id}`);

export const createUser = (data) => api.post("/users", data);

export const updateUser = (id, data) =>
    api.post(`/users/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);
