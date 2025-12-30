import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // adjust if needed
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            if (newToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest); // retry original request
            }
        }

        return Promise.reject(error);
    }
);

export default api;
