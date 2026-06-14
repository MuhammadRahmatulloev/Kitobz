export const formatPrice = (price) => {
    return `${price} сомони`
}

export const truncateText = (text, maxLength = 50) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}

export const getImageUrl = (url) => {
    if (!url) return "/no-image.png"
    if (url.startsWith("http")) return url
    return `http://localhost:8000${url}`
}

export const isAdmin = (user) => {
    return user?.role === "admin"
}

export const isModerator = (user) => {
    return user?.role === "moderator" || user?.role === "admin"
}