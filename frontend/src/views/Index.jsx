import { NavLink, Navigate, Outlet } from "react-router-dom";
import ChatIcon from "../icons/ChatIcon";
import LogoutIcon from "../icons/LogoutIcon";
import PeoplesIcon from "../icons/PeoplesIcon";
import SettingsIcon from "../icons/SettingsIcon";
import "../styles/Index.css";
import useAuthContext from "../hooks/useAuthContext";

const Index = () => {
  const { auth } = useAuthContext();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  const {
    user: { firstName, lastName, username, avatar },
  } = auth;

  return (
    <main>
      <div className="tabs">
        <nav>
          <ul>
            <li className="tab">
              <ChatIcon size={30} color="black" strokeWidth={1.5} />
              <NavLink to="/">Chats</NavLink>
            </li>
            <li className="tab">
              <PeoplesIcon size={30} color="black" strokeWidth={1.5} />
              <NavLink to="/people">People</NavLink>
            </li>
            <li className="tab">
              <PeoplesIcon size={30} color="black" strokeWidth={1.5} />
              <NavLink to="/requests">Requests</NavLink>
            </li>
            <li className="tab">
              <SettingsIcon size={30} color="black" strokeWidth={1.5} />
              <NavLink to="/settings">Settings</NavLink>
            </li>
            <li className="tab">
              <LogoutIcon size={30} color="black" strokeWidth={1.5} />
              Logout
            </li>
          </ul>
        </nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
          }}
        >
          <img
            src={`http://localhost:3000/${avatar}`}
            className="avatar"
            style={{ height: 60, width: 60 }}
          />
          <div>
            <h4>{`${firstName} ${lastName}`}</h4>
            <span style={{ color: "grey" }}>@{username}</span>
          </div>
        </div>
      </div>
      <div className="view-container">
        <Outlet />
      </div>
    </main>
  );
};

export default Index;
