import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Index from "./views/Index";
import Chats from "./views/Chats";
import Settings from "./views/Settings";
import Requests from "./views/Requests";
import People from "./views/People";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/" element={<Chats />} />
          <Route path="/people" element={<People />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
