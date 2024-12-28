import {useEffect, useCallback} from 'react';
import {useSocket} from '../providers/Socket'
import {PeerProvider, usePeer} from '../providers/Peer'

const Room = () => {
  const {socket} = useSocket();
  const {peer, createOffer} = usePeer();

  const handleNewUserJoined = useCallback(async (data) =>{
    const {emailId} = data;
    console.log(`${emailId} joined the room`)
    const offer = await createOffer();
    socket.emit('call-user', {emailId, offer});
  }, [createOffer, socket]);

  useEffect(() => {
  socket.on('user-joined', handleNewUserJoined)
  }, [handleNewUserJoined, socket]);

  return (
    <div>
        Room 
    </div>
  )
}

export default Room
