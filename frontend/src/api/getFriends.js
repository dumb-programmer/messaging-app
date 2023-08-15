const getFriends = (token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/friends`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
};

export default getFriends;