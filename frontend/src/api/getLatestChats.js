const getLatestChats = (token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getLatestChats;