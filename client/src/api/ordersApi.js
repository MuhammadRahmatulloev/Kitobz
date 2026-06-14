import api from "./axios"

const ordersApi = {
    create: (data) => api.post("/orders/", data),
    getMyOrders: () => api.get("/orders/my"),
    getMyOrder: (id) => api.get(`/orders/my/${id}`),
    cancelOrder: (id) => api.patch(`/orders/my/${id}/cancel`),
    getAll: () => api.get("/orders/"),
    updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
}

export default ordersApi