import { NavLink, Navigate, Outlet } from "react-router-dom";
import ChatIcon from "../icons/ChatIcon";
import LogoutIcon from "../icons/LogoutIcon";
import PeoplesIcon from "../icons/PeoplesIcon";
import SettingsIcon from "../icons/SettingsIcon";
import useAuthContext from "../hooks/useAuthContext";
import ToastsContainer from "../components/ToastsContainer";
import SocketProvider from "../components/SocketProvider";
import "../styles/Index.css";

const Index = () => {
  const { auth } = useAuthContext();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  const {
    user: { firstName, lastName, username, avatar },
  } = auth;

  return (
    <SocketProvider>
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
              padding: 10,
              gap: "0.8rem",
            }}
          >
            <img
              src={`http://localhost:3000/${avatar}`}
              className="avatar"
              style={{
                height: 60,
                width: 60,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h4>{`${firstName} ${lastName}`}</h4>
              <span style={{ color: "grey" }}>@{username}</span>
            </div>
          </div>
        </div>
        <div className="view-container">
          <ToastsContainer>
            <Outlet />
          </ToastsContainer>
        </div>
      </main>
    </SocketProvider>
  );
};

export default Index;
