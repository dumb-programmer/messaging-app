import { useState } from "react";
import sendRequest from "../api/sendRequest";
import useAuthContext from "../hooks/useAuthContext";

const SendRequest = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { auth } = useAuthContext();

  const handleSendRequest = async () => {
    try {
      const response = await sendRequest({ username }, auth.token);
      if (!response.ok) {
        throw new Error({
          message: "An unknown error has occurred",
          content: response,
        });
      }
    } catch (error) {
      console.log(error);
      switch (error.content.status) {
        case 404:
          setError("No such user exists, recheck the username");
          break;
        default:
          setError(
            "An unknown error has occurred, maybe you've already sent the request."
          );
      }
    }
  };
  return (
    <div
      className="flex flex-column align-center gap-md"
      style={{ marginTop: 100, padding: "0 40px" }}
    >
      <h2>Add Friend</h2>
      <p>Enter the username of the user you want to friend</p>
      <div className="flex" style={{ position: "relative", minWidth: "30vw" }}>
        <span
          style={{
            backgroundColor: "#eee",
            color: "#666",
            width: 30,
            position: "absolute",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            height: "100%",
          }}
        >
          @
        </span>
        <input
          type="text"
          style={{ paddingLeft: 35, width: "100%" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
      <button onClick={handleSendRequest}>Send</button>
    </div>
  );
};

export default SendRequest;
