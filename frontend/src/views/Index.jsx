import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
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
  const { auth, updateAuth } = useAuthContext();
  const navigate = useNavigate();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  const {
    user: { firstName, lastName, username, avatar },
  } = auth;

  return (
    <SocketProvider>
      <main>
        <aside style={{ position: "relative" }}>
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
              <div className="flex align-center gap-md">
                <div className="flex flex-column gap-sm">
                  <h4>{`${firstName} ${lastName}`}</h4>
                  <p className="text-sm" style={{ color: "#607274" }}>
                    @{username}
                  </p>
                </div>
                <button
                  aria-label="logout"
                  className="btn"
                  onClick={() => {
                    updateAuth(() => null);
                    navigate("/login");
                  }}
                >
                  <LogoutIcon size={20} strokeWidth={1.5} color="black" />
                </button>
              </div>
            </div>
          </div>
        </aside>
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
