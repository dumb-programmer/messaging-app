const signup = async (data) => {
    return await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        mode: "cors", method: "POST", body: data
    });
};

export default signup;