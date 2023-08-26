const deleteMedia = (media, data, token) => {
    return fetch(`http://localhost:3000${media}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
};

export default deleteMedia;