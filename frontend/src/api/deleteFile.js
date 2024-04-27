const deleteFile = (file, data, token) => {
    return fetch(`http://localhost:3000${file}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
};

export default deleteFile;