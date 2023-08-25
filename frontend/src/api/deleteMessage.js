const deleteMessage = (messageId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default deleteMessage;