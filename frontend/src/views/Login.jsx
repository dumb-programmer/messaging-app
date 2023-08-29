import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import login from "../api/login";
import useAuthContext from "../hooks/useAuthContext";
import "../styles/Login.css";

const initialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const navigate = useNavigate();
  const { setAuth, auth } = useAuthContext();

  const handleInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(initialState);
    try {
      const response = await login(data);
      const responseData = await response.json();
      if (response.status === 200) {
        const { token, user } = responseData;
        setAuth({ token, user });
        localStorage.setItem("auth", JSON.stringify({ token, user }));
        navigate("/");
      }
      if (response.status === 404) {
        setErrors((errors) => ({
          ...errors,
          username: "No such user exists",
        }));
      } else if (response.status === 401) {
        setErrors((errors) => ({
          ...errors,
          password: "Incorrect password",
        }));
      } else if (response.status === 400) {
        setErrors(
          responseData.message.reduce(
            (prev, curr) => ({ ...prev, [curr.path]: curr.msg }),
            {}
          )
        );
      }
    } catch (err) {
      console.error(err);
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
      <div style={{ flex: 2, padding: 100 }}>
        <form style={{ maxWidth: 500 }} onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="form-control">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={`${errors.password ? "input__invalid" : ""}`}
              onChange={handleInput}
            />
            <span className="error-message">{errors.password}</span>
          </div>
          <button type="submit" className="btn primary-btn">
            Submit
          </button>
          <p>
            {`Don't have an account`} <Link to="/signup">signup</Link>
          </p>
        </form>
      </div>
      <div className="artwork"></div>
    </div>
  );
};

export default Login;
