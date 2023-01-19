import socketio from "socket.io-client";
import React from 'react'

// process.env.REACT_APP_SERVER_SOCKET_URL
export const socket = () => {

  return socketio.connect("https://sockettemp.entana.net", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
    extraHeaders: {
      authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
    }
  })
};

export const SocketContext = React.createContext(null);