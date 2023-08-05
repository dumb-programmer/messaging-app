import { Link } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

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
          <h1>Login</h1>
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
            {`Don't have an account`} <Link to="/signup">signup</Link>
          </p>
        </form>
      </div>
      <div className="artwork"></div>
    </div>
  );
};

export default Login;
