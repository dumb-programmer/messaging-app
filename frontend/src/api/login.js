const login = async (data) => {
    return await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        mode: "cors", method: "POST", body: JSON.stringify(data), headers: {
            "Content-Type": "application/json"
        }
    });
};

export default login;