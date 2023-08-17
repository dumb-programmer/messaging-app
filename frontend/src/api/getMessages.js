const getMessages = (userId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages?userId=${userId}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getMessages;