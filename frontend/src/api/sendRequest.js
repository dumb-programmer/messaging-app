const sendRequest = (username, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/requests`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(username)
        });
};

export default sendRequest;