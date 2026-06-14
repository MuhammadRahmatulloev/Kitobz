import api from "./axios"

const reviewsApi = {
    getByBook: (bookId) => api.get(`/reviews/book/${bookId}`),
    create: (bookId, data) => api.post(`/reviews/book/${bookId}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
}

export default reviewsApi