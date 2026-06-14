import api from "./axios"

const authApi = {
    register: (data) => api.post("/users/register", data),
    login: (data) => api.post("/users/login", data),
    getMe: () => api.get("/users/me"),
    updateMe: (data) => api.patch("/users/me", data),
}

export default authApi