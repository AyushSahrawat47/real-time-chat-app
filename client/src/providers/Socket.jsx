import React, {useMemo } from "react";
import PropTypes from "prop-types";
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
      {props.children}
    </SocketContext.Provider>
  )
};

// Add PropTypes validation
SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


