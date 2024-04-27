const getPendingRequests = (token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/requests/pending`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getPendingRequests;