import { useEffect, useRef } from 'react';

export const useTelemetryWebSocket = (onMessageReceived) => {
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to Gateway Telemetry WebSocket
    const wsUrl = `ws://${window.location.hostname}:8000/api/v1/telemetry/ws`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('Connected to Telemetry WebSocket');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'telemetry') {
          onMessageReceived(data);
        }
      } catch (err) {
        console.error('Error parsing telemetry websocket message:', err);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error('Telemetry WebSocket error:', err);
    };

    wsRef.current.onclose = () => {
      console.log('Telemetry WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onMessageReceived]);

  return wsRef.current;
};
