const getMessages = (userId, token, page = 1) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages?userId=${userId}&page=${page}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getMessages;