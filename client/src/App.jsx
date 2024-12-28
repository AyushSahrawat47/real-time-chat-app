import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
import Homepage from "./pages/Home";
import Roompage from "./pages/Room";
function App() {
  return (
    <>
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/room/:roomId" element={<Roompage />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </>
  );
}

export default App;
