const sendMessage = (data, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });
};

export default sendMessage;