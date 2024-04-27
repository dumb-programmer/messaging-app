const deleteUser = (userId, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default deleteUser;