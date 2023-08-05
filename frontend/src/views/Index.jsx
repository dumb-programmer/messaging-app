import { Link, Outlet } from "react-router-dom";
import ChatIcon from "../icons/ChatIcon";
import LogoutIcon from "../icons/LogoutIcon";
import PeoplesIcon from "../icons/PeoplesIcon";
import SettingsIcon from "../icons/SettingsIcon";
import "../styles/Index.css";

const Index = () => {
  return (
    <main>
      <div className="tabs">
        <h1>Messaging App</h1>
        <nav>
          <ul>
            <li className="tab">
              <ChatIcon size={24} color="black" strokeWidth={1.5} />
              <Link to="/">Chats</Link>
            </li>
            <li className="tab">
              <PeoplesIcon size={24} color="black" strokeWidth={1.5} />
              <Link to="/people">People</Link>
            </li>
            <li className="tab">
              <PeoplesIcon size={24} color="black" strokeWidth={1.5} />
              <Link to="/requests">Requests</Link>
            </li>
            <li className="tab">
              <SettingsIcon size={24} color="black" strokeWidth={1.5} />
              <Link to="/settings">Settings</Link>
            </li>
            <li className="tab">
              <LogoutIcon size={24} color="black" strokeWidth={1.5} />
              Logout
            </li>
          </ul>
        </nav>
      </div>
      <div className="view-container">
        <Outlet />
      </div>
    </main>
  );
};

export default Index;
