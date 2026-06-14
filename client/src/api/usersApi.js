import api from "./axios"

const usersApi = {
    getAll: () => api.get("/users/"),
    togglePremium: (id) => api.patch(`/users/${id}/premium`),
    changeRole: (id, role) => api.patch(`/users/${id}/role`, null, { params: { role } }),
    deactivate: (id) => api.patch(`/users/${id}/deactivate`),
}

export default usersApi