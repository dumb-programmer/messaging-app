import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Index from "./views/Index";
import Chats from "./views/Chats";
import Settings from "./views/Settings";
import Requests from "./views/Requests";
import People from "./views/People";
import AuthContext from "./context/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import "./styles/global.css";

function App() {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("auth")) || null
  );

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        updateAuth: (cb) => {
          setAuth((auth) => {
            const newAuth = cb(auth);
            localStorage.setItem("auth", JSON.stringify(newAuth));
            return newAuth;
          });
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route index element={<Chats />} />
            <Route path="/people" element={<People />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
