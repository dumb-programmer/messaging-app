const deleteRequest = (requestId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/requests/${requestId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default deleteRequest;