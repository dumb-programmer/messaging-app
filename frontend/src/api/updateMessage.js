const updateMessage = (messageId, data, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}`,
        {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
};

export default updateMessage;