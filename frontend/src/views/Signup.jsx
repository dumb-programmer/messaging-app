import { useRef } from "react";
import CameraIcon from "../icons/CameraIcon";
import "../styles/Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [previewImage, setPreviewImage] = useState();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    avatar: "",
  });
  const fileUploadRef = useRef();

  const handleInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        flex: 2,
        display: "flex",
      }}
    >
      <div style={{ flex: 2, padding: 100 }}>
        <form style={{ maxWidth: 500 }}>
          <h1>Signup</h1>
          <div
            className="form-control"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              className="profile-picture-upload"
              style={{
                backgroundImage: previewImage && `url(${previewImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              tabIndex={1}
              onClick={() => fileUploadRef.current.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fileUploadRef.current.click();
                }
              }}
            >
              {!previewImage && (
                <CameraIcon size={28} color="grey" strokeWidth="1.5px" />
              )}
            </div>
            <input
              onChange={() => {
                setPreviewImage(
                  URL.createObjectURL(fileUploadRef.current.files[0])
                );
              }}
              ref={fileUploadRef}
              type="file"
              id="avatar"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              name="firstName"
              id="first-name"
              onChange={handleInput}
            />
          </div>
          <div className="form-control">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="last_name"
              onChange={handleInput}
            />
          </div>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleInput}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              id="password"
              onChange={handleInput}
            />
          </div>
          <button type="submit">Submit</button>
          <p>
            Already have an account <Link to="/login">login</Link>
          </p>
        </form>
      </div>
      <div className="artwork"></div>
    </div>
  );
};

export default Signup;
