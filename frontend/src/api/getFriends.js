const getFriends = (token, page = 1) => {
  return fetch(`${import.meta.env.VITE_API_URL}/friends?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default getFriends;
