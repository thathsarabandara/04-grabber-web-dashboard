import { useEffect, useRef } from 'react';

export function useRobotWebSocket(onMessage) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  
  useEffect(() => {
    let ws;
    let reconnectTimeout;
    
    const connect = () => {
      const getWsUrl = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        if (apiUrl.startsWith('http')) {
          return apiUrl.replace(/^http/, 'ws') + '/robots/ws';
        }
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}${apiUrl}/robots/ws`;
      };
      
      const wsUrl = getWsUrl();
      console.log('[WebSocket] Connecting to:', wsUrl);
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessageRef.current) {
            onMessageRef.current(data);
          }
        } catch (err) {
          console.error('[WebSocket] Error parsing message:', err);
        }
      };
      
      ws.onclose = () => {
        console.log('[WebSocket] Connection closed. Reconnecting in 3 seconds...');
        reconnectTimeout = setTimeout(connect, 3000);
      };
      
      ws.onerror = (err) => {
        console.error('[WebSocket] Error:', err);
        ws.close();
      };
    };
    
    connect();
    
    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);
}
