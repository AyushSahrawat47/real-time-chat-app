import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import ReactPlayer from 'react-player';

const Room = () => {
  const { socket } = useSocket();
  const {peer, createOffer, createAnswere, setRemoteAns, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log(`${emailId} joined the room`);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },  
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from", from, offer);
      const answer = await createAnswere(offer);
      socket.emit("call-accepted", { emailId: from, ans: answer});
      setRemoteEmailId(from);
    },
    [socket, createAnswere]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call accepted with answer", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio : true, 
      video: true
    });
    setMyStream(stream);
  }, [setMyStream]);

  const handleNegotiation = useCallback(async () => {
    console.log("oops! negotiation needed");
    const localOffer = peer.localDescription;
    console.log("localOffer", localOffer);
    console.log("remoteEmailId", remoteEmailId);
    if (localOffer) {
      socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
    }
  }, [remoteEmailId, peer, socket]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleNewUserJoined, handleIncomingCall, handleCallAccepted, socket]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(()=>{
    peer.addEventListener("negotiationneeded",handleNegotiation)
    return ()=>{peer.removeEventListener("negotiationneeded",handleNegotiation)}
  },[peer,handleNegotiation])

  return(
    <>
      <h1>Room</h1>
      <h4>You are connected to {remoteEmailId}</h4>
      <button onClick={() => sendStream(myStream) }>Send Media Stream</button>
      <ReactPlayer url = {myStream} playing={true} muted/> 
      <ReactPlayer url = {remoteStream} playing={true} />
    </>
  ) 
};

export default Room;
