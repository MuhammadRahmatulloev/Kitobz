import api from "./axios"

const booksApi = {
    getAll: (params) => api.get("/books/", { params }),
    getById: (id) => api.get(`/books/${id}`),
    create: (data) => api.post("/books/", data),
    update: (id, data) => api.patch(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
}

export default booksApi