// WebSocketService.js

import io from 'socket.io-client';


//const backendUrl = process.env.VUE_APP_BACKEND_URL; // Ensure this is your backend server URL

let socket;

export const connectToWebSocket = () => {
  //socket = io.connect(backendUrl);
  socket = io('http://localhost:5000');

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  return socket;
};

export const joinDocumentSession = (documentId, userId) => {
  if (socket) {
    socket.emit('join', { documentId, userId });
  } else {
    console.error('WebSocket connection not established');
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

