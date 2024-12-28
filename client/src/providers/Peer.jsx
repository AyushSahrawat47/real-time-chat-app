import { useMemo, createContext, useContext } from "react";

const PeerContenxt = createContext(null);

export const usePeer = () => useContext(PeerContenxt);

export const PeerProvider = (props) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.l.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async() => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }
  return (
    <PeerContenxt.Provider value={{ peer, createOffer }}>
      {/* eslint-disable-next-line */}
      {props.children}
    </PeerContenxt.Provider>
  );
};
