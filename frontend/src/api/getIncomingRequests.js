const getIncomingRequests = (token, page = 1) => {
  return fetch(
    `${import.meta.env.VITE_API_URL}/requests/incoming?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default getIncomingRequests;
