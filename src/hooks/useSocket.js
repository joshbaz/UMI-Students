import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =  'http://localhost:5000'; // Adjust as needed

export function useSocket(onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('umi_student_auth_token') || localStorage.getItem('token');
    console.log('token',token);
    if (!token) return;

    // Connect with JWT
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current = socket;

    // Listen for new messages
    if (onMessage) {
      socket.on('new_message', onMessage);
    }

    // Cleanup on unmount
    return () => {
      if (onMessage) socket.off('new_message', onMessage);
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return socketRef.current;
} 