import React, { useEffect } from 'react';
import { ContainerContent, GlobalStyle } from './GlobalStyle';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

const SocketConnection = io('http://localhost:3234/peerConnection', { transports: ['websocket'] })

function App() {

  const peer = new Peer();

  const Success = (stream: MediaStream) => {
    const Container = document.getElementById('Container');
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;

    Container!.appendChild(videoElement);

    SocketConnection.on('get_main_peer', (id: string) => {
      console.log(id, stream);
      peer.call(id, stream);
    })
  }

  const ErrorCath = (error: any) => {
    console.log(error);
  }

  useEffect(() => {
    navigator.mediaDevices.getDisplayMedia({
      video: true
    }).then(Success, ErrorCath);
  }, []);

  return (
    <>
      <GlobalStyle />
      <ContainerContent id="Container">

      </ContainerContent>
    </>
  );
}

export default App;
