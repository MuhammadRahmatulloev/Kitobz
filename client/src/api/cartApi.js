import api from "./axios"

const cartApi = {
    getCart: () => api.get("/cart/"),
    addItem: (data) => api.post("/cart/", data),
    updateItem: (id, data) => api.patch(`/cart/${id}`, data),
    removeItem: (id) => api.delete(`/cart/${id}`),
    clearCart: () => api.delete("/cart/"),
}

export default cartApi