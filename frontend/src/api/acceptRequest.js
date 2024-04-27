const acceptRequest = (requestId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/requests/${requestId}`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default acceptRequest;