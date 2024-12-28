import React, {useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext(null);

// custom hook that uses the socket context
export const useSocket = () =>{
  return React.useContext(SocketContext);
}

export const SocketProvider = (props) => {
  const socket = useMemo(
    () =>
      io('http://localhost:8001'), // change this to the server URL
    []
  );
  return(
    <SocketContext.Provider value={{socket}}>
      {/* eslint-disable-next-line */}
      {props.children}
    </SocketContext.Provider>
  )
};
