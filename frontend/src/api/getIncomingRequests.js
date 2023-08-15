const getIncomingRequests = (token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/requests/incoming`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getIncomingRequests;