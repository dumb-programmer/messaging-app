const getFile = (file, token) => {
    return fetch(`http://localhost:3000${file}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
};

export default getFile;