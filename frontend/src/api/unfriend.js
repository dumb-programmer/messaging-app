const unfriend = (friendshipId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/friends/${friendshipId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default unfriend;