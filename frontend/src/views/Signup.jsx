import { useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CameraIcon from "../icons/CameraIcon";
import "../styles/Login.css";
import useAuthContext from "../hooks/useAuthContext";
import signup from "../api/signup";

const initalState = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  avatar: "",
  bio: "",
};

const Signup = () => {
  const [previewImage, setPreviewImage] = useState();
  const [data, setData] = useState(initalState);
  const [errors, setErrors] = useState(initalState);
  const fileUploadRef = useRef();
  const { auth } = useAuthContext();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(initalState);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(`${key}`, value);
      }
      const response = await signup(formData);
      const responseData = await response.json();
      if (response.status === 200) {
        navigate("/login");
      } else if (response.status === 400) {
        setErrors(
          responseData.message.reduce(
            (prev, curr) => ({ ...prev, [curr.path]: curr.msg }),
            {}
          )
        );
      } else if (response.status === 409) {
        setErrors((errors) => ({
          ...errors,
          username: "Username taken",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (auth) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        flex: 2,
        display: "flex",
      }}
    >
      <div style={{ flex: 2, padding: "20px 100px" }}>
        <form
          style={{ maxWidth: 500 }}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h1>Signup</h1>
          <div
            className="form-control"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              className={`profile-picture-upload ${
                errors.avatar ? "input__invalid" : ""
              }`}
              style={{
                backgroundImage: previewImage && `url(${previewImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderStyle: "dashed",
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
              onChange={(e) => {
                setPreviewImage(
                  URL.createObjectURL(fileUploadRef.current.files[0])
                );
                setData({
                  ...data,
                  avatar: e.target.files[0],
                });
              }}
              ref={fileUploadRef}
              type="file"
              id="avatar"
              accept="image/*"
              style={{ display: "none" }}
            />
            <span className="error-message">{errors.avatar}</span>
          </div>
          <div className="form-control">
            <label htmlFor="first-name">
              First Name <span aria-label="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="first-name"
              className={`${errors.firstName ? "input__invalid" : ""}`}
              onChange={handleInput}
            />
            <span className="error-message">{errors.firstName}</span>
          </div>
          <div className="form-control">
            <label htmlFor="last_name">
              Last Name <span aria-label="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="last_name"
              className={`${errors.lastName ? "input__invalid" : ""}`}
              onChange={handleInput}
            />
            <span className="error-message">{errors.lastName}</span>
          </div>
          <div className="form-control">
            <label htmlFor="username">
              Username <span aria-label="required">*</span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={`${errors.username ? "input__invalid" : ""}`}
              onChange={handleInput}
            />
            <span className="error-message">{errors.username}</span>
          </div>
          <div className="form-control">
            <label htmlFor="password">
              Password <span aria-label="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`${errors.password ? "input__invalid" : ""}`}
              onChange={handleInput}
            />
            <span className="error-message">{errors.password}</span>
          </div>
          <div className="form-control">
            <label htmlFor="bio">Bio</label>
            <textarea
              type="text"
              name="bio"
              id="bio"
              className={`${errors.bio ? "input__invalid" : ""}`}
              onChange={handleInput}
            ></textarea>
            <span className="error-message">{errors.bio}</span>
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
