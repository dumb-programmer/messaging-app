import { useContext } from "react";
import socketContext from "../context/SocketContext";

const useSocketContext = () => useContext(socketContext);

export default useSocketContext;