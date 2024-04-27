import { NavLink, Navigate, Outlet } from "react-router-dom";
import ChatIcon from "../icons/ChatIcon";
import LogoutIcon from "../icons/LogoutIcon";
import PeoplesIcon from "../icons/PeoplesIcon";
import SettingsIcon from "../icons/SettingsIcon";
import useAuthContext from "../hooks/useAuthContext";
import ToastsContainer from "../components/ToastsContainer";
import SocketProvider from "../components/SocketProvider";
import "../styles/Index.css";
import InboxIcon from "../icons/InboxIcon";

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
                <NavLink to="/">
                  <ChatIcon size={23} color="black" strokeWidth={1.5} />
                  Chats
                </NavLink>
              </li>
              <li className="tab">
                <NavLink to="/people">
                  <PeoplesIcon size={23} color="black" strokeWidth={1.5} />
                  People
                </NavLink>
              </li>
              <li className="tab">
                <NavLink to="/requests">
                  <InboxIcon size={23} color="black" strokeWidth={1.5} />
                  Requests
                </NavLink>
              </li>
              <li className="tab">
                <NavLink to="/settings">
                  <SettingsIcon size={23} color="black" strokeWidth={1.5} />
                  Settings
                </NavLink>
              </li>
              <li className="tab">
                <NavLink to="/logout">
                  <LogoutIcon size={23} color="black" strokeWidth={1.5} />
                  Logout
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="account-info">
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
            <div className="flex flex-column gap-sm">
              <h4>{`${firstName} ${lastName}`}</h4>
              <p className="text-sm" style={{ color: "#607274" }}>@{username}</p>
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
