// import { useMemo, createContext, useContext } from "react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const PeerContext = React.createContext(null);

// custom hook that uses the peer context
export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);

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

  const createAnswere = async (offer) => {
    await peer.setRemoteDescription(offer);
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    return ans;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleTrackEvent = React.useCallback((ev) => {
    const streams = ev.streams;
    setRemoteStream(streams[0]);
  },[]);

  useEffect(()=>{
    peer.addEventListener('track',handleTrackEvent)
    return ()=>{
      peer.removeEventListener('track', handleTrackEvent)
    }
  }, [handleTrackEvent, peer])

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswere,
        setRemoteAns,
        sendStream,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

// Add PropTypes validation
PeerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
