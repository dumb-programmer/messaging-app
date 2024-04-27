const updateUser = (userId, token, data) => {
    return fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: data,
        });
};

export default updateUser;