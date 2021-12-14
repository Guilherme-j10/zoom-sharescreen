import React, { useEffect } from 'react';
import { ContainerContent, GlobalStyle } from './GlobalStyle';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

const SocketConnection = io('https://zoomsocket.cloudcall.tec.br/peerConnection', { transports: ['websocket'] })

function App() {

  const peer = new Peer({
    host: 'zoombk.cloudcall.tec.br',
    port: 3234,
    secure: true,
    path: '/peerAplication',
    debug: 3,
    config: {
      iceServers: [
        { urls: 'turn:34.69.41.255:3478?transport=tcp', credential: 'false', username: 'megaconecta:m364c0n3c74' },
        { urls: 'turn:34.69.41.255:3478?transport=udp', credential: 'false', username: 'megaconecta:m364c0n3c74' }
      ]
    }
  });

  const Success = (stream: MediaStream) => {
    const Container = document.getElementById('Container');
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;

    Container!.appendChild(videoElement);

    SocketConnection.on('get_main_peer_from_reciver', (id) => {
      peer.call(id, stream);
    });

    SocketConnection.emit('peer_main');
    SocketConnection.on('get_main_peer', (id: string) => {
      peer.call(id, stream);
    });
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
