const sendMessage = (data, token) => {
    return fetch(`${import.meta.env.VITE_API_URL}/messages`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: data
        });
};

export default sendMessage;