const getMedia = (media, token) => {
    return fetch(`http://localhost:3000${media}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default getMedia;