import "./Home.css";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  //using our custom made hook to get the socket object
  const { socket } = useSocket();
  const navigate = useNavigate();

  //state to store the email and roomId
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  
  // function to handle the joined-room event 
  const handleRoomJoined = useCallback(({ roomId }) => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);

    return () => {
      socket.off("joined-room", handleRoomJoined);
    }
  }, [socket, handleRoomJoined]);

  //function to handle the join room button click
  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId, emailId: email });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email here"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room code"
        />
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  );
};

export default Homepage;
