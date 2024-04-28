import { useState } from "react";
import sendRequest from "../api/sendRequest";
import useAuthContext from "../hooks/useAuthContext";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";

const SendRequest = () => {
  const [username, setUsername] = useState("");
  const { auth } = useAuthContext();
  const Toast = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest({ username }, auth.token);
      if (!response.ok) {
        throw new Error("Error occurred", { cause: { response } });
      } else {
        Toast.show({
          type: ToastType.SUCCESS,
          message: "Friend request sent",
          duration: 3000,
        });
      }
    } catch (error) {
      switch (error?.cause?.response?.status) {
        case 404:
          Toast.show({
            type: ToastType.FAILURE,
            message: "No user with this username exists",
            duration: 3000,
          });
          break;
        default:
          Toast.show({
            type: ToastType.FAILURE,
            message:
              "An Unkown error has occurred, be sure to check the username",
            duration: 3000,
          });
      }
    }
  };
  return (
    <form
      className="flex flex-column align-center gap-md"
      style={{ marginTop: 100, padding: "0 40px" }}
      onSubmit={handleSubmit}
    >
      <h2>Add Friend</h2>
      <p>Enter the username of the user you want to friend</p>
      <div
        className="flex"
        style={{
          position: "relative",
          minWidth: "30vw",
        }}
      >
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
      </div>
      <button type="submit" className="btn primary-btn">
        Send
      </button>
    </form>
  );
};

export default SendRequest;
