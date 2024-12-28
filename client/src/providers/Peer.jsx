// import { useMemo, createContext, useContext } from "react";
import React, { useMemo } from "react";
import PropTypes from "prop-types";

const PeerContext = React.createContext(null);

// custom hook that uses the peer context
export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun.l.google.com:5349" },
          { urls: "stun:stun1.l.google.com:3478" },
          { urls: "stun:stun1.l.google.com:5349" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:5349" },
          { urls: "stun:stun3.l.google.com:3478" },
          { urls: "stun:stun3.l.google.com:5349" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:5349" },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  return (
    <PeerContext.Provider value = {{peer, createOffer}}>
      {props.children}
    </PeerContext.Provider>
  );
};


// Add PropTypes validation
PeerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
